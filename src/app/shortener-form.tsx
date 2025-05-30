"use client";

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
import { Copy, ExternalLink, Scissors } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

type FormValues = {
  url: string;
};

type ShortenerFormProps = {
  onUrlSubmit: (url: string) => Promise<void>;
  isLoading: boolean;
  shortUrl?: string;
  error?: string | null;
  onCopy: (text: string, id: string) => void;
};

export default function ShortenerForm({
  onUrlSubmit,
  isLoading,
  shortUrl,
  error,
  onCopy,
}: ShortenerFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const onSubmit = async (data: FormValues) => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    await onUrlSubmit(data.url);
    reset();
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Create Short URL</CardTitle>
        <CardDescription>
          Enter a long URL to generate a short link
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="url">Your URL</Label>
              <div className="mt-2 flex gap-2">
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
                  <Scissors />
                  {isLoading ? "Shortening..." : "Shorten"}
                </Button>
              </div>
              {errors.url && (
                <p className="text-sm text-destructive">{errors.url.message}</p>
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
                onClick={() => onCopy(shortUrl, "current")}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" asChild>
                <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
