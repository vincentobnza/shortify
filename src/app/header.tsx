"use client"


import { ModeToggle } from "@/components/mode-toggle";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { dark, neobrutalism } from "@clerk/themes";
import { useTheme } from "next-themes";

export default function Header() {
  const { theme } = useTheme();
  const links = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "About",
      href: "/about",
    },
  ];
  return (
    <header className="container flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Link href="/" className="text-xl font-bold">
          Shortify
        </Link>
      </div>
      <div className="flex items-center space-x-8">
        <ul className="space-x-8">
          {links.map((link) => (
            <li key={link.name} className="inline-block">
              <Link
                href={link.href}
                className="text-zinc-700 dark:text-zinc-100"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
        <ModeToggle />
        <>
          <SignedIn>
            <UserButton
              appearance={{
                baseTheme: theme === "dark" || "system" ? dark : neobrutalism,
              }}
            />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </>
      </div>
    </header>
  );
}
