import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { getXPProgress, getXPForNextLevel, getTierForLevel } from '@/lib/gamification';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      badges: { include: { badge: true }, orderBy: { earnedAt: 'desc' } },
      xpHistory: { orderBy: { createdAt: 'desc' }, take: 20 },
      simulations: { select: { id: true } },
    },
  });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const allBadges = await prisma.badge.findMany();
  const earnedBadgeIds = user.badges.map(b => b.badgeId);
  const progress = getXPProgress(user.totalXP, user.currentLevel);

  return NextResponse.json({
    totalXP: user.totalXP,
    currentLevel: user.currentLevel,
    creatorTier: user.creatorTier,
    tierDisplay: getTierForLevel(user.currentLevel).replace(/_/g, ' '),
    xpProgress: progress,
    xpForNextLevel: getXPForNextLevel(user.currentLevel),
    simulationsRun: user.simulations.length,
    badges: {
      earned: user.badges.map(ub => ({ ...ub.badge, earnedAt: ub.earnedAt })),
      all: allBadges.map(b => ({ ...b, criteria: JSON.parse(b.criteria), earned: earnedBadgeIds.includes(b.id) })),
    },
    recentXP: user.xpHistory.map(e => ({ ...e, metadata: e.metadata ? JSON.parse(e.metadata) : null })),
  });
}
