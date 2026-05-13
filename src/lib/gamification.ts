import prisma from './prisma';

// XP thresholds per level
const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 3800,
  4700, 5700, 6800, 8000, 9500, 11000, 13000, 15000, 17500, 20000,
  23000, 26000, 29500, 33000, 37000, 41000, 45500, 50000, 55000, 60000,
  66000, 72000, 78500, 85000, 92000, 99000, 107000, 115000, 124000, 133000,
  143000, 153000, 164000, 175000, 187000, 199000, 212000, 225000, 240000, 255000,
];

export function getTierForLevel(level: number): string {
  if (level <= 5) return 'ROOKIE';
  if (level <= 15) return 'RISING_STAR';
  if (level <= 30) return 'INFLUENCER';
  if (level <= 50) return 'VIRAL_MASTER';
  return 'LEGEND';
}

export function getLevelForXP(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

export function getXPForNextLevel(currentLevel: number): number {
  if (currentLevel >= LEVEL_THRESHOLDS.length) return LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + 20000;
  return LEVEL_THRESHOLDS[currentLevel]; // next level threshold
}

export function getXPProgress(totalXP: number, currentLevel: number): { current: number; required: number; percentage: number } {
  const currentThreshold = currentLevel > 1 ? LEVEL_THRESHOLDS[currentLevel - 1] : 0;
  const nextThreshold = getXPForNextLevel(currentLevel);
  const current = totalXP - currentThreshold;
  const required = nextThreshold - currentThreshold;
  return { current, required, percentage: Math.min(Math.round((current / required) * 100), 100) };
}

export async function awardXP(userId: string, amount: number, source: string, metadata?: Record<string, unknown>) {
  // Create XP event
  await prisma.xPEvent.create({
    data: { userId, amount, source, metadata: metadata ? JSON.stringify(metadata) : null },
  });

  // Update user
  const user = await prisma.user.update({
    where: { id: userId },
    data: { totalXP: { increment: amount } },
  });

  // Check for level up
  const newLevel = getLevelForXP(user.totalXP);
  if (newLevel > user.currentLevel) {
    await prisma.user.update({
      where: { id: userId },
      data: { currentLevel: newLevel, creatorTier: getTierForLevel(newLevel) },
    });
  }

  return { totalXP: user.totalXP, newLevel, leveledUp: newLevel > user.currentLevel };
}

export async function checkAndAwardBadges(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { simulations: true, badges: true, workspaceMembers: true },
  });
  if (!user) return [];

  const allBadges = await prisma.badge.findMany();
  const earnedBadgeIds = user.badges.map(b => b.badgeId);
  const newBadges: string[] = [];

  for (const badge of allBadges) {
    if (earnedBadgeIds.includes(badge.id)) continue;
    const criteria = JSON.parse(badge.criteria);
    let earned = false;

    switch (criteria.type) {
      case 'sim_count':
        earned = user.simulations.length >= criteria.threshold;
        break;
      case 'level':
        earned = user.currentLevel >= criteria.threshold;
        break;
      case 'virality_score':
        earned = user.simulations.some(s => s.viralityScore >= criteria.threshold);
        break;
      case 'engagement_rate':
        earned = user.simulations.some(s => s.engagementRate >= criteria.threshold);
        break;
      case 'platform_count':
        const platforms = new Set(user.simulations.map(s => s.platform));
        earned = platforms.size >= criteria.threshold;
        break;
      case 'workspace_join':
        earned = user.workspaceMembers.length >= criteria.threshold;
        break;
      case 'total_xp':
        earned = user.totalXP >= criteria.threshold;
        break;
    }

    if (earned) {
      await prisma.userBadge.create({ data: { userId, badgeId: badge.id } });
      await awardXP(userId, badge.xpReward, 'badge_earned', { badgeName: badge.name });
      newBadges.push(badge.name);
    }
  }

  return newBadges;
}
