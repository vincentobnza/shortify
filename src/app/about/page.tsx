"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExternalLink, Github, Twitter } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="w-full max-w-screen-lg mx-auto min-h-screen bg-background">
      {/* Main Content */}
      <main className="container py-6 space-y-12">
        <section className="text-center space-y-4 py-12">
          <h1 className="text-4xl sm:text-5xl font-bold">About Shortify</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A modern, efficient URL shortening service built with Next.js and
            Supabase.
          </p>
        </section>

        <div className="grid gap-8 max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>What is Shortify?</CardTitle>
              <CardDescription>
                A powerful yet simple URL shortening service
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Shortify transforms long, unwieldy URLs into short, memorable
                links that are easy to share. Whether you&apos;re sharing links
                on social media, in emails, or in print, Shortify makes your
                links more manageable and professional.
              </p>
              <p>
                Our service provides detailed analytics for each shortened URL,
                allowing you to track clicks and understand your audience
                better.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
              <CardDescription>What makes Shortify special</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Fast URL shortening with custom short IDs</li>
                <li>Click tracking and detailed analytics</li>
                <li>Secure and reliable redirection</li>
                <li>User-friendly dashboard to manage your links</li>
                <li>Copy-to-clipboard functionality for easy sharing</li>
                <li>Modern, responsive UI that works on all devices</li>
                <li>Dark mode support for comfortable viewing</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Technology Stack</CardTitle>
              <CardDescription>
                Built with modern web technologies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Frontend</strong>: Next.js, React, TypeScript,
                  Tailwind CSS
                </li>
                <li>
                  <strong>Backend</strong>: Next.js API routes, Supabase
                </li>
                <li>
                  <strong>Database</strong>: PostgreSQL (via Supabase)
                </li>
                <li>
                  <strong>State Management</strong>: Zustand
                </li>
                <li>
                  <strong>Styling</strong>: Tailwind CSS with shadcn/ui
                  components
                </li>
                <li>
                  <strong>Deployment</strong>: Vercel
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
              <CardDescription>
                Have questions or feedback? Reach out!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" className="gap-2" asChild>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-4 w-4" />
                    <span>GitHub</span>
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </Button>
                <Button variant="outline" className="gap-2" asChild>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="h-4 w-4" />
                    <span>Twitter</span>
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
