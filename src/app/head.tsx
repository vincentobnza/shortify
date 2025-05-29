"use client";

import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Shortify | URL Shortener",
    description:
      "Shorten your URLs with Shortify - A modern URL shortening service",
    icons: {
      icon: "/favicon.ico",
    },
  };
}

export default function Head() {
  return null;
}
