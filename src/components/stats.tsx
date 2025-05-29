"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUrlStore } from "@/store/url-store";
import { Spinner } from "@/components/ui/spinner";

export function Stats() {
  const { urlList, isLoading } = useUrlStore();
  const [stats, setStats] = useState({
    totalUrls: 0,
    totalClicks: 0,
    averageClicks: 0,
  });

  useEffect(() => {
    if (urlList.length > 0) {
      const totalClicks = urlList.reduce((acc, url) => acc + url.clicks, 0);
      setStats({
        totalUrls: urlList.length,
        totalClicks,
        averageClicks: totalClicks / urlList.length,
      });
    }
  }, [urlList]);

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total URLs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUrls}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Clicks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalClicks}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Avg. Clicks per URL
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.averageClicks.toFixed(1)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
