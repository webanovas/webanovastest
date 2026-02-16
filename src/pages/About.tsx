import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Leaf, Award, Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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

const About = () => {
  return (
    <Layout>
      <PageHero
        label="הסטודיו שלנו"
        title="על הסטודיו"
        subtitle="יוגה במושבה הוא סטודיו בוטיק בכיכר המושבה בהוד השרון"
      />

      {/* About Shira */}
      <section className="py-24 md:py-36">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[3/4]">
                <img src={teacherShira} alt="שירה פלג" className="w-full h-full object-cover" />
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.span variants={fadeUp} className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block">בעלת הסטודיו</motion.span>
              <motion.h2 variants={fadeUp} className="font-heading text-3xl md:text-4xl font-bold mb-5">שירה פלג</motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed mb-4 text-lg">
                מורה ומטפלת ביוגה עם ניסיון של שנים רבות. שירה מלמדת מתוך אהבה אמיתית לתרגול ומאמינה שכל אחד יכול למצוא את הדרך שלו על המזרן.
              </motion.p>
              <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed mb-8">
                הסטודיו מציע מרחב חם ומזמין, עם קבוצות קטנות שמאפשרות תשומת לב אישית לכל מתרגל ומתרגלת.
              </motion.p>
              <motion.div variants={fadeUp}>
                <Button variant="outline" className="rounded-full gap-2 px-8 h-12" asChild>
                  <Link to="/schedule">לוח שיעורים<ArrowLeft className="h-4 w-4" /></Link>
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
      <section className="py-24 md:py-36 bg-yoga-cream relative">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
            <motion.span variants={fadeUp} className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block">מי אנחנו</motion.span>
            <motion.h2 variants={fadeUp} className="font-heading text-3xl md:text-4xl font-bold">הערכים שלנו</motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
            {[
              { icon: Leaf, title: "טבעיות", desc: "תרגול שמכבד את הגוף ואת הקצב האישי" },
              { icon: Award, title: "מקצועיות", desc: "הכשרה מעמיקה וליווי מותאם אישית" },
              { icon: Heart, title: "קהילה", desc: "מרחב חם, קשוב ותומך לכל המתרגלים" },
            ].map((v) => (
              <motion.div key={v.title} variants={fadeUp} className="text-center group">
                <div className="w-20 h-20 rounded-full bg-primary/8 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300">
                  <v.icon className="h-9 w-9 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-xl mb-2">{v.title}</h3>
                <p className="text-muted-foreground text-sm">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative h-[50vh] overflow-hidden">
        <img src={yogaSunset} alt="יוגה בשקיעה" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-yoga-dark/50 flex items-center justify-center">
          <div className="text-center px-4">
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
              בואו <span className="font-light italic">לתרגל</span>
            </h2>
            <Button size="lg" className="rounded-full px-10 h-14 text-lg shadow-xl shadow-primary/30" asChild>
              <Link to="/contact">צרו קשר</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Blog placeholder */}
      <section className="py-24 md:py-36">
        <div className="container mx-auto px-4 text-center">
          <span className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block">בקרוב</span>
          <h2 className="font-heading text-3xl font-bold mb-4">מאמרים ותוכן</h2>
          <p className="text-muted-foreground mb-8 text-lg">בקרוב – מאמרים, טיפים ותכנים מעולם היוגה</p>
          <div className="bg-accent/40 rounded-3xl p-14 max-w-2xl mx-auto border border-border/30">
            <p className="text-muted-foreground text-sm">מקום שמור לבלוג עתידי 🌿</p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
