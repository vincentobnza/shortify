"use client";

import { QRModal } from "@/app/qr-modal";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Copy, Trash2, EllipsisVertical } from "lucide-react";
import { useState } from "react";

type URLPopoverProps = {
  handleCopy: (text: string, id: string) => Promise<void>;
  url: {
    id: string;
    short_id: string;
  };
  copied?: string | null | ConstrainBoolean;
};

export function URLPopover({ handleCopy, url }: URLPopoverProps) {
  const [open, setOpen] = useState(false);

  const handleOpenAndClose = async (text: string, id: string) => {
    await handleCopy(text, id);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
          <EllipsisVertical className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-0" align="end">
        <div className="space-y-1 p-1">
          <Button
            onClick={() =>
              handleOpenAndClose(
                `${window?.location?.origin}/${url.short_id}`,
                url.id
              )
            }
            variant="ghost"
            className="w-full justify-start gap-3 text-sm"
          >
            <Copy className="h-4 w-4" />
            Copy Link
          </Button>
          <QRModal
            url={`${window?.location?.origin}/${url.short_id}`}
            handleOpenAndClose={(text: string) =>
              handleOpenAndClose(text, url.id)
            }
          />
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sm text-red-400 hover:text-red-500 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
