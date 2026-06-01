import { Link } from "wouter";
import { Home, AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center px-4">
      <div className="text-center">
        <AlertCircle className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
        <h1 className="text-3xl font-black mb-2">404</h1>
        <p className="text-muted-foreground mb-6">Page not found</p>
        <Link href="/">
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity mx-auto">
            <Home className="w-4 h-4" />
            Go Home
          </button>
        </Link>
      </div>
    </div>
  );
}
