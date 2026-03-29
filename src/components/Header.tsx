import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";

const navItems = [
  { label: "בית", path: "/" },
  { label: "על הסטודיו", path: "/about" },
  { label: "הצוות שלנו", path: "/team" },
  { label: "מערכת שעות", path: "/schedule" },
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
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled((prev) => {
          const next = window.scrollY > 50;
          return prev === next ? prev : next;
        });
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled || !isHome
            ? "bg-background/90 backdrop-blur-xl border-b border-border/50 shadow-sm"
            : "bg-transparent"
        )}
      >
        <div className="container mx-auto flex items-center justify-between h-20 md:h-24 px-4">
          {/* Logo + Location */}
          <div className="flex items-center gap-3 z-50">
            <Link to="/" className="flex items-center gap-2 group">
              <img src={logo} alt="יוגה במושבה" className="w-16 h-16 md:w-20 md:h-20 rounded-full object-contain drop-shadow-md" />
            </Link>
            <a
              href="https://www.google.com/maps/search/%D7%9B%D7%99%D7%9B%D7%A8+%D7%94%D7%9E%D7%95%D7%A9%D7%91%D7%94+%D7%94%D7%95%D7%93+%D7%94%D7%A9%D7%A8%D7%95%D7%9F"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all duration-200 border",
                scrolled || !isHome
                  ? "text-foreground/70 hover:text-foreground border-border/50 hover:bg-accent"
                  : "text-primary-foreground/80 hover:text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/10"
              )}
            >
              <MapPin className="h-3.5 w-3.5" />
              כיכר המושבה, הוד השרון
            </a>
          </div>

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

          {/* Mobile: Hamburger only (right side) */}
          <div className="flex items-center md:hidden z-50">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-2xl h-14 w-14 border-2 border-border/50",
                !scrolled && isHome && !mobileOpen
                  ? "text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10"
                  : "text-foreground border-border hover:bg-accent"
              )}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="תפריט"
            >
              {mobileOpen ? <X className="h-9 w-9" /> : <Menu className="h-9 w-9" />}
            </Button>
          </div>

          {/* Mobile: Centered contact button */}
          <Link
            to="/contact"
            className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-body font-semibold transition-all duration-200 text-yoga-dark shadow-md md:hidden z-50"
            style={{ backgroundColor: "#bdd3d1" }}
          >
            <MessageCircle className="h-4 w-4" />
            צרו קשר
          </Link>
        </div>
      </header>

      {/* Full-screen mobile nav overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-background/98 backdrop-blur-xl" />
            <motion.nav
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="relative flex flex-col items-center justify-center h-full gap-2 px-8"
            >
              {navItems.map((item, i) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block px-8 py-5 rounded-2xl text-xl font-heading font-semibold transition-colors text-center min-w-[220px]",
                      "hover:bg-accent text-foreground/90 hover:text-foreground active:scale-95 transition-transform",
                      location.pathname === item.path && "bg-primary/15 text-primary font-bold"
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
