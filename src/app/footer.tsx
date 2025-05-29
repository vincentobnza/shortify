export default function Footer() {
  return (
    <footer className="w-full max-w-screen-lg mx-auto border-t py-6 mt-12">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
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
