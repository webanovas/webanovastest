import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const testimonials = [
  { name: "מילים חמות", text: "שירה מצליחה ליצור מרחב בטוח ומזמין. כל שיעור הוא חוויה מחדש. אני מגיעה כל שבוע ומרגישה את ההבדל." },
  { name: "מילים חמות", text: "מאז שהתחלתי לתרגל בסטודיו, הגב שלי משתפר והנפש רגועה. תודה שירה!" },
  { name: "מילים חמות", text: "האווירה בסטודיו מדהימה. שירה מורה קשובה ומקצועית שיודעת להתאים את התרגול לכל אחד." },
  { name: "מילים חמות", text: "הגעתי כמתחילה וקיבלתי יחס אישי מדהים. היום אני לא מפספסת שיעור." },
  { name: "מילים חמות", text: "שיעורי הזום של שירה הם ברמה גבוהה מאוד. מרגישה כאילו אני בסטודיו גם מהבית." },
  { name: "מילים חמות", text: "הסדנאות של שירה הן חוויה מיוחדת. שילוב נפלא של תרגול גופני ומנטלי." },
];

const Testimonials = () => {
  return (
    <Layout>
      <PageHero
        label="המלצות"
        title="מילים חמות"
        subtitle="מה אומרים המתרגלים שלנו"
      />

      <section className="py-24 md:py-36">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={fadeUp}>
                <Card className="h-full rounded-3xl border-0 shadow-md hover-lift bg-card">
                  <CardContent className="pt-8 pb-8 px-8">
                    <Quote className="h-8 w-8 text-primary/20 mb-4" />
                    <p className="text-foreground/80 leading-relaxed mb-6">{t.text}</p>
                    <div className="flex items-center gap-3 pt-4 border-t border-border">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-heading font-bold text-primary text-sm">{t.name}</span>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, j) => (
                          <span key={j} className="text-primary text-sm">★</span>
                        ))}
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
