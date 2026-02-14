import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import {
  Users, Monitor, User, Heart,
  Leaf, Brain, Sunrise, Wind,
  Phone, Mail, MessageCircle, Send,
  ArrowLeft,
} from "lucide-react";
import Layout from "@/components/Layout";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const services = [
  { icon: Users, title: "שיעורים בסטודיו", desc: "שיעורי יוגה קבוצתיים באווירה חמה ומזמינה" },
  { icon: Monitor, title: "שיעורי זום", desc: "תרגלו מהנוחות של הבית בשיעורים אונליין" },
  { icon: User, title: "שיעורים פרטיים", desc: "תרגול מותאם אישית לצרכים שלכם" },
  { icon: Heart, title: "קבוצות מיוחדות", desc: "שיעורים לקבוצות, ימי כיף ואירועים" },
];

const benefits = [
  { icon: Leaf, title: "גמישות ובריאות", desc: "שיפור גמישות הגוף וחיזוק שרירים" },
  { icon: Brain, title: "מיקוד ושקט", desc: "הרגעת המחשבות ושיפור הריכוז" },
  { icon: Sunrise, title: "אנרגיה וחיוניות", desc: "תחושת רעננות ואנרגיה לאורך היום" },
  { icon: Wind, title: "הפחתת מתח", desc: "שחרור מתחים ושיפור איכות השינה" },
];

const testimonials = [
  { name: "ר.כ", text: "שירה מצליחה ליצור מרחב בטוח ומזמין. כל שיעור הוא חוויה מחדש." },
  { name: "מ.ד", text: "מאז שהתחלתי לתרגל בסטודיו, הגב שלי משתפר והנפש רגועה." },
  { name: "ל.ש", text: "האווירה בסטודיו מדהימה. שירה מורה קשובה ומקצועית." },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero - Full screen dramatic */}
      <section className="relative min-h-screen flex items-end overflow-hidden bg-yoga-dark">
        {/* Background placeholder */}
        <div className="absolute inset-0 bg-gradient-to-br from-yoga-sage/30 via-yoga-dark/60 to-yoga-dark" />
        <div className="absolute inset-0 hero-gradient" />

        {/* Decorative elements */}
        <div className="absolute top-1/4 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl animate-float" />
        <div className="absolute bottom-1/3 right-10 w-48 h-48 rounded-full bg-yoga-sand/5 blur-3xl animate-float" style={{ animationDelay: "3s" }} />

        <div className="container mx-auto px-4 pb-20 md:pb-28 pt-32 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-3xl"
          >
            <motion.div variants={fadeUp} className="mb-6">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground/80 text-sm font-body border border-primary-foreground/10">
                🧘 כיכר המושבה, הוד השרון
              </span>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="font-heading text-5xl md:text-7xl lg:text-8xl font-extrabold text-primary-foreground mb-6 leading-[1.1] tracking-tight"
            >
              יוגה במושבה
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-lg md:text-xl text-primary-foreground/70 leading-relaxed mb-10 max-w-xl font-light"
            >
              מקום של שקט, נשימה וחיבור.
              בואו לתרגל במרחב חם ומזמין, עם שירה פלג וצוות המורים המקצועי שלנו.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <Button size="lg" className="rounded-xl px-8 h-13 text-base shadow-lg shadow-primary/20" asChild>
                <Link to="/schedule">מערכת שעות</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl px-8 h-13 text-base border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                asChild
              >
                <Link to="/contact">צרו קשר</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 rounded-full border-2 border-primary-foreground/20 flex items-start justify-center p-1.5"
          >
            <div className="w-1.5 h-2.5 rounded-full bg-primary-foreground/40" />
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.span variants={fadeUp} className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block">
              שירותים
            </motion.span>
            <motion.h2 variants={fadeUp} className="font-heading text-3xl md:text-5xl font-bold mb-4">
              מה אנחנו מציעים
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground max-w-md mx-auto">
              מגוון אפשרויות תרגול שמותאמות לכל אחת ואחד
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {services.map((s) => (
              <motion.div key={s.title} variants={fadeUp}>
                <Card className="text-center h-full glass-card hover-lift rounded-2xl border-border/30">
                  <CardContent className="pt-10 pb-8 flex flex-col items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center">
                      <s.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-heading font-semibold text-lg">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 md:py-32 bg-yoga-cream relative overflow-hidden">
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
              יתרונות
            </motion.span>
            <motion.h2 variants={fadeUp} className="font-heading text-3xl md:text-5xl font-bold">
              למה יוגה?
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
          >
            {benefits.map((b) => (
              <motion.div key={b.title} variants={fadeUp} className="text-center group">
                <div className="w-18 h-18 rounded-2xl bg-primary/8 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/15 transition-colors">
                  <b.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials preview */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.span variants={fadeUp} className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block">
              המלצות
            </motion.span>
            <motion.h2 variants={fadeUp} className="font-heading text-3xl md:text-5xl font-bold mb-4">
              מילים חמות
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground">
              מה אומרים המתרגלים שלנו
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {testimonials.map((t) => (
              <motion.div key={t.name} variants={fadeUp}>
                <Card className="h-full glass-card rounded-2xl border-border/30 hover-lift">
                  <CardContent className="pt-8 pb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center mb-4">
                      <span className="text-primary text-lg">"</span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-5 leading-relaxed">{t.text}</p>
                    <p className="font-heading font-semibold text-primary text-sm">— {t.name}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mt-10"
          >
            <Button variant="outline" className="rounded-xl gap-2" asChild>
              <Link to="/testimonials">
                לכל המילים החמות
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Contact preview */}
      <section className="py-20 md:py-32 bg-yoga-sand relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.span variants={fadeUp} className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block">
                צרו קשר
              </motion.span>
              <motion.h2 variants={fadeUp} className="font-heading text-3xl md:text-4xl font-bold mb-4">
                בואו נדבר
              </motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground mb-8">
                רוצים לשמוע עוד? השאירו פרטים ונחזור אליכם בהקדם.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-col gap-4 text-sm">
                <a href="tel:0501234567" className="flex items-center gap-3 text-foreground/70 hover:text-primary transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  050-123-4567
                </a>
                <a href="mailto:info@yogabamoshava.co.il" className="flex items-center gap-3 text-foreground/70 hover:text-primary transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  info@yogabamoshava.co.il
                </a>
                <a
                  href="https://wa.me/972501234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-foreground/70 hover:text-primary transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-primary" />
                  </div>
                  שלחו הודעה בוואטסאפ
                </a>
              </motion.div>
            </motion.div>

            <motion.form
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="flex flex-col gap-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <motion.div variants={fadeUp}>
                <Input placeholder="שם מלא" className="bg-background rounded-xl h-12" />
              </motion.div>
              <motion.div variants={fadeUp}>
                <Input type="email" placeholder="אימייל" className="bg-background rounded-xl h-12" />
              </motion.div>
              <motion.div variants={fadeUp}>
                <Input type="tel" placeholder="טלפון" className="bg-background rounded-xl h-12" />
              </motion.div>
              <motion.div variants={fadeUp}>
                <Textarea placeholder="הודעה" rows={4} className="bg-background rounded-xl" />
              </motion.div>
              <motion.div variants={fadeUp}>
                <Button type="submit" className="w-full gap-2 rounded-xl h-12 text-base shadow-lg shadow-primary/20">
                  <Send className="h-4 w-4" />
                  שלחו הודעה
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
