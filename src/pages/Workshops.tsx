import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import ImagePlaceholder from "@/components/ImagePlaceholder";

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
    imageLabel: "תמונת סדנה 1",
  },
  {
    title: "סדנת נשימות פרנאיאמה",
    date: "22 מרץ 2026",
    time: "09:00-11:00",
    desc: "סדנה מעמיקה בטכניקות נשימה עתיקות לשקט פנימי ובריאות.",
    location: "סטודיו יוגה במושבה",
    imageLabel: "תמונת סדנה 2",
  },
];

const pastWorkshops = [
  { title: "סדנת יוגה ומדיטציה", date: "דצמבר 2025", imageLabel: "תמונת ארכיון 1" },
  { title: "יוגה בשקיעה – אירוע מיוחד", date: "אוקטובר 2025", imageLabel: "תמונת ארכיון 2" },
  { title: "סדנת יין יוגה", date: "ספטמבר 2025", imageLabel: "תמונת ארכיון 3" },
];

const Workshops = () => {
  return (
    <Layout>
      <PageHero
        label="אירועים"
        title="סדנאות"
        subtitle="סדנאות מיוחדות להעמקת התרגול והחוויה"
      />

      {/* Active */}
      <section className="py-24 md:py-36">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block">קרוב</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold">סדנאות קרובות</h2>
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {activeWorkshops.map((w) => (
              <motion.div key={w.title} variants={fadeUp}>
                <Card className="h-full rounded-3xl border-0 overflow-hidden hover-lift shadow-lg">
                  <div className="aspect-video overflow-hidden">
                    <ImagePlaceholder label={w.imageLabel} />
                  </div>
                  <CardContent className="pt-6">
                    <h3 className="font-heading font-semibold text-xl mb-3">{w.title}</h3>
                    <p className="text-sm text-muted-foreground mb-5">{w.desc}</p>
                    <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-6">
                      <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />{w.date}</span>
                      <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" />{w.time}</span>
                      <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{w.location}</span>
                    </div>
                    <Button asChild className="w-full rounded-full h-11 shadow-lg shadow-primary/20">
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
      <section className="py-24 md:py-36 bg-yoga-cream relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block">ארכיון</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold">סדנאות שהיו</h2>
          </div>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {pastWorkshops.map((w) => (
              <Card key={w.title} className="rounded-3xl border-0 overflow-hidden shadow-md">
                <div className="aspect-video overflow-hidden">
                  <ImagePlaceholder label={w.imageLabel} />
                </div>
                <CardContent className="p-5">
                  <span className="font-heading font-medium text-sm">{w.title}</span>
                  <span className="text-xs text-muted-foreground block mt-1">{w.date}</span>
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
