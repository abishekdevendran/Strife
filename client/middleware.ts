import { NextRequest, NextResponse } from 'next/server';

//redirect to login page if not logged in and trying to access a restricted page
export default async function authMiddleware(req: NextRequest) {
  //define set of protected pages
  const antiProtectedPages = ['/login*', '/register*'];
  //check if the current page is protected
  const isAntiProtected = antiProtectedPages.some((page) =>
    //regex match
    req.nextUrl.pathname.match(page)
  );
  //if the page is protected and the user is not logged in, redirect to login page
  if (!isAntiProtected) {
    return NextResponse.next();
  }
  const url = req.nextUrl.clone();
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
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
}
