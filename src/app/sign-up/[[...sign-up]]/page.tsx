"use client";

import { SignUp } from "@clerk/nextjs";
import { dark, neobrutalism } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function Page() {
  const { theme } = useTheme();
  return (
    <div className="flex items-center justify-center h-screen ">
      <SignUp
        appearance={{
          baseTheme: theme === "dark" || "system" ? dark : neobrutalism,
        }}
      />
    </div>
  );
}
