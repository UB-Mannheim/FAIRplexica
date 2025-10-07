import { NextResponse } from 'next/server';
import { adminCookieName } from '@/lib/auth';

export const POST = async () => {
  try {
    const response = NextResponse.json({ message: 'Logged out' });
    response.cookies.set({
      name: adminCookieName,
      value: '',
      httpOnly: true,
      maxAge: 0,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Failed to logout admin:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
};
