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
} from "lucide-react";
import Layout from "@/components/Layout";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
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
      {/* Hero */}
      <section className="relative bg-yoga-sage-light overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/30" />
        <div className="container mx-auto px-4 py-24 md:py-36 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-2xl"
          >
            <motion.h1
              variants={fadeUp}
              className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight"
            >
              יוגה במושבה
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8"
            >
              סטודיו יוגה בכיכר המושבה בהוד השרון – מקום של שקט, נשימה וחיבור.
              בואו לתרגל במרחב חם ומזמין, עם שירה פלג וצוות המורים המקצועי שלנו.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link to="/schedule">מערכת שעות</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">צרו קשר</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeUp} className="font-heading text-3xl md:text-4xl font-bold mb-4">
              מה אנחנו מציעים
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground max-w-xl mx-auto">
              מגוון אפשרויות תרגול שמותאמות לכל אחת ואחד
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {services.map((s) => (
              <motion.div key={s.title} variants={fadeUp}>
                <Card className="text-center h-full hover:shadow-md transition-shadow border-border/50">
                  <CardContent className="pt-8 pb-6 flex flex-col items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center">
                      <s.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-heading font-semibold text-lg">{s.title}</h3>
                    <p className="text-sm text-muted-foreground">{s.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24 bg-yoga-cream">
        <div className="container mx-auto px-4">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="font-heading text-3xl md:text-4xl font-bold text-center mb-12"
          >
            למה יוגה?
          </motion.h2>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {benefits.map((b) => (
              <motion.div key={b.title} variants={fadeUp} className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <b.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials preview */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeUp} className="font-heading text-3xl md:text-4xl font-bold mb-4">
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
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            {testimonials.map((t) => (
              <motion.div key={t.name} variants={fadeUp}>
                <Card className="h-full border-border/50">
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">"{t.text}"</p>
                    <p className="font-heading font-semibold text-primary">— {t.name}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link to="/testimonials">לכל המילים החמות</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Contact preview */}
      <section className="py-16 md:py-24 bg-yoga-sand">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.h2 variants={fadeUp} className="font-heading text-3xl font-bold mb-4">
                צרו קשר
              </motion.h2>
              <motion.p variants={fadeUp} className="text-muted-foreground mb-6">
                רוצים לשמוע עוד? השאירו פרטים ונחזור אליכם בהקדם.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-col gap-3 text-sm">
                <a href="tel:0501234567" className="flex items-center gap-2 text-foreground hover:text-primary">
                  <Phone className="h-4 w-4" /> 050-123-4567
                </a>
                <a href="mailto:info@yogabamoshava.co.il" className="flex items-center gap-2 text-foreground hover:text-primary">
                  <Mail className="h-4 w-4" /> info@yogabamoshava.co.il
                </a>
                <a
                  href="https://wa.me/972501234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-foreground hover:text-primary"
                >
                  <MessageCircle className="h-4 w-4" /> שלחו הודעה בוואטסאפ
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
                <Input placeholder="שם מלא" className="bg-background" />
              </motion.div>
              <motion.div variants={fadeUp}>
                <Input type="email" placeholder="אימייל" className="bg-background" />
              </motion.div>
              <motion.div variants={fadeUp}>
                <Input type="tel" placeholder="טלפון" className="bg-background" />
              </motion.div>
              <motion.div variants={fadeUp}>
                <Textarea placeholder="הודעה" rows={4} className="bg-background" />
              </motion.div>
              <motion.div variants={fadeUp}>
                <Button type="submit" className="w-full gap-2">
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
