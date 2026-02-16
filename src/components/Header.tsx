import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";

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
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group z-50">
            <img src={logo} alt="יוגה במושבה" className="w-10 h-10 md:w-11 md:h-11 rounded-full object-contain" />
            <span
              className={cn(
                "font-heading font-bold text-base md:text-lg tracking-tight transition-colors",
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
              "md:hidden rounded-xl z-50 h-10 w-10",
              !scrolled && isHome && !mobileOpen && "text-primary-foreground hover:bg-primary-foreground/10"
            )}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="תפריט"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
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
                      "block px-6 py-4 rounded-2xl text-lg font-heading font-medium transition-colors text-center min-w-[200px]",
                      "hover:bg-accent text-foreground/80 hover:text-foreground active:scale-95 transition-transform",
                      location.pathname === item.path && "bg-primary/10 text-primary font-semibold"
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
