"use client";

import { SignIn } from "@clerk/nextjs";
import { dark, neobrutalism } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function Page() {
  const { theme } = useTheme();
  return (
    <div className="flex items-center justify-center h-screen ">
      <SignIn
        appearance={{
          baseTheme: theme === "dark" || "system" ? dark : neobrutalism,
        }}
      />
    </div>
  );
}
