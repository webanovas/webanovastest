import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import {
  Heart,
  Leaf, Brain, Sunrise, Wind,
  Phone, Mail, MessageCircle, Send,
  ArrowLeft, Quote, MapPin, Images, X, Camera, Loader2,
} from "lucide-react";
import Layout from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAdminMode } from "@/hooks/useAdminMode";
import { usePageContent } from "@/hooks/usePageContent";
import EditableText from "@/components/admin/EditableText";
import EditableImage from "@/components/admin/EditableImage";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState, useRef } from "react";
import { toast } from "sonner";

import {
  HERO_IMAGES, WELCOME_MAIN, WELCOME_SECONDARY,
  BENEFITS_IMAGE, CTA_BG_IMAGE,
} from "@/lib/uploadedImages";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const benefitIcons = [Leaf, Brain, Sunrise, Wind];
const benefitDefaults = [
  { title: "גמישות ובריאות", desc: "שיפור גמישות הגוף וחיזוק שרירים" },
  { title: "מיקוד ושקט", desc: "הרגעת המחשבות ושיפור הריכוז" },
  { title: "אנרגיה וחיוניות", desc: "תחושת רעננות ואנרגיה לאורך היום" },
  { title: "הפחתת מתח", desc: "שחרור מתחים ושיפור איכות השינה" },
];

const defaultHeroImages = HERO_IMAGES;

const HeroFocalEditor = ({ src, index, objectPosition, onSave }: { src: string; index: number; objectPosition: string; onSave: (pos: string) => void }) => {
  const imgRef = useRef<HTMLDivElement>(null);
  const parts = objectPosition.split(" ");
  const [pos, setPos] = useState({ x: parseFloat(parts[0]) || 50, y: parseFloat(parts[1]) || 50 });
  const [dragging, setDragging] = useState(false);

  const update = useCallback((e: React.MouseEvent) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    const newPos = { x: Math.round(x), y: Math.round(y) };
    setPos(newPos);
    onSave(`${newPos.x}% ${newPos.y}%`);
  }, [onSave]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-4 p-4">
      <div
        ref={imgRef}
        className="relative cursor-crosshair rounded-lg overflow-hidden select-none border border-border"
        onMouseDown={(e) => { e.preventDefault(); setDragging(true); update(e); }}
        onMouseMove={(e) => { if (dragging) update(e); }}
        onMouseUp={() => setDragging(false)}
        onMouseLeave={() => setDragging(false)}
      >
        <img src={src} alt={`תמונה ${index + 1}`} className="w-full h-auto block" draggable={false} />
        <div
          className="absolute w-7 h-7 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
          style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
        >
          <div className="absolute inset-0 rounded-full border-2 border-white shadow-lg" />
          <div className="absolute inset-[5px] rounded-full bg-primary/80" />
        </div>
        <div className="absolute top-0 bottom-0 w-px bg-white/30 pointer-events-none" style={{ left: `${pos.x}%` }} />
        <div className="absolute left-0 right-0 h-px bg-white/30 pointer-events-none" style={{ top: `${pos.y}%` }} />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-xs text-muted-foreground">תצוגה מקדימה</p>
        <div className="aspect-[16/7] rounded-md overflow-hidden border border-border">
          <img src={src} alt="preview" className="w-full h-full object-cover" style={{ objectPosition: `${pos.x}% ${pos.y}%` }} />
        </div>
        <p className="text-[10px] text-muted-foreground text-center">מוקד: {pos.x}% / {pos.y}%</p>
        <Button variant="ghost" size="sm" className="text-xs" onClick={() => { setPos({ x: 50, y: 50 }); onSave("50% 50%"); }}>
          איפוס למרכז
        </Button>
      </div>
    </div>
  );
};

const Index = () => {
  const { isEditMode } = useAdminMode();
  const { getText, getLoadedText, saveText, isLoading: isContentLoading } = usePageContent("home");

  const { data: testimonials = [] } = useQuery({
    queryKey: ["testimonials-home"],
    queryFn: async () => {
      const { data } = await supabase.from("testimonials").select("*").order("sort_order").limit(10);
      return data ?? [];
    },
  });

  // Hero carousel
  const [heroEmblaRef] = useEmblaCarousel(
    { loop: true, direction: "rtl" },
    [Autoplay({ delay: 3500, stopOnInteraction: false })]
  );

  // Hero image editor state
  const [showHeroEditor, setShowHeroEditor] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Get hero images from page_content or use defaults (wait for content to load)
  const heroImages = defaultHeroImages.map((defaultSrc, i) => {
    const saved = getLoadedText(`hero-image-${i}`, "");
    if (saved === null) return defaultSrc; // still loading, but won't flash since we hide until loaded
    return saved || defaultSrc;
  });

  const handleHeroImageUpload = async (index: number, file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("יש לבחור קובץ תמונה");
      return;
    }
    setUploadingIndex(index);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `hero/${Date.now()}-${index}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("site-images")
        .upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage
        .from("site-images")
        .getPublicUrl(fileName);
      await saveText(`hero-image-${index}`, publicUrl);
      toast.success(`תמונה ${index + 1} הוחלפה`);
    } catch (err: any) {
      toast.error("שגיאה בהעלאה: " + err.message);
    } finally {
      setUploadingIndex(null);
    }
  };

  // Testimonials carousel
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, direction: "rtl", align: "start" },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  const saveTextRef = useRef(saveText);
  saveTextRef.current = saveText;

  const E = useCallback(({ section, fallback, as, className, multiline }: { section: string; fallback: string; as?: "h1"|"h2"|"h3"|"p"|"span"|"div"; className?: string; multiline?: boolean }) => {
    const val = getText(section, fallback);
    if (!isEditMode) {
      const Tag = as || "span";
      return <Tag className={className}>{val}</Tag>;
    }
    return <EditableText value={val} onSave={(v) => saveTextRef.current(section, v)} as={as} className={className} multiline={multiline} persistKey={`home:${section}`} />;
  }, [isEditMode, getText]);

  // Helper: wrap Link buttons so they don't navigate in edit mode
  const MaybeLink = ({ to, children, ...props }: { to: string; children: React.ReactNode; [key: string]: any }) => {
    if (isEditMode) {
      return <span {...props} className={props.className} style={{ cursor: "default" }}>{children}</span>;
    }
    return <Link to={to} {...props}>{children}</Link>;
  };

  // Get section images from page_content or use defaults (wait for load)
  const getImage = (section: string, fallback: string) => {
    const saved = getLoadedText(section, "");
    if (saved === null) return fallback;
    return saved || fallback;
  };

  return (
    <Layout>
      {/* Hero with image carousel */}
      <section className="relative min-h-[85vh] md:min-h-screen flex items-end overflow-hidden">
        {/* Image carousel background */}
        <div className={`absolute inset-0 transition-opacity duration-500 ${isContentLoading ? 'opacity-0' : 'opacity-100'}`} ref={heroEmblaRef}>
          <div className="flex h-full">
            {heroImages.map((src, i) => (
              <div key={i} className="flex-none w-full h-full min-w-0 relative">
                <img src={src} alt={`יוגה במושבה ${i + 1}`} className="w-full h-full object-cover" style={{ objectPosition: getText(`hero-image-${i}-pos`, "50% 50%") }} loading={i === 0 ? "eager" : "lazy"} />
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-yoga-dark/95 via-yoga-dark/50 to-yoga-dark/10" />

        {/* Admin: edit carousel images button */}
        {isEditMode && (
          <button
            onClick={() => setShowHeroEditor(true)}
            className="absolute top-24 right-4 z-30 flex items-center gap-2 bg-card/90 backdrop-blur-md text-foreground rounded-full px-4 py-2.5 shadow-lg border border-border hover:bg-card transition-colors"
          >
            <Images className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">ערוך תמונות קרוסלה</span>
          </button>
        )}

        {/* Admin: hero image editor dialog */}
        <Dialog open={isEditMode && showHeroEditor} onOpenChange={setShowHeroEditor}>
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto" dir="rtl">
            <DialogHeader>
              <DialogTitle className="font-heading text-lg">עריכת תמונות קרוסלה</DialogTitle>
              <p className="text-sm text-muted-foreground">החליפו תמונות ושנו את מיקום המוקד של כל תמונה</p>
            </DialogHeader>
            <div className="space-y-6">
              {heroImages.map((src, i) => (
                <div key={i} className="border border-border rounded-xl overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2 bg-muted/40 border-b border-border">
                    <span className="font-heading font-semibold text-sm">תמונה {i + 1}</span>
                    <div className="flex-1" />
                    <input
                      ref={(el) => { fileRefs.current[i] = el; }}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleHeroImageUpload(i, file);
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 rounded-full"
                      onClick={() => fileRefs.current[i]?.click()}
                      disabled={uploadingIndex === i}
                    >
                      {uploadingIndex === i ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
                      החלף תמונה
                    </Button>
                  </div>
                  <HeroFocalEditor
                    src={src}
                    index={i}
                    objectPosition={getText(`hero-image-${i}-pos`, "50% 50%")}
                    onSave={(pos) => saveText(`hero-image-${i}-pos`, pos)}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-2">
              <Button className="rounded-full px-8" onClick={() => setShowHeroEditor(false)}>
                שמירה וסגירה
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="container mx-auto px-4 relative z-10 pb-12 md:pb-24 pt-28 md:pt-40 flex flex-col items-center text-center md:items-start md:text-right">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-2xl">
            <motion.div variants={fadeUp} className="mb-5">
              <a
                href="https://www.google.com/maps/search/%D7%9B%D7%99%D7%9B%D7%A8+%D7%94%D7%9E%D7%95%D7%A9%D7%91%D7%94+%D7%94%D7%95%D7%93+%D7%94%D7%A9%D7%A8%D7%95%D7%9F"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-foreground/15 backdrop-blur-md text-primary-foreground/90 text-sm font-body border border-primary-foreground/20 hover:bg-primary-foreground/25 transition-colors"
                onClick={(e) => isEditMode && e.preventDefault()}
              >
                <MapPin className="h-3.5 w-3.5" />
                <E section="hero-badge" fallback="כיכר המושבה, הוד השרון" as="span" className="" />
              </a>
            </motion.div>
            <motion.div variants={fadeUp} style={{ textShadow: '0 2px 20px rgba(0,0,0,0.4), 0 4px 40px rgba(0,0,0,0.2)' }}>
              <E section="hero-title" fallback="יוגה במושבה" as="h1"
                className="font-heading text-4xl md:text-7xl lg:text-8xl font-extrabold text-primary-foreground mb-4 md:mb-6 leading-[1.05] tracking-tight" />
            </motion.div>
            <motion.div variants={fadeUp}>
              <E section="hero-subtitle" fallback="מקום של שקט, נשימה וחיבור. בואו לתרגל במרחב חם ומזמין עם שירה פלג וצוות המורים שלנו." as="p"
                className="text-base md:text-xl text-primary-foreground/90 leading-relaxed mb-8 md:mb-10 max-w-lg" multiline />
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center md:justify-start">
              {isEditMode ? (
                <div className="flex flex-col gap-3">
                  <div className="inline-flex items-center gap-2">
                    <span className="text-xs text-primary-foreground/60 bg-primary-foreground/10 rounded-full px-3 py-1">כפתור 1:</span>
                    <E section="hero-btn-schedule" fallback="לוח שיעורים" as="span" className="text-primary-foreground font-medium" />
                  </div>
                  <div className="inline-flex items-center gap-2">
                    <span className="text-xs text-primary-foreground/60 bg-primary-foreground/10 rounded-full px-3 py-1">כפתור 2:</span>
                    <E section="hero-btn-about" fallback="הכירו אותנו" as="span" className="text-primary-foreground font-medium" />
                  </div>
                </div>
              ) : (
                <>
                  <Button size="lg" className="rounded-full px-8 md:px-10 h-12 md:h-14 text-base shadow-xl shadow-primary/30" asChild>
                    <Link to="/schedule">{getText("hero-btn-schedule", "לוח שיעורים")}</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-full px-8 md:px-10 h-12 md:h-14 text-base border-primary-foreground/50 text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20 hover:text-primary-foreground backdrop-blur-md" asChild>
                    <Link to="/about">{getText("hero-btn-about", "הכירו אותנו")}</Link>
                  </Button>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Welcome / About */}
      <section className="pt-14 md:pt-36 pb-6 md:pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <E section="welcome-label" fallback="ברוכים הבאים" as="span"
                className="text-primary font-medium text-sm tracking-wider uppercase mb-4 block" />
              <E section="welcome-title" fallback="מרחב של שקט ונשימה" as="h2"
                className="font-heading text-2xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight" />
              <E section="welcome-text-1" fallback="יוגה במושבה הוא סטודיו בוטיק בלב הוד השרון. אנחנו מאמינים שיוגה היא לא רק תרגול גופני – אלא דרך חיים של מודעות, נשימה וחיבור פנימי." as="p"
                className="text-muted-foreground leading-relaxed mb-5 text-lg" multiline />
              <E section="welcome-text-2" fallback="שירה פלג, מורה ומטפלת ביוגה מנוסה, מובילה את הסטודיו מתוך אהבה אמיתית לתרגול ומחויבות לכל מתרגל ומתרגלת." as="p"
                className="text-muted-foreground leading-relaxed mb-8" multiline />
              <div className="pt-6 border-t border-border"></div>
              {isEditMode ? (
                <div className="inline-flex items-center gap-2">
                  <span className="text-xs text-muted-foreground bg-muted rounded-full px-3 py-1">כפתור:</span>
                  <E section="welcome-btn" fallback="קראו עוד עלינו" as="span" className="text-foreground font-medium" />
                </div>
              ) : (
                <Button variant="outline" className="rounded-full gap-2 px-8 h-12" asChild>
                  <Link to="/about">{getText("welcome-btn", "קראו עוד עלינו")}<ArrowLeft className="h-4 w-4" /></Link>
                </Button>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[3/4]">
                <EditableImage
                  src={getImage("welcome-img-main", WELCOME_MAIN)}
                  alt="שירה פלג"
                  className="w-full h-full object-cover"
                  folder="welcome"
                  onUpload={isEditMode ? (url) => saveText("welcome-img-main", url) : undefined}
                  objectPosition={getText("welcome-img-main-pos", "50% 50%")}
                  onPositionChange={isEditMode ? (pos) => saveText("welcome-img-main-pos", pos) : undefined}
                />
              </div>
              <div className="absolute -bottom-8 -right-8 md:-right-12 w-40 h-40 md:w-52 md:h-52 rounded-2xl overflow-hidden shadow-xl border-4 border-background">
                <EditableImage
                  src={getImage("welcome-img-secondary", WELCOME_SECONDARY)}
                  alt="הסטודיו"
                  className="w-full h-full object-cover"
                  folder="welcome"
                  onUpload={isEditMode ? (url) => saveText("welcome-img-secondary", url) : undefined}
                  objectPosition={getText("welcome-img-secondary-pos", "50% 50%")}
                  onPositionChange={isEditMode ? (pos) => saveText("welcome-img-secondary-pos", pos) : undefined}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Decorative separator */}
      <div className="flex justify-center py-4 md:py-6">
        <div className="w-16 h-[1px] bg-primary/30"></div>
      </div>

      {/* What is Yoga */}
      <section className="pb-14 md:pb-28 bg-accent/20 pt-10 md:pt-16 rounded-t-[2rem] md:rounded-t-[3rem]">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="max-w-3xl mx-auto text-right"
          >
            <motion.div variants={fadeUp}>
              <E section="yoga-intro-label" fallback="קצת על יוגה" as="h2"
                className="font-heading text-2xl md:text-4xl font-bold mb-6 md:mb-8" />
            </motion.div>
            <motion.div variants={fadeUp}>
              <E section="yoga-intro-text" fallback={`בשיעור עם קבוצה חדשה, אשאל תמיד ״מי יודע מה פירוש המילה יוגה?״.\n\nהעיסוק ביוגה, הפך עם השנים לנפוץ ופופולארי מאוד. בימינו למשמע המילה יוגה, גם ילדים רכים בשנים נכנסים לתנוחת לוטוס (כמין ישיבה מזרחית), עוצמים את עיניהם ומזמזמים אום.\n\nלמרות שרבים מכירים את היוגה לא ברור להם מה היא בדיוק.\n\nהתשובה היא פשוטה ומורכבת כאחד וקיימות הרבה פרשנויות והגדרות המנסות להסביר את משמעות היוגה לאדם.\n\nהיוגה היא עולם ומלואו. דרך חיים ופילוסופיה שמקורה בהודו העתיקה ומטרתה לעזור לאדם לחיות בשלווה, איזון ואושר. בליבה של היוגה עומד קשר הגומלין בין הגוף לתודעה, והפרקטיקה של היוגה מכילה גם תרגול פיסי. לדוגמא: תנוחות ותרגילי נשימה וגם תרגול מנטלי כגון מדיטציה. פירוש המילה יוגה Yoga הוא איחוד, חיבור לכדי אחד. החיבור הוא, בין השאר, של תנועה פיסית עם עולם התודעה והרוח. כך, התרגול הפיסי ביוגה אינו רק הפעלה מכנית של הגוף אלא מסע של התבוננות וחקירה פנימית המוביל לאיזון וריפוי.`}
                as="p"
                className="text-muted-foreground leading-relaxed text-base md:text-lg whitespace-pre-line"
                multiline
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-14 md:py-36 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="rounded-3xl overflow-hidden shadow-xl aspect-square">
              <EditableImage
                src={getImage("benefits-image", BENEFITS_IMAGE)}
                alt="תרגול יוגה"
                className="w-full h-full object-cover"
                folder="benefits"
                onUpload={isEditMode ? (url) => saveText("benefits-image", url) : undefined}
                objectPosition={getText("benefits-image-pos", "50% 50%")}
                onPositionChange={isEditMode ? (pos) => saveText("benefits-image-pos", pos) : undefined}
              />
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.div variants={fadeUp}>
                <E section="benefits-label" fallback="למה יוגה?" as="span" className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block" />
              </motion.div>
              <motion.div variants={fadeUp}>
                <E section="benefits-title" fallback="יתרונות התרגול" as="h2" className="font-heading text-3xl md:text-4xl font-bold mb-10" />
              </motion.div>
              <div className="flex flex-col gap-8">
                {benefitDefaults.map((b, i) => {
                  const Icon = benefitIcons[i];
                  return (
                    <motion.div key={i} variants={fadeUp} className="flex gap-5 items-start group">
                      <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center flex-shrink-0 group-hover:bg-primary/15 transition-colors">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <E section={`benefit-${i}-title`} fallback={b.title} as="h3" className="font-heading font-semibold text-lg mb-1" />
                        <E section={`benefit-${i}-desc`} fallback={b.desc} as="p" className="text-sm text-muted-foreground leading-relaxed" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Full-width image divider */}
      <section className="relative h-[70vh] md:h-[60vh] overflow-hidden">
        <EditableImage
          src={getImage("cta-bg-image", CTA_BG_IMAGE)}
          alt="יוגה"
          className="absolute inset-0 w-full h-full object-cover"
          folder="cta"
          onUpload={isEditMode ? (url) => saveText("cta-bg-image", url) : undefined}
          objectPosition={getText("cta-bg-image-pos", "50% 50%")}
          onPositionChange={isEditMode ? (pos) => saveText("cta-bg-image-pos", pos) : undefined}
        />
        {/* Gradient overlay – mobile: stronger bottom fade for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-yoga-dark/90 via-yoga-dark/30 to-transparent md:from-yoga-dark/50 md:via-yoga-dark/25 md:to-yoga-dark/10" />

        {/* Desktop: right-aligned */}
        <div className={`hidden md:flex absolute inset-0 items-center ${isEditMode ? '' : 'pointer-events-none'}`} dir="rtl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-right px-16 pointer-events-auto max-w-xl">
            <E section="cta-title" fallback="התחילו לנשום" as="h2"
              className="font-heading text-6xl font-bold text-primary-foreground mb-3 drop-shadow-lg" />
            <E section="cta-subtitle" fallback="הצטרפו למשפחת יוגה במושבה ותגלו מרחב חדש של שקט ורוגע" as="p"
              className="text-primary-foreground/80 text-lg mb-8 max-w-md drop-shadow-md" />
            {isEditMode ? (
              <div className="inline-flex items-center gap-2">
                <span className="text-xs text-primary-foreground/60 bg-primary-foreground/10 rounded-full px-3 py-1">טקסט כפתור:</span>
                <E section="cta-btn" fallback="בואו נתחיל" as="span"
                  className="text-primary-foreground font-medium text-lg" />
              </div>
            ) : (
              <Button size="lg" className="rounded-full px-10 h-14 text-lg shadow-xl shadow-primary/30" asChild>
                <Link to="/contact">{getText("cta-btn", "בואו נתחיל")}</Link>
              </Button>
            )}
          </motion.div>
        </div>

        {/* Mobile: centered text over image with gradient fade */}
        <div className={`md:hidden absolute inset-0 flex items-end justify-center ${isEditMode ? '' : 'pointer-events-none'}`} dir="rtl">
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center px-6 pb-10 pointer-events-auto">
            <E section="cta-title" fallback="התחילו לנשום" as="h2"
              className="font-heading text-3xl font-bold text-primary-foreground mb-2 drop-shadow-lg" />
            <E section="cta-subtitle" fallback="הצטרפו למשפחת יוגה במושבה ותגלו מרחב חדש של שקט ורוגע" as="p"
              className="text-primary-foreground/80 text-base mb-6 drop-shadow-md" />
            {isEditMode ? (
              <div className="inline-flex items-center gap-2">
                <span className="text-xs text-primary-foreground/60 bg-primary-foreground/10 rounded-full px-3 py-1">טקסט כפתור:</span>
                <E section="cta-btn" fallback="בואו נתחיל" as="span"
                  className="text-primary-foreground font-medium text-lg" />
              </div>
            ) : (
              <Button size="lg" className="rounded-full px-10 h-12 text-base shadow-xl shadow-primary/30" asChild>
                <Link to="/contact">{getText("cta-btn", "בואו נתחיל")}</Link>
              </Button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-14 md:py-36 bg-yoga-cream">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
            <motion.div variants={fadeUp}>
              <E section="testimonials-label" fallback="המלצות" as="span" className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block" />
            </motion.div>
            <motion.div variants={fadeUp}>
              <E section="testimonials-title" fallback="מילים חמות" as="h2" className="font-heading text-3xl md:text-5xl font-bold mb-4" />
            </motion.div>
          </motion.div>

          {testimonials.length === 0 ? (
            <p className="text-center text-muted-foreground">מילים חמות יעודכנו בקרוב</p>
          ) : (
            <div className="max-w-5xl mx-auto">
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-6" style={{ direction: "rtl" }}>
                  {testimonials.map((t) => (
                    <div key={t.id} className="flex-none w-[85%] sm:w-[45%] md:w-[33%]">
                      <Card className="h-full rounded-3xl border-0 shadow-md bg-card">
                        <CardContent className="pt-8 pb-8 px-8">
                          <Quote className="h-8 w-8 text-primary/20 mb-4" />
                          <p className="text-foreground/80 leading-relaxed mb-6">{t.text}</p>
                          <div className="flex items-center gap-3 pt-4 border-t border-border">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="font-heading font-bold text-primary text-sm">{t.name.charAt(0)}</span>
                            </div>
                            <span className="font-heading font-medium text-sm">{t.name}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
              {testimonials.length > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => emblaApi?.scrollTo(i)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        i === selectedIndex ? "bg-primary w-6" : "bg-primary/20"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mt-12">
            <Button variant="outline" className="rounded-full gap-2 h-12 px-8" asChild={!isEditMode}>
              {isEditMode ? (
                <span><E section="testimonials-btn" fallback="לכל המילים החמות" /><ArrowLeft className="h-4 w-4" /></span>
              ) : (
                <Link to="/testimonials"><E section="testimonials-btn" fallback="לכל המילים החמות" /><ArrowLeft className="h-4 w-4" /></Link>
              )}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Contact preview */}
      <section className="py-14 md:py-36 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.div variants={fadeUp}>
                <E section="contact-label" fallback="צרו קשר" as="span" className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block" />
              </motion.div>
              <motion.div variants={fadeUp}>
                <E section="contact-title" fallback="בואו נדבר" as="h2" className="font-heading text-3xl md:text-4xl font-bold mb-4" />
              </motion.div>
              <motion.div variants={fadeUp}>
                <E section="contact-subtitle" fallback="רוצים לשמוע עוד? השאירו פרטים ונחזור אליכם בהקדם." as="p" className="text-muted-foreground mb-8 text-lg" />
              </motion.div>
              <motion.div variants={fadeUp} className="flex flex-col gap-5 text-sm">
                <a href="tel:0542131254" className="flex items-center gap-4 text-foreground/70 hover:text-primary transition-colors" onClick={(e) => isEditMode && e.preventDefault()}>
                  <div className="w-11 h-11 rounded-full bg-accent flex items-center justify-center"><Phone className="h-4 w-4 text-primary" /></div>
                  <E section="contact-phone" fallback="054-213-1254" />
                </a>
                <a href="mailto:shira.pelleg@gmail.com" className="flex items-center gap-4 text-foreground/70 hover:text-primary transition-colors" onClick={(e) => isEditMode && e.preventDefault()}>
                  <div className="w-11 h-11 rounded-full bg-accent flex items-center justify-center"><Mail className="h-4 w-4 text-primary" /></div>
                  <E section="contact-email" fallback="shira.pelleg@gmail.com" />
                </a>
                <a href="https://wa.me/972542131254" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-foreground/70 hover:text-primary transition-colors" onClick={(e) => isEditMode && e.preventDefault()}>
                  <div className="w-11 h-11 rounded-full bg-accent flex items-center justify-center"><MessageCircle className="h-4 w-4 text-primary" /></div>
                  <E section="contact-whatsapp" fallback="שלחו הודעה בוואטסאפ" />
                </a>
              </motion.div>
            </motion.div>

            <motion.form initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
              <motion.div variants={fadeUp}><Input placeholder="שם מלא" className="bg-accent/30 border-0 rounded-xl h-12" /></motion.div>
              <motion.div variants={fadeUp}><Input type="email" placeholder="אימייל" className="bg-accent/30 border-0 rounded-xl h-12" /></motion.div>
              <motion.div variants={fadeUp}><Input type="tel" placeholder="טלפון" className="bg-accent/30 border-0 rounded-xl h-12" /></motion.div>
              <motion.div variants={fadeUp}><Textarea placeholder="הודעה" rows={4} className="bg-accent/30 border-0 rounded-xl" /></motion.div>
              <motion.div variants={fadeUp}>
                <Button type={isEditMode ? "button" : "submit"} className="w-full gap-2 rounded-full h-12 text-base shadow-lg shadow-primary/20">
                  <Send className="h-4 w-4" /><E section="contact-send-btn" fallback="שלחו הודעה" />
                </Button>
              </motion.div>
            </motion.form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
