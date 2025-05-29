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
import { ModeToggle } from "@/components/mode-toggle";
import { useUrlStore } from "@/store/url-store";
import { Stats } from "@/components/stats";
import { AboutDialog } from "@/components/about-dialog";
import Footer from "./footer";

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
    <div className="w-full max-w-screen-xl mx-auto p-5 min-h-screen bg-background">
      {/* Header */}
      <header className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
          <h1 className="text-xl font-bold">Shortify</h1>
        </div>
        <div className="flex items-center gap-2">
          <AboutDialog />
          <ModeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6 space-y-12">
        <section className="text-center space-y-4 py-12">
          <h1 className="text-4xl sm:text-5xl font-bold">Shorten your URLs</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Create short, memorable links that redirect to your long URLs. Track
            clicks and share your links easily.
          </p>
        </section>

        {/* Stats Display */}
        <div className="max-w-3xl mx-auto mb-8">
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
        {urlList.length > 0 && (
          <section className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Your Links</h2>
            <div className="space-y-4">
              {urlList.map((url) => (
                <Card key={url.id}>
                  <CardContent>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                        <div className="truncate">
                          <p className="text-sm font-medium mb-1">
                            {window?.location?.origin}/{url.short_id}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {url.original_url}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-2"
                            onClick={() =>
                              handleCopy(
                                `${window?.location?.origin}/${url.short_id}`,
                                url.id
                              )
                            }
                          >
                            <Copy
                              className={`h-4 w-4 ${
                                copied === url.id ? "text-green-500" : ""
                              }`}
                            />
                            <span className="sr-only">Copy</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-2"
                            asChild
                          >
                            <a
                              href={`/${url.short_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                              <span className="sr-only">Open</span>
                            </a>
                          </Button>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {url.clicks} {url.clicks === 1 ? "click" : "clicks"} •
                        Created {new Date(url.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
