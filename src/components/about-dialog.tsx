"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Github, Info } from "lucide-react";

export function AboutDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Info className="h-5 w-5" />
          <span className="sr-only">About</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>About Shortify</DialogTitle>
          <DialogDescription>
            A modern URL shortener built with Next.js and Supabase.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            Shortify allows you to create shortened URLs that redirect to your
            long URLs. Track click counts and easily share your links.
          </p>
          <h4 className="text-sm font-medium">Tech Stack</h4>
          <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
            <li>Next.js 15</li>
            <li>Supabase (PostgreSQL)</li>
            <li>ShadCN UI & Tailwind CSS</li>
            <li>React Query</li>
            <li>Zustand</li>
          </ul>
        </div>
        <DialogFooter>
          <Button asChild variant="outline">
            <a
              href="https://github.com/your-username/shortify"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Github className="h-4 w-4" />
              View on GitHub
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
