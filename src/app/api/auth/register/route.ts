import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import prisma from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name } = body;
    
    console.log('Registration attempt for:', email);

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      console.log('User already exists:', email);
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }
    
    const passwordHash = await hash(password, 12);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    console.log('Creating user in database...');
    const user = await prisma.user.create({
      data: { 
        email, 
        passwordHash, 
        name: name || email.split('@')[0],
        verificationToken
      },
    });
    console.log('User created successfully:', user.id);

    // Send verification email (don't await to avoid blocking/timeout)
    sendVerificationEmail(email, verificationToken).catch(err => {
      console.error('Background Email Error:', err);
    });

    return NextResponse.json({ 
      id: user.id, 
      email: user.email, 
      name: user.name,
      message: 'Check your email to verify your account.'
    }, { status: 201 });
  } catch (error: any) {
    console.error('VERBOSE Registration error:', error.message, error.stack);
    return NextResponse.json({ 
      error: 'Registration failed', 
      details: error.message 
    }, { status: 500 });
  }
}
