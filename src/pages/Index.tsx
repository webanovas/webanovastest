import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import {
  Heart,
  Leaf, Brain, Sunrise, Wind,
  Phone, Mail, MessageCircle, Send,
  ArrowLeft, Quote, MapPin, Images, X, Camera, Loader2, Move,
} from "lucide-react";
import Layout from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAdminMode } from "@/hooks/useAdminMode";
import { usePageContent } from "@/hooks/usePageContent";
import EditableText from "@/components/admin/EditableText";
import EditableImage from "@/components/admin/EditableImage";
import FocalPointPicker from "@/components/admin/FocalPointPicker";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState, useRef } from "react";
import { toast } from "sonner";

import heroYoga from "@/assets/hero-yoga.jpg";
import teacherShira from "@/assets/teacher-shira.jpg";
import studioInterior from "@/assets/studio-interior.jpg";
import meditationHands from "@/assets/meditation-hands.jpg";
import yogaSunset from "@/assets/yoga-sunset.jpg";
import yogaGroup from "@/assets/yoga-group.jpg";

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

const defaultHeroImages = [heroYoga, studioInterior, yogaGroup, yogaSunset, meditationHands];

const Index = () => {
  const { isEditMode } = useAdminMode();
  const { getText, saveText } = usePageContent("home");

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
  const [heroFocalIndex, setHeroFocalIndex] = useState<number | null>(null);
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Get hero images from page_content or use defaults
  const heroImages = defaultHeroImages.map((defaultSrc, i) => {
    const saved = getText(`hero-image-${i}`, "");
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

  const E = ({ section, fallback, as, className, multiline }: { section: string; fallback: string; as?: "h1"|"h2"|"h3"|"p"|"span"|"div"; className?: string; multiline?: boolean }) => {
    const val = getText(section, fallback);
    if (!isEditMode) {
      const Tag = as || "span";
      return <Tag className={className}>{val}</Tag>;
    }
    return <EditableText value={val} onSave={(v) => saveText(section, v)} as={as} className={className} multiline={multiline} />;
  };

  // Helper: wrap Link buttons so they don't navigate in edit mode
  const MaybeLink = ({ to, children, ...props }: { to: string; children: React.ReactNode; [key: string]: any }) => {
    if (isEditMode) {
      return <span {...props} className={props.className} style={{ cursor: "default" }}>{children}</span>;
    }
    return <Link to={to} {...props}>{children}</Link>;
  };

  // Get section images from page_content or use defaults
  const getImage = (section: string, fallback: string) => {
    const saved = getText(section, "");
    return saved || fallback;
  };

  return (
    <Layout>
      {/* Hero with image carousel */}
      <section className="relative min-h-[85vh] md:min-h-screen flex items-end overflow-hidden">
        {/* Image carousel background */}
        <div className="absolute inset-0" ref={heroEmblaRef}>
          <div className="flex h-full">
            {heroImages.map((src, i) => (
              <div key={i} className="flex-none w-full h-full min-w-0 relative">
                <img src={src} alt={`יוגה במושבה ${i + 1}`} className="w-full h-full object-cover" style={{ objectPosition: getText(`hero-image-${i}-pos`, "50% 50%") }} />
              </div>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-yoga-dark/90 via-yoga-dark/30 to-transparent" />

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

        {/* Admin: hero image editor panel */}
        <AnimatePresence>
          {isEditMode && showHeroEditor && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-24 right-4 z-40 bg-card/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border p-4 w-[calc(100%-2rem)] max-w-sm"
              dir="rtl"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading font-semibold text-sm">תמונות קרוסלה</h3>
                <button onClick={() => setShowHeroEditor(false)} className="w-7 h-7 rounded-full bg-muted/60 flex items-center justify-center hover:bg-muted transition-colors">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {heroImages.map((src, i) => (
                  <div key={i} className="relative group">
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
                    <div
                      className="aspect-video rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary transition-colors"
                      onClick={() => fileRefs.current[i]?.click()}
                    >
                      <img src={src} alt={`תמונה ${i + 1}`} className="w-full h-full object-cover" style={{ objectPosition: getText(`hero-image-${i}-pos`, "50% 50%") }} />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                        {uploadingIndex === i ? (
                          <Loader2 className="h-5 w-5 text-white animate-spin" />
                        ) : (
                          <Camera className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-muted-foreground">{i + 1}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); setHeroFocalIndex(i); }}
                        className="text-[10px] text-primary hover:underline flex items-center gap-0.5"
                      >
                        <Move className="h-2.5 w-2.5" /> מיקוד
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="container mx-auto px-4 relative z-10 pb-12 md:pb-28 pt-28 md:pt-40">
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
            <motion.div variants={fadeUp}>
              <E section="hero-title" fallback="יוגה במושבה" as="h1"
                className="font-heading text-4xl md:text-7xl lg:text-8xl font-extrabold text-primary-foreground mb-4 md:mb-6 leading-[1.05] tracking-tight" />
            </motion.div>
            <motion.div variants={fadeUp}>
              <E section="hero-subtitle" fallback="מקום של שקט, נשימה וחיבור. בואו לתרגל במרחב חם ומזמין עם שירה פלג וצוות המורים שלנו." as="p"
                className="text-base md:text-xl text-primary-foreground/80 leading-relaxed mb-8 md:mb-10 max-w-lg" multiline />
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <Button size="lg" className="rounded-full px-8 md:px-10 h-12 md:h-14 text-base shadow-xl shadow-primary/30" asChild={!isEditMode}>
                {isEditMode ? (
                  <span><E section="hero-btn-schedule" fallback="לוח שיעורים" /></span>
                ) : (
                  <Link to="/schedule"><E section="hero-btn-schedule" fallback="לוח שיעורים" /></Link>
                )}
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 md:px-10 h-12 md:h-14 text-base border-primary-foreground/50 text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20 hover:text-primary-foreground backdrop-blur-md" asChild={!isEditMode}>
                {isEditMode ? (
                  <span><E section="hero-btn-about" fallback="הכירו אותנו" /></span>
                ) : (
                  <Link to="/about"><E section="hero-btn-about" fallback="הכירו אותנו" /></Link>
                )}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Welcome / About */}
      <section className="py-14 md:py-36">
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
              <Button variant="outline" className="rounded-full gap-2 px-8 h-12" asChild={!isEditMode}>
                {isEditMode ? (
                  <span><E section="welcome-btn" fallback="קראו עוד עלינו" /><ArrowLeft className="h-4 w-4" /></span>
                ) : (
                  <Link to="/about"><E section="welcome-btn" fallback="קראו עוד עלינו" /><ArrowLeft className="h-4 w-4" /></Link>
                )}
              </Button>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[3/4]">
                <EditableImage
                  src={getImage("welcome-img-main", teacherShira)}
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
                  src={getImage("welcome-img-secondary", studioInterior)}
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

      {/* Full-width image divider */}
      <section className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        <EditableImage
          src={getImage("cta-bg-image", yogaSunset)}
          alt="יוגה"
          className="absolute inset-0 w-full h-full object-cover"
          folder="cta"
          onUpload={isEditMode ? (url) => saveText("cta-bg-image", url) : undefined}
          objectPosition={getText("cta-bg-image-pos", "50% 50%")}
          onPositionChange={isEditMode ? (pos) => saveText("cta-bg-image-pos", pos) : undefined}
        />
        <div className="absolute inset-0 bg-yoga-dark/50 flex items-center justify-center pointer-events-none">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center px-4 pointer-events-auto">
            <E section="cta-title" fallback="התחילו לנשום" as="h2"
              className="font-heading text-3xl md:text-6xl font-bold text-primary-foreground mb-4" />
            <E section="cta-subtitle" fallback="הצטרפו למשפחת יוגה במושבה ותגלו מרחב חדש של שקט ורוגע" as="p"
              className="text-primary-foreground/70 text-lg mb-8 max-w-md mx-auto" />
            <Button size="lg" className="rounded-full px-10 h-14 text-lg shadow-xl shadow-primary/30" asChild={!isEditMode}>
              {isEditMode ? (
                <span><E section="cta-btn" fallback="בואו נתחיל" /></span>
              ) : (
                <Link to="/contact"><E section="cta-btn" fallback="בואו נתחיל" /></Link>
              )}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-14 md:py-36 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="rounded-3xl overflow-hidden shadow-xl aspect-square">
              <EditableImage
                src={getImage("benefits-image", meditationHands)}
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
