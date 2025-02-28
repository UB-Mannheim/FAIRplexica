import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Define paths that require authentication
  const protectedPaths = ['/settings']
  
  // Check if the path is in the protected paths list
  const isProtectedPath = protectedPaths.some(pp => 
    path === pp || path.startsWith(`${pp}/`)
  )
  
  if (isProtectedPath) {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    })
    
    // Redirect to login if no token exists
    if (!token) {
      const url = new URL('/api/auth/signin', request.url)
      url.searchParams.set('callbackUrl', encodeURI(request.url))
      return NextResponse.redirect(url)
    }
  }
  
  return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ['/settings', '/settings/:path*']
}