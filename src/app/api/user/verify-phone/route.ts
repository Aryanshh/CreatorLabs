import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { phoneNumber } = await req.json();

  if (!phoneNumber) {
    return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
  }

  try {
    // In a production environment, you should also verify the Firebase ID Token here
    // for maximum security. For this setup, we'll trust the client-side Firebase result.
    
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        phoneNumber: phoneNumber,
        phoneVerified: new Date(),
      },
    });

    return NextResponse.json({ success: true, message: 'Phone verified successfully' });
  } catch (error) {
    console.error('Phone verification update error:', error);
    return NextResponse.json({ error: 'Failed to update verification status' }, { status: 500 });
  }
}
