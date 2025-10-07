import { NextResponse } from 'next/server';
import {
  adminCookieName,
  createAdminToken,
  validateAdminCredentials,
} from '@/lib/auth';

export const POST = async (req: Request) => {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password are required' },
        { status: 400 },
      );
    }

    const isValid = validateAdminCredentials(username, password);

    if (!isValid) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = createAdminToken(username);

    const response = NextResponse.json({ message: 'Login successful' });
    response.cookies.set({
      name: adminCookieName,
      value: token,
      httpOnly: true,
      maxAge: 60 * 60 * 6, // 6 hours
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Failed to login admin:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
};
