import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { API_URL, WS_URL } = process?.env || {};
  return NextResponse.json({
    API_URL,
    WS_URL,
  });
}
