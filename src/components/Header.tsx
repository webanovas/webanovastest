import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "בית", path: "/" },
  { label: "על הסטודיו", path: "/about" },
  { label: "מערכת שעות ומורים", path: "/schedule" },
  { label: "סדנאות", path: "/workshops" },
  { label: "מילים חמות", path: "/testimonials" },
  { label: "צור קשר", path: "/contact" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled || !isHome
          ? "bg-background/90 backdrop-blur-xl border-b border-border/50 shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto flex items-center justify-between h-18 md:h-20 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <span className="text-primary-foreground font-heading font-bold text-xl">י</span>
          </div>
          <span
            className={cn(
              "font-heading font-bold text-lg tracking-tight transition-colors",
              scrolled || !isHome ? "text-foreground" : "text-primary-foreground"
            )}
          >
            יוגה במושבה
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-body font-medium transition-all duration-200",
                scrolled || !isHome
                  ? "text-foreground/70 hover:text-foreground hover:bg-accent"
                  : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10",
                location.pathname === item.path && (scrolled || !isHome
                  ? "bg-accent text-foreground"
                  : "bg-primary-foreground/15 text-primary-foreground")
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile toggle */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "md:hidden rounded-xl",
            !scrolled && isHome && "text-primary-foreground hover:bg-primary-foreground/10"
          )}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="תפריט"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border/50 px-4 pb-6 pt-2 shadow-xl">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block px-4 py-3.5 rounded-xl text-sm font-body font-medium transition-colors",
                "hover:bg-accent text-foreground/80 hover:text-foreground",
                location.pathname === item.path && "bg-accent text-foreground font-semibold"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
};

export default Header;
