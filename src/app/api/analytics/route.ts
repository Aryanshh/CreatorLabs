import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const [user, simulations, analytics, recentSims] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id }, include: { badges: true } }),
    prisma.simulation.count({ where: { userId: session.user.id } }),
    prisma.userAnalytics.findMany({
      where: { userId: session.user.id },
      orderBy: { date: 'desc' },
      take: 30,
    }),
    prisma.simulation.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { post: true },
    }),
  ]);

  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Platform distribution
  const platformCounts = await prisma.simulation.groupBy({
    by: ['platform'],
    where: { userId: session.user.id },
    _count: true,
  });

  // Avg metrics
  const avgMetrics = await prisma.simulation.aggregate({
    where: { userId: session.user.id },
    _avg: { engagementRate: true, viralityScore: true, impressions: true, likes: true },
  });

  return NextResponse.json({
    overview: {
      totalSimulations: simulations,
      avgEngagement: Math.round((avgMetrics._avg.engagementRate || 0) * 100) / 100,
      avgVirality: Math.round((avgMetrics._avg.viralityScore || 0) * 10) / 10,
      avgImpressions: Math.round(avgMetrics._avg.impressions || 0),
      avgLikes: Math.round(avgMetrics._avg.likes || 0),
      badgesEarned: user.badges.length,
      level: user.currentLevel,
      tier: user.creatorTier,
    },
    platformDistribution: platformCounts.map(p => ({ platform: p.platform, count: p._count })),
    dailyAnalytics: analytics.reverse(),
    recentSimulations: recentSims.map(s => ({
      ...s,
      algorithmFactors: s.algorithmFactors ? JSON.parse(s.algorithmFactors) : null,
      recommendations: s.recommendations ? JSON.parse(s.recommendations) : null,
      timeline: s.timeline ? JSON.parse(s.timeline) : null,
      post: s.post ? { ...s.post, hashtags: JSON.parse(s.post.hashtags) } : null,
    })),
  });
}
