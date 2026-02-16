import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Leaf, Award, Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAdminMode } from "@/hooks/useAdminMode";
import { usePageContent } from "@/hooks/usePageContent";
import EditableText from "@/components/admin/EditableText";

import teacherShira from "@/assets/teacher-shira.jpg";
import studioInterior from "@/assets/studio-interior.jpg";
import yogaGroup from "@/assets/yoga-group.jpg";
import meditationHands from "@/assets/meditation-hands.jpg";
import yogaSunset from "@/assets/yoga-sunset.jpg";
import heroYoga from "@/assets/hero-yoga.jpg";
import zoomYoga from "@/assets/zoom-yoga.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const galleryImages = [
  { src: studioInterior, alt: "הסטודיו" },
  { src: yogaGroup, alt: "שיעור קבוצתי" },
  { src: meditationHands, alt: "מדיטציה" },
  { src: heroYoga, alt: "תרגול יוגה" },
  { src: zoomYoga, alt: "שיעור זום" },
  { src: yogaSunset, alt: "יוגה בשקיעה" },
];

const valueIcons = [Leaf, Award, Heart];
const valueDefaults = [
  { title: "טבעיות", desc: "תרגול שמכבד את הגוף ואת הקצב האישי" },
  { title: "מקצועיות", desc: "הכשרה מעמיקה וליווי מותאם אישית" },
  { title: "קהילה", desc: "מרחב חם, קשוב ותומך לכל המתרגלים" },
];

const About = () => {
  const { isEditMode } = useAdminMode();
  const { getText, saveText } = usePageContent("about");

  const E = ({ section, fallback, as, className, multiline }: { section: string; fallback: string; as?: "h1"|"h2"|"h3"|"p"|"span"|"div"; className?: string; multiline?: boolean }) => {
    const val = getText(section, fallback);
    if (!isEditMode) {
      const Tag = as || "span";
      return <Tag className={className}>{val}</Tag>;
    }
    return <EditableText value={val} onSave={(v) => saveText(section, v)} as={as} className={className} multiline={multiline} />;
  };

  return (
    <Layout>
      <PageHero
        label="הסטודיו שלנו"
        title="על הסטודיו"
        subtitle="יוגה במושבה הוא סטודיו בוטיק בכיכר המושבה בהוד השרון"
        page="about"
        labelSection="hero-label"
        titleSection="hero-title"
        subtitleSection="hero-subtitle"
      />

      {/* About Shira */}
      <section className="py-14 md:py-36">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[3/4]">
                <img src={teacherShira} alt="שירה פלג" className="w-full h-full object-cover" />
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.div variants={fadeUp}>
                <E section="shira-label" fallback="בעלת הסטודיו" as="span" className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block" />
              </motion.div>
              <motion.div variants={fadeUp}>
                <E section="shira-name" fallback="שירה פלג" as="h2" className="font-heading text-3xl md:text-4xl font-bold mb-5" />
              </motion.div>
              <motion.div variants={fadeUp}>
                <E section="shira-bio-1" fallback="מורה ומטפלת ביוגה עם ניסיון של שנים רבות. שירה מלמדת מתוך אהבה אמיתית לתרגול ומאמינה שכל אחד יכול למצוא את הדרך שלו על המזרן." as="p" className="text-muted-foreground leading-relaxed mb-4 text-lg" multiline />
              </motion.div>
              <motion.div variants={fadeUp}>
                <E section="shira-bio-2" fallback="הסטודיו מציע מרחב חם ומזמין, עם קבוצות קטנות שמאפשרות תשומת לב אישית לכל מתרגל ומתרגלת." as="p" className="text-muted-foreground leading-relaxed mb-8" multiline />
              </motion.div>
              <motion.div variants={fadeUp}>
                <Button variant="outline" className="rounded-full gap-2 px-8 h-12" asChild>
                  <Link to="/schedule"><E section="shira-btn" fallback="לוח שיעורים" /><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-4 px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {galleryImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl overflow-hidden shadow-md aspect-square"
            >
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-14 md:py-36 bg-yoga-cream relative">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
            <motion.div variants={fadeUp}>
              <E section="values-label" fallback="מי אנחנו" as="span" className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block" />
            </motion.div>
            <motion.div variants={fadeUp}>
              <E section="values-title" fallback="הערכים שלנו" as="h2" className="font-heading text-3xl md:text-4xl font-bold" />
            </motion.div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
            {valueDefaults.map((v, i) => {
              const Icon = valueIcons[i];
              return (
                <motion.div key={i} variants={fadeUp} className="text-center group">
                  <div className="w-20 h-20 rounded-full bg-primary/8 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300">
                    <Icon className="h-9 w-9 text-primary" />
                  </div>
                  <E section={`value-${i}-title`} fallback={v.title} as="h3" className="font-heading font-semibold text-xl mb-2" />
                  <E section={`value-${i}-desc`} fallback={v.desc} as="p" className="text-muted-foreground text-sm" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img src={yogaSunset} alt="יוגה בשקיעה" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-yoga-dark/50 flex items-center justify-center">
          <div className="text-center px-4">
            <E section="cta-title" fallback="בואו לתרגל" as="h2"
              className="font-heading text-3xl md:text-5xl font-bold text-primary-foreground mb-4" />
            <Button size="lg" className="rounded-full px-10 h-14 text-lg shadow-xl shadow-primary/30" asChild>
              <Link to="/contact"><E section="cta-btn" fallback="צרו קשר" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Blog placeholder */}
      <section className="py-14 md:py-36">
        <div className="container mx-auto px-4 text-center">
          <E section="blog-label" fallback="בקרוב" as="span" className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block" />
          <E section="blog-title" fallback="מאמרים ותוכן" as="h2" className="font-heading text-3xl font-bold mb-4" />
          <E section="blog-subtitle" fallback="בקרוב – מאמרים, טיפים ותכנים מעולם היוגה" as="p" className="text-muted-foreground mb-8 text-lg" />
          <div className="bg-accent/40 rounded-3xl p-14 max-w-2xl mx-auto border border-border/30">
            <E section="blog-placeholder" fallback="מקום שמור לבלוג עתידי 🌿" as="p" className="text-muted-foreground text-sm" />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
