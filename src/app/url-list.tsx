import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, ExternalLink } from "lucide-react";

type UrlListProps = {
  urlList: {
    id: string;
    original_url: string;
    short_id: string;
    clicks: number;
    created_at: string;
  }[];
  copied: string | null;
  handleCopy: (text: string, id: string) => Promise<void>;
};
export default function UrlList({ urlList, copied, handleCopy }: UrlListProps) {
  return (
    <>
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
    </>
  );
}
