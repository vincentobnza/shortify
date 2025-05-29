import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { shortId: string } }
) {
  const shortId = params.shortId;

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

    // Increment click count (without waiting for response)
    supabase
      .from("urls")
      .update({ clicks: supabase.rpc("increment_clicks", { row_id: shortId }) })
      .eq("short_id", shortId)
      .then(() => {
        console.log(`Incremented click count for ${shortId}`);
      })
      .catch((error) => {
        console.error(`Failed to increment click count: ${error.message}`);
      });

    // Redirect to the original URL
    return NextResponse.redirect(new URL(data.original_url));
  } catch (error) {
    console.error("Error handling short URL:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
