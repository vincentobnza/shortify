import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// In Next.js 15, the route handlers need to follow a specific type pattern
export async function GET(
  request: NextRequest,
  { params }: { params: { shortId: string } }
) {
  const { shortId } = params;

  try {
    // Find the original URL in Supabase
    const { data, error } = await supabase
      .from("urls")
      .select("original_url")
      .eq("short_id", shortId)
      .single();
    if (error || !data) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Fire and forget click increment
    // We don't await this to avoid blocking the redirect
    setTimeout(() => {
      supabase
        .from("urls")
        .update({
          clicks: supabase.rpc("increment_clicks", { row_id: shortId }),
        })
        .eq("short_id", shortId)
        .then(() => {
          console.log(`Incremented click count for ${shortId}`);
        })
        .catch((err: unknown) => {
          const error = err instanceof Error ? err : new Error(String(err));
          console.error(`Failed to increment click count: ${error.message}`);
        });
    }, 0); // Redirect to the original URL
    return NextResponse.redirect(new URL(data.original_url));
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("Error handling short URL:", error.message);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
