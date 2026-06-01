import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Home, List, Tv2, Menu, X, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/ongoing", label: "Ongoing", icon: TrendingUp },
  { href: "/complete", label: "Tamat", icon: List },
  { href: "/search", label: "Cari", icon: Search },
];

export function Navbar() {
  const [location, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setMobileOpen(false);
    }
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer select-none shrink-0">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg">
                <Tv2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-black gradient-text hidden sm:block">NIMEKA TV</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-1 flex-1 ml-4">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <button className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  location === href || (href !== "/" && location.startsWith(href))
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}>
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              </Link>
            ))}
          </nav>

          {/* Desktop search */}
          <form onSubmit={handleSearch} className="hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Cari anime..."
                className="pl-9 pr-4 py-2 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all w-48 text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </form>

          {/* Mobile right buttons */}
          <div className="sm:hidden flex items-center gap-1">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search dropdown */}
        {showSearch && (
          <div className="sm:hidden border-t border-border px-4 py-3 bg-background/95">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Cari anime..."
                  className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </form>
          </div>
        )}

        {/* Mobile menu dropdown */}
        {mobileOpen && (
          <div className="sm:hidden border-t border-border bg-card">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <button
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors",
                    location === href || (href !== "/" && location.startsWith(href))
                      ? "bg-primary/10 text-primary border-l-2 border-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </button>
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Bottom mobile nav */}
      <nav
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}
      >
        <div className="flex items-center" style={{ height: "60px" }}>
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = location === href || (href !== "/" && location.startsWith(href));
            return (
              <Link key={href} href={href} className="flex-1">
                <button className={cn(
                  "w-full h-full flex flex-col items-center justify-center gap-1 py-2 transition-all",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}>
                  <div className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
                    isActive ? "bg-primary/15" : "bg-transparent"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={cn("text-[11px] font-medium leading-none", isActive ? "text-primary" : "text-muted-foreground")}>
                    {label}
                  </span>
                </button>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
