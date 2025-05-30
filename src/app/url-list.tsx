import { Card, CardContent } from "@/components/ui/card";
import { URLPopover } from "@/app/url-pop-over";

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
                      <div className="flex">
                        <URLPopover
                          handleCopy={handleCopy}
                          url={{ id: url.id, short_id: url.short_id }}
                          copied={copied}
                        />
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
