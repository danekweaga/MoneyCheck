import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { fetchProfileIsComplete } from "@/lib/supabase/middleware-helpers";

const PROTECTED_ROUTES = ["/dashboard", "/check", "/history", "/settings", "/onboarding"];
const NEEDS_PROFILE_ROUTES = ["/dashboard", "/check", "/history", "/settings"];
const AUTH_ROUTES = ["/login", "/signup"];

function routeMatch(pathname: string, route: string): boolean {
  return pathname === route || pathname.startsWith(`${route}/`);
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isProtected = PROTECTED_ROUTES.some((r) => routeMatch(pathname, r));
  const needsProfile = NEEDS_PROFILE_ROUTES.some((r) => routeMatch(pathname, r));
  const isAuthPath = AUTH_ROUTES.some((r) => routeMatch(pathname, r));
  const hasProfile = user ? await fetchProfileIsComplete(supabase, user.id) : false;

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && isAuthPath) {
    const url = request.nextUrl.clone();
    url.pathname = hasProfile ? "/dashboard" : "/onboarding";
    return NextResponse.redirect(url);
  }

  if (user && pathname.startsWith("/onboarding") && hasProfile) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  if (user && needsProfile && !hasProfile) {
    const url = request.nextUrl.clone();
    url.pathname = "/onboarding";
    return NextResponse.redirect(url);
  }

  return response;
}
