import { create } from "zustand";
import { nanoid } from "nanoid";
import { supabase } from "@/lib/supabase";

interface UrlState {
  originalUrl: string;
  shortUrl: string;
  isLoading: boolean;
  error: string | null;
  urlList: UrlEntry[];
  setOriginalUrl: (url: string) => void;
  setShortUrl: (shortUrl: string) => void;
  generateShortUrl: () => Promise<void>;
  fetchAllUrls: () => Promise<void>;
  copyToClipboard: (text: string) => Promise<boolean>;
  resetState: () => void;
  deleteUrl: (id: string) => Promise<void>;
}

export interface UrlEntry {
  id: string;
  original_url: string;
  short_id: string;
  created_at: string;
  clicks: number;
}

export const useUrlStore = create<UrlState>((set, get) => ({
  originalUrl: "",
  shortUrl: "",
  isLoading: false,
  error: null,
  urlList: [],

  setOriginalUrl: (url) => set({ originalUrl: url }),

  setShortUrl: (shortUrl) => set({ shortUrl }),

  generateShortUrl: async () => {
    const { originalUrl } = get();

    // Validate URL
    try {
      new URL(originalUrl);
    } catch {
      set({
        error: "Please enter a valid URL including http:// or https://",
        isLoading: false,
      });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const shortId = nanoid(8); // Generate an 8-character short ID

      // Store in Supabase
      const { error } = await supabase
        .from("urls")
        .insert([{ original_url: originalUrl, short_id: shortId, clicks: 0 }])
        .select();

      if (error) throw error;

      const baseUrl = window.location.origin;
      const newShortUrl = `${baseUrl}/${shortId}`;

      set({
        shortUrl: newShortUrl,
        isLoading: false,
        originalUrl: "", // Reset original URL after successful generation
      });

      // Refresh the URL list
      get().fetchAllUrls();
    } catch (error: unknown) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
        isLoading: false,
      });
    }
  },

  fetchAllUrls: async () => {
    set({ isLoading: true, error: null });

    try {
      const { data, error } = await supabase
        .from("urls")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      set({ urlList: data || [], isLoading: false });
    } catch (error: unknown) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
        isLoading: false,
      });
    }
  },

  copyToClipboard: async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error("Failed to copy:", error);
      return false;
    }
  },

  resetState: () =>
    set({
      originalUrl: "",
      shortUrl: "",
      error: null,
    }),

  deleteUrl: async (id) => {
    set({ isLoading: true, error: null });

    try {
      const { error } = await supabase.from("urls").delete().eq("id", id);
      if (error) throw error;
      get().fetchAllUrls();
    } catch (error: unknown) {
      set({
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
        isLoading: false,
      });
    }
  },
}));
