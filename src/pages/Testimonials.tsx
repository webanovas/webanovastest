import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const testimonials = [
  { name: "ר.כ", text: "שירה מצליחה ליצור מרחב בטוח ומזמין. כל שיעור הוא חוויה מחדש. אני מגיעה כל שבוע ומרגישה את ההבדל." },
  { name: "מ.ד", text: "מאז שהתחלתי לתרגל בסטודיו, הגב שלי משתפר והנפש רגועה. תודה שירה!" },
  { name: "ל.ש", text: "האווירה בסטודיו מדהימה. שירה מורה קשובה ומקצועית שיודעת להתאים את התרגול לכל אחד." },
  { name: "ד.א", text: "הגעתי כמתחילה וקיבלתי יחס אישי מדהים. היום אני לא מפספסת שיעור." },
  { name: "ע.ב", text: "שיעורי הזום של שירה הם ברמה גבוהה מאוד. מרגישה כאילו אני בסטודיו גם מהבית." },
  { name: "י.ג", text: "הסדנאות של שירה הן חוויה מיוחדת. שילוב נפלא של תרגול גופני ומנטלי." },
];

const Testimonials = () => {
  return (
    <Layout>
      <PageHero
        label="המלצות"
        title="מילים חמות"
        subtitle="מה אומרים המתרגלים שלנו"
      />

      {/* Image banner */}
      <section className="relative h-[25vh] overflow-hidden">
        <img src="/placeholder.svg" alt="תרגול יוגה" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-yoga-dark/40 to-background" />
      </section>

      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Card className="h-full glass-card rounded-2xl border-border/30 hover-lift">
                  <CardContent className="pt-8 pb-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <span key={j} className="text-primary text-lg">★</span>
                      ))}
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-5">{t.text}</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-heading font-bold text-primary text-sm">{t.name}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Testimonials;
