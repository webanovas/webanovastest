import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Leaf, Award, Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const About = () => {
  return (
    <Layout>
      <PageHero
        label="הסטודיו שלנו"
        title="על הסטודיו"
        subtitle="יוגה במושבה הוא סטודיו בוטיק בכיכר המושבה בהוד השרון. אנחנו מאמינים שיוגה היא לא רק תרגול גופני – אלא דרך חיים של מודעות, נשימה וחיבור פנימי."
      />

      {/* About Shira - with large image */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center max-w-5xl mx-auto">
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-xl">
                <img src="/placeholder.svg" alt="שירה פלג" className="w-full aspect-[4/5] object-cover" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-2xl bg-primary/10 -z-10" />
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-2xl bg-yoga-sand/40 -z-10" />
            </div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.span variants={fadeUp} className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block">
                בעלת הסטודיו
              </motion.span>
              <motion.h2 variants={fadeUp} className="font-heading text-3xl md:text-4xl font-bold mb-5">
                שירה פלג
              </motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed mb-4 text-lg">
                מורה ומטפלת ביוגה עם ניסיון של שנים רבות. שירה מלמדת מתוך אהבה אמיתית לתרגול ומאמינה שכל אחד יכול למצוא את הדרך שלו על המזרן.
              </motion.p>
              <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed mb-8">
                הסטודיו מציע מרחב חם ומזמין, עם קבוצות קטנות שמאפשרות תשומת לב אישית לכל מתרגל ומתרגלת.
              </motion.p>
              <motion.div variants={fadeUp}>
                <Button variant="outline" className="rounded-xl gap-2 px-6 h-12" asChild>
                  <Link to="/schedule">
                    לוח שיעורים
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Studio Gallery */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="rounded-2xl overflow-hidden shadow-md">
                <img src="/placeholder.svg" alt={`סטודיו ${i}`} className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 md:py-32 bg-yoga-cream relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.span variants={fadeUp} className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block">
              מי אנחנו
            </motion.span>
            <motion.h2 variants={fadeUp} className="font-heading text-3xl md:text-4xl font-bold">
              הערכים שלנו
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto"
          >
            {[
              { icon: Leaf, title: "טבעיות", desc: "תרגול שמכבד את הגוף ואת הקצב האישי" },
              { icon: Award, title: "מקצועיות", desc: "הכשרה מעמיקה וליווי מותאם אישית" },
              { icon: Heart, title: "קהילה", desc: "מרחב חם, קשוב ותומך לכל המתרגלים" },
            ].map((v) => (
              <motion.div key={v.title} variants={fadeUp} className="text-center group">
                <div className="w-20 h-20 rounded-3xl bg-primary/8 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-primary/5">
                  <v.icon className="h-9 w-9 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-xl mb-2">{v.title}</h3>
                <p className="text-muted-foreground text-sm">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Image Banner */}
      <section className="relative h-[40vh] overflow-hidden">
        <img src="/placeholder.svg" alt="יוגה" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-yoga-dark/60 flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
              בואו <span className="text-primary">לתרגל</span>
            </h2>
            <Button size="lg" className="rounded-xl px-8 h-14 text-lg shadow-xl shadow-primary/30" asChild>
              <Link to="/contact">צרו קשר</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Blog placeholder */}
      <section className="py-20 md:py-32">
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
