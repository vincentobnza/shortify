import React from "react";
import Header from "../header";
import Footer from "../footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, BarChart3, Shield, Smartphone, Copy, Moon } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: <Zap className="h-4 w-4" />,
      title: "Lightning Fast",
      description:
        "Generate shortened URLs in milliseconds with our optimized infrastructure.",
    },
    {
      icon: <BarChart3 className="h-4 w-4" />,
      title: "Analytics Dashboard",
      description:
        "Track clicks, analyze traffic patterns, and understand your audience better.",
    },
    {
      icon: <Shield className="h-4 w-4" />,
      title: "Secure & Reliable",
      description:
        "Your links are protected with enterprise-grade security and 99.9% uptime.",
    },
    {
      icon: <Smartphone className="h-4 w-4" />,
      title: "Mobile Optimized",
      description:
        "Perfect experience across all devices - desktop, tablet, and mobile.",
    },
    {
      icon: <Copy className="h-4 w-4" />,
      title: "Easy Sharing",
      description:
        "One-click copying and sharing across all your favorite platforms.",
    },
    {
      icon: <Moon className="h-4 w-4" />,
      title: "Dark Mode",
      description:
        "Beautiful interface that adapts to your preferred viewing experience.",
    },
  ];

  return (
    <div className="w-full max-w-screen-lg mx-auto p-5 min-h-screen">
      <Header />

      <main className="container py-8 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6 py-12 relative">
          {/* Background blur effect */}
          <div className="absolute left-1/2 top-1/2 w-96 h-96 transform -translate-x-1/2 -translate-y-1/2 blur-3xl bg-gradient-to-br from-blue-500 to-purple-500 opacity-10 rounded-full -z-10" />

          <div className="relative z-10">
            <h1 className="text-4xl sm:text-5xl font-bold text-zinc-800 dark:text-indigo-50 mb-4">
              About Shortify
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              A modern, powerful URL shortening service built for speed,
              security, and simplicity.
            </p>
          </div>
        </section>

        {/* What is Shortify */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              What is Shortify?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              Shortify transforms long, unwieldy URLs into short, memorable
              links that are perfect for sharing. Whether you&apos;re posting on
              social media, sending emails, or creating marketing campaigns,
              Shortify makes your links more manageable and professional.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Built with modern web technologies, our platform provides not just
              URL shortening, but comprehensive analytics to help you understand
              how your links perform and who clicks on them.
            </p>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Why Choose Shortify?</h2>
            <p className="text-muted-foreground">
              Everything you need for effective link management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="flex items-center space-x-5">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
          <CardHeader>
            <CardTitle className="text-2xl">How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto">
                  1
                </div>
                <h3 className="font-semibold">Paste Your URL</h3>
                <p className="text-sm text-muted-foreground">
                  Enter your long URL into our shortener
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto">
                  2
                </div>
                <h3 className="font-semibold">Get Short Link</h3>
                <p className="text-sm text-muted-foreground">
                  Receive your shortened URL instantly
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto">
                  3
                </div>
                <h3 className="font-semibold">Share & Track</h3>
                <p className="text-sm text-muted-foreground">
                  Share your link and monitor analytics
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
