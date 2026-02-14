import { Link } from "react-router-dom";
import { Instagram, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-xl font-semibold mb-3">יוגה במושבה</h3>
            <p className="text-primary-foreground/80 text-sm font-body leading-relaxed">
              סטודיו יוגה בכיכר המושבה, הוד השרון.
              <br />
              מקום של שקט, נשימה וחיבור.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold mb-3">קישורים</h4>
            <nav className="flex flex-col gap-2 text-sm">
              <Link to="/about" className="hover:underline text-primary-foreground/80">על הסטודיו</Link>
              <Link to="/schedule" className="hover:underline text-primary-foreground/80">מערכת שעות</Link>
              <Link to="/workshops" className="hover:underline text-primary-foreground/80">סדנאות</Link>
              <Link to="/contact" className="hover:underline text-primary-foreground/80">צור קשר</Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold mb-3">צרו קשר</h4>
            <div className="flex flex-col gap-2 text-sm text-primary-foreground/80">
              <a href="tel:0501234567" className="flex items-center gap-2 hover:underline">
                <Phone className="h-4 w-4" />
                050-123-4567
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                כיכר המושבה, הוד השרון
              </div>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:underline"
              >
                <Instagram className="h-4 w-4" />
                @yogabamoshava
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} יוגה במושבה – כל הזכויות שמורות
        </div>
      </div>
    </footer>
  );
};

export default Footer;
