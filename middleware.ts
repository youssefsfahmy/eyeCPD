import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request,
  });

  console.log("Middleware executed for request:", request.nextUrl.pathname);

  // const user = request.cookies.get("user")?.value;

  // if (
  //   request.nextUrl.pathname !== "/" &&
  //   !request.nextUrl.pathname.startsWith("/login") &&
  //   !request.nextUrl.pathname.startsWith("/api/auth") &&
  //   !request.nextUrl.pathname.startsWith("/auth") &&
  //   !request.nextUrl.pathname.startsWith("/cpd-provider") &&
  //   !request.nextUrl.pathname.startsWith("/pricing") &&
  //   !request.nextUrl.pathname.startsWith("/api/subscriptions") &&
  //   !request.nextUrl.pathname.startsWith("/error")
  // ) {
  //   // no user, potentially respond by redirecting the user to the login page
  //   console.log(
  //     "No user found, redirecting to /auth/login",
  //     request.nextUrl.pathname
  //   );
  //   const url = request.nextUrl.clone();
  //   url.pathname = "/";
  //   return { response: NextResponse.redirect(url), user: null };
  // }

  // if (
  //   user &&
  //   (request.nextUrl.pathname === "/" ||
  //     request.nextUrl.pathname.startsWith("/auth")) &&
  //   !request.nextUrl.pathname.startsWith("/auth/complete-profile")
  // ) {
  //   const url = request.nextUrl.clone();
  //   console.log(
  //     "User is authenticated & trying to access",
  //     url.pathname,
  //     "redirecting to /opt"
  //   );

  //   url.pathname = "/opt";
  //   return { response: NextResponse.redirect(url), user };
  // }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
