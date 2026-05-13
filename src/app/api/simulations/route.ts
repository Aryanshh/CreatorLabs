import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { runSimulation, PostInput } from '@/lib/simulation-engine';
import { awardXP, checkAndAwardBadges } from '@/lib/gamification';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { postId } = await req.json();
  if (!postId) return NextResponse.json({ error: 'postId required' }, { status: 400 });

  const post = await prisma.post.findFirst({ where: { id: postId, userId: session.user.id } });
  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  // Update post status
  await prisma.post.update({ where: { id: postId }, data: { status: 'SIMULATING' } });

  // Run simulation
  const input: PostInput = {
    platform: post.platform, contentType: post.contentType, body: post.body,
    title: post.title || undefined, hashtags: JSON.parse(post.hashtags),
    keywords: JSON.parse(post.keywords), scheduledFor: post.scheduledFor?.toISOString(),
    seoTitle: post.seoTitle || undefined, seoDescription: post.seoDescription || undefined,
    userLevel: user.currentLevel,
  };

  const result = runSimulation(input);

  // Save simulation
  const simulation = await prisma.simulation.create({
    data: {
      postId, userId: session.user.id, platform: post.platform,
      impressions: result.impressions, reach: result.reach, likes: result.likes,
      comments: result.comments, shares: result.shares, saves: result.saves,
      engagementRate: result.engagementRate, viralityScore: result.viralityScore,
      algorithmFactors: JSON.stringify(result.algorithmFactors),
      recommendations: JSON.stringify(result.recommendations),
      timeline: JSON.stringify(result.timeline),
      status: 'COMPLETED', completedAt: new Date(),
    },
  });

  // Update post status
  await prisma.post.update({ where: { id: postId }, data: { status: 'SIMULATED' } });

  // Award XP
  let xpAmount = 50; // base XP for running simulation
  if (result.engagementRate > 5) xpAmount += 50;
  if (result.viralityScore > 70) xpAmount += 100;
  await awardXP(session.user.id, xpAmount, 'simulation_run', { simulationId: simulation.id, platform: post.platform });

  // Check badges
  const newBadges = await checkAndAwardBadges(session.user.id);

  // Update daily analytics
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  await prisma.userAnalytics.upsert({
    where: { userId_date: { userId: session.user.id, date: today } },
    update: {
      simulationsRun: { increment: 1 },
      avgEngagement: result.engagementRate,
      avgVirality: result.viralityScore,
      topPlatform: post.platform,
      xpEarned: { increment: xpAmount },
    },
    create: {
      userId: session.user.id, date: today, simulationsRun: 1,
      avgEngagement: result.engagementRate, avgVirality: result.viralityScore,
      topPlatform: post.platform, xpEarned: xpAmount,
    },
  });

  return NextResponse.json({
    simulation: { ...simulation, algorithmFactors: result.algorithmFactors, recommendations: result.recommendations, timeline: result.timeline },
    xpAwarded: xpAmount, newBadges,
  }, { status: 201 });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const sims = await prisma.simulation.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: { post: true },
  });
  return NextResponse.json(sims.map(s => ({
    ...s,
    algorithmFactors: s.algorithmFactors ? JSON.parse(s.algorithmFactors) : null,
    recommendations: s.recommendations ? JSON.parse(s.recommendations) : null,
    timeline: s.timeline ? JSON.parse(s.timeline) : null,
    post: s.post ? { ...s.post, hashtags: JSON.parse(s.post.hashtags), keywords: JSON.parse(s.post.keywords) } : null,
  })));
}
