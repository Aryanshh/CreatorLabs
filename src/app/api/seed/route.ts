import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { hash } from 'bcryptjs';

export async function POST() {
  try {
    // Seed Levels
    const levels = [
      { number: 1, xpRequired: 0, title: 'Content Newbie' },
      { number: 2, xpRequired: 100, title: 'Post Apprentice' },
      { number: 3, xpRequired: 250, title: 'Caption Crafter' },
      { number: 4, xpRequired: 500, title: 'Hashtag Hunter' },
      { number: 5, xpRequired: 800, title: 'Content Creator' },
      { number: 6, xpRequired: 1200, title: 'Rising Star' },
      { number: 7, xpRequired: 1700, title: 'Trend Spotter' },
      { number: 8, xpRequired: 2300, title: 'Engagement Expert' },
      { number: 9, xpRequired: 3000, title: 'Algorithm Adept' },
      { number: 10, xpRequired: 3800, title: 'Viral Strategist' },
      { number: 15, xpRequired: 9500, title: 'Platform Pro' },
      { number: 20, xpRequired: 20000, title: 'Influencer' },
      { number: 25, xpRequired: 37000, title: 'Content Mogul' },
      { number: 30, xpRequired: 60000, title: 'Viral Master' },
      { number: 40, xpRequired: 133000, title: 'Digital Legend' },
      { number: 50, xpRequired: 255000, title: 'Creator God' },
    ];
    for (const level of levels) {
      await prisma.level.upsert({ where: { number: level.number }, update: level, create: level });
    }

    // Seed Badges
    const badges = [
      { name: 'First Flight', description: 'Run your first simulation', iconEmoji: 'SIM', category: 'MILESTONE', criteria: JSON.stringify({ type: 'sim_count', threshold: 1 }), xpReward: 100 },
      { name: 'Getting Serious', description: 'Run 10 simulations', iconEmoji: 'SIM+', category: 'MILESTONE', criteria: JSON.stringify({ type: 'sim_count', threshold: 10 }), xpReward: 200 },
      { name: 'Content Machine', description: 'Run 50 simulations', iconEmoji: 'SIM++', category: 'MILESTONE', criteria: JSON.stringify({ type: 'sim_count', threshold: 50 }), xpReward: 500 },
      { name: 'Simulation Master', description: 'Run 100 simulations', iconEmoji: 'PRO', category: 'MILESTONE', criteria: JSON.stringify({ type: 'sim_count', threshold: 100 }), xpReward: 1000 },
      { name: 'Platform Hopper', description: 'Simulate on 3+ platforms', iconEmoji: '3X', category: 'PLATFORM_MASTERY', criteria: JSON.stringify({ type: 'platform_count', threshold: 3 }), xpReward: 300 },
      { name: 'Platform Conqueror', description: 'Simulate on all 6 platforms', iconEmoji: '6X', category: 'PLATFORM_MASTERY', criteria: JSON.stringify({ type: 'platform_count', threshold: 6 }), xpReward: 750 },
      { name: 'Viral Sensation', description: 'Score 80+ virality', iconEmoji: 'VIR', category: 'ENGAGEMENT', criteria: JSON.stringify({ type: 'virality_score', threshold: 80 }), xpReward: 400 },
      { name: 'Engagement King', description: 'Achieve 8%+ engagement rate', iconEmoji: 'ENG', category: 'ENGAGEMENT', criteria: JSON.stringify({ type: 'engagement_rate', threshold: 8 }), xpReward: 350 },
      { name: 'Rising Star', description: 'Reach level 6', iconEmoji: 'STR', category: 'MILESTONE', criteria: JSON.stringify({ type: 'level', threshold: 6 }), xpReward: 250 },
      { name: 'Influencer Status', description: 'Reach level 16', iconEmoji: 'INF', category: 'MILESTONE', criteria: JSON.stringify({ type: 'level', threshold: 16 }), xpReward: 500 },
      { name: 'XP Collector', description: 'Earn 5000 total XP', iconEmoji: 'XP+', category: 'MILESTONE', criteria: JSON.stringify({ type: 'total_xp', threshold: 5000 }), xpReward: 200 },
      { name: 'Team Player', description: 'Join a workspace', iconEmoji: 'TEAM', category: 'COLLABORATION', criteria: JSON.stringify({ type: 'workspace_join', threshold: 1 }), xpReward: 150 },
    ];
    for (const badge of badges) {
      await prisma.badge.upsert({ where: { name: badge.name }, update: badge, create: badge });
    }

    // Demo user
    const passwordHash = await hash('demo123', 12);
    const user = await prisma.user.upsert({
      where: { email: 'demo@creatorlabs.com' },
      update: { emailVerified: new Date() },
      create: { 
        email: 'demo@creatorlabs.com', 
        name: 'Demo Creator', 
        passwordHash, 
        totalXP: 0, 
        currentLevel: 1, 
        creatorTier: 'ROOKIE',
        emailVerified: new Date()
      },
    });

    // Unlockable features
    const features = [
      { name: 'Instagram Simulator', description: 'Simulate Instagram posts', requiredLevel: 1, featureKey: 'sim_instagram' },
      { name: 'Twitter Simulator', description: 'Simulate Twitter posts', requiredLevel: 1, featureKey: 'sim_twitter' },
      { name: 'TikTok Simulator', description: 'Simulate TikTok content', requiredLevel: 6, featureKey: 'sim_tiktok' },
      { name: 'YouTube Simulator', description: 'Simulate YouTube videos', requiredLevel: 6, featureKey: 'sim_youtube' },
      { name: 'LinkedIn Simulator', description: 'Simulate LinkedIn posts', requiredLevel: 16, featureKey: 'sim_linkedin' },
      { name: 'Threads Simulator', description: 'Simulate Threads posts', requiredLevel: 16, featureKey: 'sim_threads' },
      { name: 'Advanced Analytics', description: 'Detailed analytics', requiredLevel: 10, featureKey: 'advanced_analytics' },
      { name: 'Workspaces', description: 'Collaborative workspaces', requiredLevel: 16, featureKey: 'workspaces' },
      { name: 'Hashtag Pro', description: 'Advanced hashtag analysis', requiredLevel: 8, featureKey: 'hashtag_pro' },
      { name: 'Leaderboard', description: 'Global leaderboard', requiredLevel: 5, featureKey: 'leaderboard' },
    ];
    for (const f of features) {
      await prisma.unlockableFeature.upsert({ where: { featureKey: f.featureKey }, update: f, create: f });
    }

    return NextResponse.json({ success: true, demoUser: user.email, message: 'Database seeded!' });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
