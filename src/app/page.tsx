// Updated Home component (parent)
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useUrlStore } from "@/store/url-store";
import { Stats } from "@/app/stats";
import Footer from "./footer";
import UrlList from "./url-list";
import Header from "./header";
import Image from "next/image";
import ShortenerForm from "./shortener-form";

export default function Home() {
  const {
    shortUrl,
    isLoading,
    error,
    urlList,
    fetchAllUrls,
    setOriginalUrl,
    generateShortUrl,
    copyToClipboard,
  } = useUrlStore();
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetchAllUrls();
  }, [fetchAllUrls]);

  const handleUrlSubmit = async (url: string) => {
    setOriginalUrl(url);
    await generateShortUrl();
  };

  const handleCopy = async (text: string, id: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(id);
      toast.success("URL copied to clipboard");
      setTimeout(() => setCopied(null), 2000);
    } else {
      toast.error("Failed to copy URL");
    }
  };

  return (
    <div className="w-full max-w-screen-lg mx-auto p-5 min-h-screen">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="container py-6 space-y-6">
        <section className="flex flex-col justify-center text-center space-y-4 py-8 relative">
          {/* CENTERED BLOB BLUR */}
          <div className="absolute left-1/2 top-1/2 w-60 h-60 transform -translate-x-1/2 -translate-y-1/2 blur-3xl dark:bg-gradient-to-br dark:from-blue-500 dark:to-purple-500 opacity-30 rounded-full -z-10" />

          <Image
            src="/shortify_3d.png"
            alt="shortify logo"
            width={150}
            height={150}
            className="mx-auto mb-4 relative z-10"
          />
          <h1 className="text-4xl sm:text-5xl font-bold text-zinc-800 dark:text-zinc-100 relative z-10">
            Shorten your URLs
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto relative z-10">
            Create short, memorable links that redirect to your long URLs. Track
            clicks and share your links easily.
          </p>
        </section>

        {/* Stats Display */}
        <div className="max-w-3xl mx-auto">
          <Stats />
        </div>

        {/* Simplified ShortenerForm - no prop drilling */}
        <ShortenerForm
          onUrlSubmit={handleUrlSubmit}
          isLoading={isLoading}
          shortUrl={shortUrl}
          error={error}
          onCopy={handleCopy}
        />

        {/* URL List */}
        <UrlList urlList={urlList} copied={copied} handleCopy={handleCopy} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
