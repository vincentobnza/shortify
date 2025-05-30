"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { QrCode } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type QRModalProps = {
  url?: string;
  handleOpenAndClose?: (text: string) => void;
};

export function QRModal({ url }: QRModalProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start gap-3 text-sm">
          <QrCode className="h-4 w-4" />
          QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[350px] [&>button]:hidden">
        <div className="flex items-center justify-center">
          <Image
            src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${
              typeof window !== "undefined" ? url : ""
            }`}
            alt="QR Code"
            width={300}
            height={300}
            unoptimized
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
