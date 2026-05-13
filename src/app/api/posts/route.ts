import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const posts = await prisma.post.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    include: { simulations: { orderBy: { createdAt: 'desc' }, take: 1 } },
  });
  return NextResponse.json(posts.map(p => ({ ...p, hashtags: JSON.parse(p.hashtags), keywords: JSON.parse(p.keywords), mediaUrls: JSON.parse(p.mediaUrls) })));
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await req.json();
  const post = await prisma.post.create({
    data: {
      userId: session.user.id, platform: data.platform, contentType: data.contentType || 'TEXT',
      title: data.title, body: data.body || '', hashtags: JSON.stringify(data.hashtags || []),
      keywords: JSON.stringify(data.keywords || []), mediaUrls: JSON.stringify(data.mediaUrls || []),
      seoTitle: data.seoTitle, seoDescription: data.seoDescription, scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : null,
    },
  });
  return NextResponse.json({ ...post, hashtags: JSON.parse(post.hashtags), keywords: JSON.parse(post.keywords) }, { status: 201 });
}
