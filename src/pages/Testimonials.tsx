import { motion } from "framer-motion";
import Layout from "@/components/Layout";
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
      <section className="bg-yoga-sage-light py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">מילים חמות</h1>
          <p className="text-muted-foreground text-lg">מה אומרים המתרגלים שלנו</p>
        </div>
      </section>

      <section className="py-16 md:py-24">
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
                <Card className="h-full border-border/50">
                  <CardContent className="pt-6">
                    <Quote className="h-6 w-6 text-primary/30 mb-3" />
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">{t.text}</p>
                    <p className="font-heading font-semibold text-primary">— {t.name}</p>
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
