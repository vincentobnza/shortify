export interface UrlEntry {
  id: string;
  original_url: string;
  short_id: string;
  created_at: string;
  clicks: number;
}

export interface CreateUrlRequest {
  url: string;
}

export interface CreateUrlResponse {
  shortId: string;
  original_url: string;
}

export interface GetUrlsResponse {
  urls: UrlEntry[];
}
