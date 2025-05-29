import { supabase } from "@/lib/supabase";
import { nanoid } from "nanoid";
import { ErrorResponse, SuccessResponse } from "@/lib/api-response";
import {
  CreateUrlRequest,
  CreateUrlResponse,
  GetUrlsResponse,
} from "@/types/url";

export async function POST(request: Request) {
  try {
    const { url } = (await request.json()) as CreateUrlRequest;

    // Validate URL
    try {
      new URL(url);
    } catch {
      return ErrorResponse(
        "Invalid URL. Please include http:// or https://",
        400
      );
    }

    const shortId = nanoid(8);

    // Store in Supabase
    const { error } = await supabase
      .from("urls")
      .insert([{ original_url: url, short_id: shortId, clicks: 0 }])
      .select();

    if (error) {
      throw error;
    }

    return SuccessResponse<CreateUrlResponse>({
      shortId,
      original_url: url,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create short URL";
    return ErrorResponse(errorMessage, 500);
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");

    const { data, error } = await supabase
      .from("urls")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return SuccessResponse<GetUrlsResponse>({ urls: data || [] });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch URLs";
    return ErrorResponse(errorMessage, 500);
  }
}
