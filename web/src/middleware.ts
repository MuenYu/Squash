import { auth } from "@/auth";

export default auth((req) => {
  if (!req.auth) {
    const newUrl = new URL("/", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/panel/:path*", "/api/progress/:path*", "/api/videos/:path*"],
};
