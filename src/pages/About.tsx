import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Leaf, Award, Heart } from "lucide-react";

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
      {/* Hero */}
      <section className="bg-yoga-sage-light py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl">
            <motion.h1 variants={fadeUp} className="font-heading text-4xl md:text-5xl font-bold mb-6">
              על הסטודיו
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg text-muted-foreground leading-relaxed">
              יוגה במושבה הוא סטודיו בוטיק בכיכר המושבה בהוד השרון. אנחנו מאמינים שיוגה היא לא רק תרגול גופני – אלא דרך חיים של מודעות, נשימה וחיבור פנימי.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* About Shira */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            {/* Placeholder image */}
            <div className="bg-accent rounded-2xl aspect-[4/5] flex items-center justify-center">
              <span className="text-muted-foreground text-sm">תמונה של שירה</span>
            </div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.h2 variants={fadeUp} className="font-heading text-3xl font-bold mb-4">
                שירה פלג
              </motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed mb-4">
                מורה ומטפלת ביוגה עם ניסיון של שנים רבות. שירה מלמדת מתוך אהבה אמיתית לתרגול ומאמינה שכל אחד יכול למצוא את הדרך שלו על המזרן.
              </motion.p>
              <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed">
                הסטודיו מציע מרחב חם ומזמין, עם קבוצות קטנות שמאפשרות תשומת לב אישית לכל מתרגל ומתרגלת.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-yoga-cream">
        <div className="container mx-auto px-4">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="font-heading text-3xl font-bold text-center mb-12"
          >
            הערכים שלנו
          </motion.h2>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              { icon: Leaf, title: "טבעיות", desc: "תרגול שמכבד את הגוף ואת הקצב האישי" },
              { icon: Award, title: "מקצועיות", desc: "הכשרה מעמיקה וליווי מותאם אישית" },
              { icon: Heart, title: "קהילה", desc: "מרחב חם, קשוב ותומך לכל המתרגלים" },
            ].map((v) => (
              <motion.div key={v.title} variants={fadeUp} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <v.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-xl mb-2">{v.title}</h3>
                <p className="text-muted-foreground text-sm">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Blog placeholder */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">מאמרים ותוכן</h2>
          <p className="text-muted-foreground mb-8">בקרוב – מאמרים, טיפים ותכנים מעולם היוגה</p>
          <div className="bg-accent/50 rounded-2xl p-12 max-w-2xl mx-auto">
            <p className="text-muted-foreground text-sm">מקום שמור לבלוג עתידי 🌿</p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
