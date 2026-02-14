import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MessageCircle, MapPin, Instagram, Send } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const Contact = () => {
  return (
    <Layout>
      <PageHero
        label="נשמח לשמוע"
        title="צור קשר"
        subtitle="נשמח לשמוע מכם ולענות על כל שאלה"
      />

      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 max-w-4xl mx-auto">
            {/* Contact info */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.span variants={fadeUp} className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block">
                פרטים
              </motion.span>
              <motion.h2 variants={fadeUp} className="font-heading text-2xl font-bold mb-8">
                פרטי התקשרות
              </motion.h2>

              <motion.div variants={fadeUp} className="flex flex-col gap-5 mb-10">
                <a href="tel:0501234567" className="flex items-center gap-4 text-foreground/70 hover:text-primary transition-colors">
                  <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  050-123-4567
                </a>
                <a href="https://wa.me/972501234567" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-foreground/70 hover:text-primary transition-colors">
                  <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  וואטסאפ
                </a>
                <a href="mailto:info@yogabamoshava.co.il" className="flex items-center gap-4 text-foreground/70 hover:text-primary transition-colors">
                  <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  info@yogabamoshava.co.il
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-foreground/70 hover:text-primary transition-colors">
                  <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center">
                    <Instagram className="h-5 w-5 text-primary" />
                  </div>
                  @yogabamoshava
                </a>
                <div className="flex items-center gap-4 text-foreground/70">
                  <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  כיכר המושבה, הוד השרון
                </div>
              </motion.div>

              {/* Map placeholder with image */}
              <motion.div variants={fadeUp} className="rounded-2xl overflow-hidden shadow-md border border-border/30">
                <img src="/placeholder.svg" alt="מפה - כיכר המושבה הוד השרון" className="w-full aspect-video object-cover" />
              </motion.div>
            </motion.div>

            {/* Form */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.span variants={fadeUp} className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block">
                טופס
              </motion.span>
              <motion.h2 variants={fadeUp} className="font-heading text-2xl font-bold mb-8">
                השאירו פרטים
              </motion.h2>

              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
                <motion.div variants={fadeUp}>
                  <Input placeholder="שם מלא" className="rounded-xl h-12" />
                </motion.div>
                <motion.div variants={fadeUp}>
                  <Input type="email" placeholder="אימייל" className="rounded-xl h-12" />
                </motion.div>
                <motion.div variants={fadeUp}>
                  <Input type="tel" placeholder="טלפון" className="rounded-xl h-12" />
                </motion.div>
                <motion.div variants={fadeUp}>
                  <Textarea placeholder="הודעה" rows={5} className="rounded-xl" />
                </motion.div>
                <motion.div variants={fadeUp}>
                  <Button type="submit" className="w-full gap-2 rounded-xl h-12 text-base shadow-lg shadow-primary/20">
                    <Send className="h-4 w-4" />
                    שלחו הודעה
                  </Button>
                </motion.div>
              </form>

              <motion.div variants={fadeUp} className="mt-5">
                <Button variant="outline" asChild className="w-full gap-2 rounded-xl h-12">
                  <a href="https://wa.me/972501234567" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4" />
                    שלחו הודעה בוואטסאפ
                  </a>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Studio image banner */}
      <section className="relative h-[30vh] overflow-hidden">
        <img src="/placeholder.svg" alt="הסטודיו" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-yoga-dark/50" />
      </section>
    </Layout>
  );
};

export default Contact;
