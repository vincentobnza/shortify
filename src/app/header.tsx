import { ModeToggle } from "@/components/mode-toggle";
import Link from "next/link";

export default function Header() {
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
        <h1 className="text-xl font-bold">Shortify</h1>
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
      </div>
    </header>
  );
}
