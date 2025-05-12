import { authMiddleware } from "@clerk/nextjs/server";

interface PublicMetadata {
  role?: string;
}

const adminRoutes = [
  "/admin",
  "/admin/activities",
  "/admin/analytics", 
  "/admin/reviews",
  "/admin/users",
  "/api/admin",
  "/dashboard"
];

export default authMiddleware({
  publicRoutes: [
    "/",
    "/activities",
    "/blog",
    "/about",
    "/contact",
    "/locations",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/activities",
    "/api/bookings",
  ],
  afterAuth(auth, req) {
    // Check if accessing admin routes
    if (adminRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
      if (!auth.userId) {
        const signInUrl = new URL('/sign-in', req.url);
        signInUrl.searchParams.set('redirect_url', req.url);
        return Response.redirect(signInUrl);
      }

      const role = (auth.sessionClaims?.publicMetadata as PublicMetadata)?.role;
      const isAdmin = role === "admin";
      
      if (!isAdmin) {
        return Response.redirect(new URL('/', req.url));
      }
    }

    // Redirect signed-in users away from auth pages
    if (auth.userId && ['/sign-in', '/sign-up'].some(path => 
      req.nextUrl.pathname.startsWith(path))) {
      return Response.redirect(new URL('/', req.url));
    }
  },
});

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};