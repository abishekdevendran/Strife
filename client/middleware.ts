import { NextRequest, NextResponse } from 'next/server';

//redirect to login page if not logged in and trying to access a restricted page
export default async function authMiddleware(req: NextRequest) {
  const antiAuthPaths = ['/login', '/register'];
  //check if path is in antiAuthPaths
  const match=antiAuthPaths.some((path) => {
    if (req.nextUrl.pathname === path) {
      return true;
    }
  })
  if(!match){
    return NextResponse.next();
  }
  //if no cookies, redirect to login page
  const url = req.nextUrl.clone();
  if (!req.cookies) {
    return NextResponse.next();
  }
  try {
    url.pathname = '/api/user';
    const res = await fetch(url, {
      headers: {
        cookie: req.headers.get('cookie')!
      }
    });
    if (res.ok) {
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  } catch (err) {
    console.log(err);
  }
  return NextResponse.next();
}
