import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Skip API routes, static files, and the root path
  if (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.includes(".") ||
    path === "/"
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
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Increment the click count in the background
    (async () => {
      try {
        await supabase
          .from("urls")
          .update({
            clicks: supabase.rpc("increment_clicks", { row_id: shortId }),
          })
          .eq("short_id", shortId);
        console.log(`Incremented click count for ${shortId}`);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(`Failed to increment click count: ${error.message}`);
        }
      }
    })();

    // Redirect to the original URL
    return NextResponse.redirect(new URL(data.original_url));
  } catch (error) {
    console.error("Error in middleware:", error);
    // If there's an error, redirect to home
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: "/:path*",
};
