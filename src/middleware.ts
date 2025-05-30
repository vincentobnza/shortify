import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const APP_ROUTES = ["/about", "/sign-in", "/sign-up"];

// Define public routes (routes that don't require authentication)
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/about",
]);

export default clerkMiddleware(async (auth, req) => {
  const path = req.nextUrl.pathname;

  // Handle Clerk authentication first
  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  // Skip processing for Next.js internal routes, API routes, static files, and app routes
  if (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.includes(".") ||
    path === "/" ||
    APP_ROUTES.some((route) => path === route || path.startsWith(`${route}/`))
  ) {
    return NextResponse.next();
  }

  // Extract the short ID from the URL (remove the leading slash)
  const shortId = path.slice(1);

  try {
    // Find the URL in the database
    const { data, error } = await supabase
      .from("urls")
      .select("original_url")
      .eq("short_id", shortId)
      .single();

    if (error || !data) {
      // Short URL not found, redirect to home page
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Increment the click count in the background
    // Note: This async operation might not complete before the redirect
    Promise.resolve(
      supabase
        .from("urls")
        .update({
          clicks: supabase.rpc("increment_clicks", { row_id: shortId }),
        })
        .eq("short_id", shortId)
    )
      .then(() => {
        console.log(`Incremented click count for ${shortId}`);
      })
      .catch((error) => {
        if (error instanceof Error) {
          console.error("Error incrementing click count:", error);
        }
      });

    return NextResponse.redirect(new URL(data.original_url));
  } catch (error) {
    console.error("Error in middleware:", error);
    return NextResponse.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
