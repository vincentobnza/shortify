export default function Footer() {
  return (
    <footer className="border-t py-6 mt-12">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-muted-foreground">
          © 2025 Shortify. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a href="#" className="text-sm text-muted-foreground hover:underline">
            Terms of Service
          </a>
          <a href="#" className="text-sm text-muted-foreground hover:underline">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}
