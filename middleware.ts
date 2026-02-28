import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // ProseMirror is main nav — redirect / to /prosemirror when no demo param
  if (request.nextUrl.pathname === '/' && !request.nextUrl.searchParams.get('demo')) {
    return NextResponse.redirect(new URL('/prosemirror', request.url));
  }
  return NextResponse.next();
}
