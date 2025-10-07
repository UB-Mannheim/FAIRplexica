import { authenticateAdminRequest } from '@/lib/auth';

export const GET = async (req: Request) => {
  try {
    const admin = authenticateAdminRequest(req);

    if (!admin) {
      return Response.json({ authenticated: false }, { status: 401 });
    }

    return Response.json({ authenticated: true, username: admin.username });
  } catch (error) {
    console.error('Failed to check admin session:', error);
    return Response.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
};
