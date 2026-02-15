import { Link } from "react-router-dom";
import { Instagram, Phone, MapPin, ArrowUp, Settings } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative bg-yoga-dark text-primary-foreground">
      {/* Organic top shape */}
      <div className="absolute -top-px left-0 right-0 overflow-hidden">
        <svg viewBox="0 0 1440 40" className="w-full h-8 md:h-10" preserveAspectRatio="none">
          <path d="M0,40 C480,0 960,0 1440,40 L1440,0 L0,0 Z" fill="hsl(var(--background))" />
        </svg>
      </div>

      <div className="container mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="יוגה במושבה" className="w-10 h-10 rounded-full object-contain" />
              <h3 className="font-heading text-xl font-bold">יוגה במושבה</h3>
            </div>
            <p className="text-primary-foreground/60 text-sm font-body leading-relaxed max-w-xs">
              סטודיו יוגה בכיכר המושבה, הוד השרון.
              מקום של שקט, נשימה וחיבור.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold mb-4 text-primary-foreground/90">ניווט</h4>
            <nav className="flex flex-col gap-2.5 text-sm">
              <Link to="/about" className="text-primary-foreground/50 hover:text-primary-foreground transition-colors">על הסטודיו</Link>
              <Link to="/schedule" className="text-primary-foreground/50 hover:text-primary-foreground transition-colors">מערכת שעות</Link>
              <Link to="/workshops" className="text-primary-foreground/50 hover:text-primary-foreground transition-colors">סדנאות</Link>
              <Link to="/contact" className="text-primary-foreground/50 hover:text-primary-foreground transition-colors">צור קשר</Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold mb-4 text-primary-foreground/90">צרו קשר</h4>
            <div className="flex flex-col gap-3 text-sm">
              <a href="tel:0542131254" className="flex items-center gap-3 text-primary-foreground/50 hover:text-primary-foreground transition-colors">
                <Phone className="h-4 w-4" />
                054-213-1254
              </a>
              <div className="flex items-center gap-3 text-primary-foreground/50">
                <MapPin className="h-4 w-4" />
                כיכר המושבה, הוד השרון
              </div>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-primary-foreground/50 hover:text-primary-foreground transition-colors"
              >
                <Instagram className="h-4 w-4" />
                @yogabamoshava
              </a>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-primary-foreground/10 pt-6">
          <div className="flex items-center gap-3">
            <p className="text-xs text-primary-foreground/40">
              © {new Date().getFullYear()} יוגה במושבה – כל הזכויות שמורות
            </p>
            <Link to="/admin-login" className="text-primary-foreground/20 hover:text-primary-foreground/40 transition-colors" aria-label="כניסת מנהל">
              <Settings className="h-3 w-3" />
            </Link>
          </div>
          <button
            onClick={scrollToTop}
            className="w-9 h-9 rounded-xl bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
            aria-label="חזרה למעלה"
          >
            <ArrowUp className="h-4 w-4 text-primary-foreground/60" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
