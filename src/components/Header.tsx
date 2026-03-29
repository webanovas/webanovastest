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
  const [pastHero, setPastHero] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const sy = window.scrollY;
        setScrolled((prev) => {
          const next = sy > 50;
          return prev === next ? prev : next;
        });
        setPastHero((prev) => {
          const next = sy > window.innerHeight * 0.7;
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
        <div className="container mx-auto flex items-center justify-between h-16 md:h-20 px-4">
          {/* Logo + Location */}
          <div className="flex items-center gap-2 z-50">
            <Link to="/" className="flex items-center gap-2 group">
              <img src={logo} alt="יוגה במושבה" className="w-12 h-12 md:w-16 md:h-16 rounded-full object-contain" />
            </Link>
            <a
              href="https://www.google.com/maps/search/%D7%9B%D7%99%D7%9B%D7%A8+%D7%94%D7%9E%D7%95%D7%A9%D7%91%D7%94+%D7%94%D7%95%D7%93+%D7%94%D7%A9%D7%A8%D7%95%D7%9F"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-body font-medium transition-all duration-200",
                scrolled || !isHome
                  ? "text-foreground/50 hover:text-foreground/70"
                  : "text-primary-foreground/60 hover:text-primary-foreground/80"
              )}
            >
              <MapPin className="h-3 w-3" />
              כיכר המושבה, הוד השרון
            </a>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[13px] font-body font-medium transition-all duration-200",
                  scrolled || !isHome
                    ? "text-foreground/60 hover:text-foreground hover:bg-accent/50"
                    : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10",
                  location.pathname === item.path && (scrolled || !isHome
                    ? "text-foreground"
                    : "text-primary-foreground")
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile: Hamburger (right side) */}
          <div className="flex items-center md:hidden z-50">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-xl h-11 w-11",
                !scrolled && isHome && !mobileOpen
                  ? "text-primary-foreground/80 hover:bg-primary-foreground/10"
                  : "text-foreground/70 hover:bg-accent/50"
              )}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="תפריט"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile: Centered contact button - appears after scrolling past hero */}
          <Link
            to="/contact"
            className={cn(
              "absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-body font-medium transition-all duration-300 md:hidden z-50",
              (isHome && !pastHero) ? "opacity-0 pointer-events-none translate-y-1" : "opacity-100 translate-y-0"
            )}
            style={{ backgroundColor: "#bdd3d1", color: "#2d3a36" }}
          >
            <MessageCircle className="h-3.5 w-3.5" />
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
