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
  ArrowLeft, Play,
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
  { icon: Users, title: "שיעורים בסטודיו", desc: "שיעורי יוגה קבוצתיים באווירה חמה ומזמינה", image: "/placeholder.svg" },
  { icon: Monitor, title: "שיעורי זום", desc: "תרגלו מהנוחות של הבית בשיעורים אונליין", image: "/placeholder.svg" },
  { icon: User, title: "שיעורים פרטיים", desc: "תרגול מותאם אישית לצרכים שלכם", image: "/placeholder.svg" },
  { icon: Heart, title: "קבוצות מיוחדות", desc: "שיעורים לקבוצות, ימי כיף ואירועים", image: "/placeholder.svg" },
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

const galleryImages = [
  { src: "/placeholder.svg", alt: "סטודיו יוגה" },
  { src: "/placeholder.svg", alt: "שיעור קבוצתי" },
  { src: "/placeholder.svg", alt: "תרגול יוגה" },
  { src: "/placeholder.svg", alt: "מדיטציה" },
  { src: "/placeholder.svg", alt: "סדנה" },
  { src: "/placeholder.svg", alt: "האווירה בסטודיו" },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero - Full screen cinematic */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-yoga-dark">
        {/* Background image placeholder */}
        <div className="absolute inset-0">
          <img src="/placeholder.svg" alt="יוגה במושבה" className="w-full h-full object-cover opacity-40" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-yoga-dark via-yoga-dark/60 to-yoga-dark/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-yoga-dark/80 to-transparent" />

        {/* Decorative floating elements */}
        <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-primary/8 blur-[100px] animate-float" />
        <div className="absolute bottom-1/3 right-10 w-56 h-56 rounded-full bg-yoga-sand/8 blur-[80px] animate-float" style={{ animationDelay: "3s" }} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-32">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              <motion.div variants={fadeUp} className="mb-6">
                <span className="inline-block px-5 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-md text-primary-foreground/90 text-sm font-body border border-primary-foreground/15 shadow-lg">
                  🧘 כיכר המושבה, הוד השרון
                </span>
              </motion.div>
              <motion.h1
                variants={fadeUp}
                className="font-heading text-5xl md:text-7xl lg:text-8xl font-extrabold text-primary-foreground mb-6 leading-[1.05] tracking-tight"
              >
                יוגה
                <br />
                <span className="text-primary">במושבה</span>
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="text-lg md:text-xl text-primary-foreground/70 leading-relaxed mb-10 max-w-lg font-light"
              >
                מקום של שקט, נשימה וחיבור.
                בואו לתרגל במרחב חם ומזמין, עם שירה פלג וצוות המורים המקצועי שלנו.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                <Button size="lg" className="rounded-xl px-8 h-14 text-base shadow-xl shadow-primary/30 text-lg" asChild>
                  <Link to="/schedule">לוח שיעורים</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl px-8 h-14 text-base border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground text-lg backdrop-blur-sm"
                  asChild
                >
                  <Link to="/about">הכירו אותנו</Link>
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div variants={fadeUp} className="flex gap-10 mt-14 pt-8 border-t border-primary-foreground/10">
                {[
                  { num: "10+", label: "שנות ניסיון" },
                  { num: "500+", label: "מתרגלים" },
                  { num: "15+", label: "שיעורים בשבוע" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="font-heading text-3xl font-bold text-primary">{s.num}</div>
                    <div className="text-primary-foreground/50 text-sm mt-1">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Hero right side - video/image placeholder */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="rounded-3xl overflow-hidden shadow-2xl shadow-black/30 border border-primary-foreground/10">
                  <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-yoga-dark/50 flex items-center justify-center relative">
                    <img src="/placeholder.svg" alt="שירה פלג - יוגה" className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button className="w-20 h-20 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                        <Play className="h-8 w-8 text-primary-foreground mr-[-2px]" />
                      </button>
                    </div>
                  </div>
                </div>
                {/* Floating card */}
                <div className="absolute -bottom-6 -right-6 bg-card/90 backdrop-blur-xl rounded-2xl p-5 shadow-xl border border-border/30">
                  <div className="text-sm font-heading font-semibold mb-1">השיעור הבא</div>
                  <div className="text-xs text-muted-foreground">ויניאסה בוקר • 08:00</div>
                  <div className="text-xs text-primary mt-1">שירה פלג</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 rounded-full border-2 border-primary-foreground/20 flex items-start justify-center p-1.5"
          >
            <div className="w-1.5 h-2.5 rounded-full bg-primary-foreground/40" />
          </motion.div>
        </div>
      </section>

      {/* Gallery Strip */}
      <section className="py-4 bg-yoga-dark overflow-hidden">
        <div className="flex gap-4 animate-[scroll_30s_linear_infinite]" style={{ width: "max-content" }}>
          {[...galleryImages, ...galleryImages].map((img, i) => (
            <div key={i} className="w-64 h-40 rounded-2xl overflow-hidden flex-shrink-0">
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </section>

      {/* About Preview */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-xl">
                <img src="/placeholder.svg" alt="הסטודיו שלנו" className="w-full aspect-[4/5] object-cover" />
              </div>
              {/* Accent decoration */}
              <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-2xl bg-primary/10 -z-10" />
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-2xl bg-yoga-sand/40 -z-10" />
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.span variants={fadeUp} className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block">
                הסיפור שלנו
              </motion.span>
              <motion.h2 variants={fadeUp} className="font-heading text-3xl md:text-5xl font-bold mb-5">
                מרחב של שקט
                <br />
                <span className="text-primary">ונשימה</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed mb-4 text-lg">
                יוגה במושבה הוא סטודיו בוטיק בלב הוד השרון. אנחנו מאמינים שיוגה היא לא רק תרגול גופני – אלא דרך חיים.
              </motion.p>
              <motion.p variants={fadeUp} className="text-muted-foreground leading-relaxed mb-8">
                שירה פלג, מורה ומטפלת ביוגה מנוסה, מובילה את הסטודיו מתוך אהבה אמיתית לתרגול ומחויבות לכל מתרגל ומתרגלת.
              </motion.p>
              <motion.div variants={fadeUp}>
                <Button variant="outline" className="rounded-xl gap-2 px-6 h-12" asChild>
                  <Link to="/about">
                    קראו עוד עלינו
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 md:py-32 bg-yoga-cream relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
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
            <motion.p variants={fadeUp} className="text-muted-foreground max-w-md mx-auto text-lg">
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
                <Card className="text-center h-full group rounded-2xl border-border/30 overflow-hidden hover-lift">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={s.image} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <CardContent className="pt-6 pb-8 flex flex-col items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center -mt-12 relative z-10 shadow-lg border-4 border-card">
                      <s.icon className="h-6 w-6 text-primary" />
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

      {/* Benefits - with visual background */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {benefits.map((b) => (
              <motion.div key={b.title} variants={fadeUp} className="text-center group">
                <div className="w-20 h-20 rounded-3xl bg-primary/8 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-primary/5">
                  <b.icon className="h-9 w-9 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Image Banner */}
      <section className="relative h-[50vh] overflow-hidden">
        <img src="/placeholder.svg" alt="תרגול יוגה" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-yoga-dark/60 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="font-heading text-4xl md:text-6xl font-bold text-primary-foreground mb-4">
              התחילו <span className="text-primary">לתרגל</span>
            </h2>
            <p className="text-primary-foreground/70 text-lg mb-8">הצטרפו למשפחת יוגה במושבה</p>
            <Button size="lg" className="rounded-xl px-10 h-14 text-lg shadow-xl shadow-primary/30" asChild>
              <Link to="/contact">בואו נתחיל</Link>
            </Button>
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
            <motion.p variants={fadeUp} className="text-muted-foreground text-lg">
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
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-primary text-lg">★</span>
                      ))}
                    </div>
                    <p className="text-muted-foreground text-sm mb-5 leading-relaxed">{t.text}</p>
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

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="text-center mt-10"
          >
            <Button variant="outline" className="rounded-xl gap-2 h-12 px-6" asChild>
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
              <motion.p variants={fadeUp} className="text-muted-foreground mb-8 text-lg">
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
