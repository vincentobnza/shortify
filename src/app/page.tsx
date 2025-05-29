"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUrlStore } from "@/store/url-store";
import { Stats } from "@/components/stats";
import Footer from "./footer";
import UrlList from "./url-list";
import Header from "./header";
import Image from "next/image";

interface FormData {
  url: string;
}

export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();
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

  const onSubmit = async (data: FormData) => {
    setOriginalUrl(data.url);
    await generateShortUrl();
    reset();
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
        <section className="flex flex-col justify-center text-center space-y-4 py-8">
          <Image
            src="/link_image.png"
            alt="shortify logo"
            width={150}
            height={150}
            className="mx-auto mb-4"
          />
          <h1 className="text-4xl sm:text-5xl font-bold">Shorten your URLs</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Create short, memorable links that redirect to your long URLs. Track
            clicks and share your links easily.
          </p>
        </section>

        {/* Stats Display */}
        <div className="max-w-3xl mx-auto">
          <Stats />
        </div>

        {/* URL Shortener Form */}
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Create Short URL</CardTitle>
            <CardDescription>
              Enter a long URL to generate a short link
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="url">URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="url"
                      placeholder="https://example.com/very-long-url"
                      className="flex-1"
                      {...register("url", {
                        required: "URL is required",
                        pattern: {
                          value:
                            /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                          message: "Please enter a valid URL",
                        },
                      })}
                    />
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="text-white"
                    >
                      {isLoading ? "Shortening..." : "Shorten"}
                    </Button>
                  </div>
                  {errors.url && (
                    <p className="text-sm text-destructive">
                      {errors.url.message}
                    </p>
                  )}
                  {error && <p className="text-sm text-destructive">{error}</p>}
                </div>
              </div>
            </CardContent>
          </form>

          {shortUrl && (
            <CardFooter className="flex flex-col items-start gap-4 border-t pt-4">
              <div className="flex flex-col w-full gap-2">
                <Label>Your shortened URL</Label>
                <div className="flex items-center gap-2">
                  <Input value={shortUrl} readOnly className="flex-1" />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleCopy(shortUrl, "current")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline" asChild>
                    <a
                      href={shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardFooter>
          )}
        </Card>

        {/* URL List */}

        <UrlList urlList={urlList} copied={copied} handleCopy={handleCopy} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
