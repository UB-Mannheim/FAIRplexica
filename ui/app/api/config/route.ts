import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { NEXT_PUBLIC_API_URL, NEXT_PUBLIC_WS_URL } = process?.env || {};
  return NextResponse.json({
    NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_WS_URL,
  });
}
