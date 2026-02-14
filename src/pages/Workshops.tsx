import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const activeWorkshops = [
  {
    title: "סדנת יוגה וכתיבה יוצרת",
    date: "15 מרץ 2026",
    time: "10:00-13:00",
    desc: "שילוב של תרגול יוגה עם כתיבה יוצרת – חוויה מחברת לגוף ולנפש.",
    location: "סטודיו יוגה במושבה",
  },
  {
    title: "סדנת נשימות פרנאיאמה",
    date: "22 מרץ 2026",
    time: "09:00-11:00",
    desc: "סדנה מעמיקה בטכניקות נשימה עתיקות לשקט פנימי ובריאות.",
    location: "סטודיו יוגה במושבה",
  },
];

const pastWorkshops = [
  { title: "סדנת יוגה ומדיטציה", date: "דצמבר 2025" },
  { title: "יוגה בשקיעה – אירוע מיוחד", date: "אוקטובר 2025" },
  { title: "סדנת יין יוגה", date: "ספטמבר 2025" },
];

const Workshops = () => {
  return (
    <Layout>
      <section className="bg-yoga-sage-light py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">סדנאות</h1>
          <p className="text-muted-foreground text-lg">סדנאות מיוחדות להעמקת התרגול והחוויה</p>
        </div>
      </section>

      {/* Active */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold text-center mb-10">סדנאות קרובות</h2>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          >
            {activeWorkshops.map((w) => (
              <motion.div key={w.title} variants={fadeUp}>
                <Card className="h-full border-border/50 overflow-hidden">
                  <div className="bg-accent aspect-video flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">תמונת סדנה</span>
                  </div>
                  <CardContent className="pt-5">
                    <h3 className="font-heading font-semibold text-xl mb-2">{w.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{w.desc}</p>
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground mb-5">
                      <span className="flex items-center gap-2"><Calendar className="h-4 w-4" />{w.date}</span>
                      <span className="flex items-center gap-2"><Clock className="h-4 w-4" />{w.time}</span>
                      <span className="flex items-center gap-2"><MapPin className="h-4 w-4" />{w.location}</span>
                    </div>
                    <Button asChild className="w-full">
                      <Link to="/contact">הרשמה / פרטים</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Archive */}
      <section className="py-16 md:py-24 bg-yoga-cream">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold text-center mb-10">ארכיון סדנאות</h2>
          <div className="max-w-2xl mx-auto flex flex-col gap-3">
            {pastWorkshops.map((w) => (
              <Card key={w.title} className="border-border/50">
                <CardContent className="p-4 flex justify-between items-center">
                  <span className="font-heading font-medium">{w.title}</span>
                  <span className="text-sm text-muted-foreground">{w.date}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Workshops;
