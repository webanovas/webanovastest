import { Link } from "react-router-dom";
import { Instagram, Phone, MapPin, ArrowUp, Settings } from "lucide-react";
import logo from "@/assets/logo.png";
import { useAdminMode } from "@/hooks/useAdminMode";
import { usePageContent } from "@/hooks/usePageContent";
import EditableText from "@/components/admin/EditableText";

const Footer = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const { isEditMode } = useAdminMode();
  const { getText, saveText } = usePageContent("footer");

  const E = ({ section, fallback, as, className, multiline }: { section: string; fallback: string; as?: "h1"|"h2"|"h3"|"h4"|"p"|"span"|"div"; className?: string; multiline?: boolean }) => {
    const val = getText(section, fallback);
    if (!isEditMode) {
      const Tag = as || "span";
      return <Tag className={className}>{val}</Tag>;
    }
    return <EditableText value={val} onSave={(v) => saveText(section, v)} as={as} className={className} multiline={multiline} />;
  };

  return (
    <footer className="relative bg-yoga-dark text-black">
      {/* Organic top shape */}
      <div className="absolute -top-px left-0 right-0 overflow-hidden">
        <svg viewBox="0 0 1440 40" className="w-full h-8 md:h-10" preserveAspectRatio="none">
          <path d="M0,40 C480,0 960,0 1440,40 L1440,0 L0,0 Z" fill="hsl(var(--background))" />
        </svg>
      </div>

      <div className="container mx-auto px-4 pt-12 md:pt-16 pb-6 md:pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 mb-10 md:mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="יוגה במושבה" className="w-10 h-10 rounded-full object-contain" />
              <E section="brand-name" fallback="יוגה במושבה" as="h3" className="font-heading text-xl font-bold" />
            </div>
            <E section="brand-desc" fallback="סטודיו יוגה בכיכר המושבה, הוד השרון. מקום של שקט, נשימה וחיבור." as="p" className="text-black/60 text-sm font-body leading-relaxed max-w-xs" multiline />
          </div>

          {/* Quick Links */}
          <div>
            <E section="nav-title" fallback="ניווט" as="h4" className="font-heading font-semibold mb-4 text-black/90" />
            <nav className="flex flex-col gap-2.5 text-sm">
              <Link to="/about" className="text-black/50 hover:text-black transition-colors">על הסטודיו</Link>
              <Link to="/schedule" className="text-black/50 hover:text-black transition-colors">מערכת שעות</Link>
              <Link to="/workshops" className="text-black/50 hover:text-black transition-colors">סדנאות</Link>
              <Link to="/contact" className="text-black/50 hover:text-black transition-colors">צור קשר</Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <E section="contact-title" fallback="צרו קשר" as="h4" className="font-heading font-semibold mb-4 text-black/90" />
            <div className="flex flex-col gap-3 text-sm">
              <a href="tel:0542131254" className="flex items-center gap-3 text-black/50 hover:text-black transition-colors">
                <Phone className="h-4 w-4" />
                <E section="phone" fallback="054-213-1254" />
              </a>
              <a href="https://www.google.com/maps/search/%D7%9B%D7%99%D7%9B%D7%A8+%D7%94%D7%9E%D7%95%D7%A9%D7%91%D7%94+%D7%94%D7%95%D7%93+%D7%94%D7%A9%D7%A8%D7%95%D7%9F" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-black/50 hover:text-black transition-colors">
                <MapPin className="h-4 w-4" />
                <E section="address" fallback="כיכר המושבה, הוד השרון" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-black/50 hover:text-black transition-colors"
              >
                <Instagram className="h-4 w-4" />
                <E section="instagram" fallback="@yogabamoshava" />
              </a>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-primary-foreground/10 pt-6">
          <div className="flex items-center gap-3">
            <E section="copyright" fallback={`© ${new Date().getFullYear()} יוגה במושבה – כל הזכויות שמורות`} as="p" className="text-xs text-primary-foreground/40" />
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
