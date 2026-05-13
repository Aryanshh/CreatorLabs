import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const users = await prisma.user.findMany({
    orderBy: { totalXP: 'desc' },
    take: 50,
    select: {
      id: true, name: true, totalXP: true, currentLevel: true, creatorTier: true,
      _count: { select: { simulations: true, badges: true } },
    },
  });

  return NextResponse.json(users.map((u, i) => ({
    rank: i + 1,
    id: u.id,
    name: u.name || 'Anonymous',
    totalXP: u.totalXP,
    level: u.currentLevel,
    tier: u.creatorTier,
    simulations: u._count.simulations,
    badges: u._count.badges,
  })));
}
