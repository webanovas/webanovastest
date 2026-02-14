import { motion } from "framer-motion";
import Layout from "@/components/Layout";
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
      <section className="bg-yoga-sage-light py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">צור קשר</h1>
          <p className="text-muted-foreground text-lg">נשמח לשמוע מכם ולענות על כל שאלה</p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Contact info */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.h2 variants={fadeUp} className="font-heading text-2xl font-bold mb-6">
                פרטי התקשרות
              </motion.h2>

              <motion.div variants={fadeUp} className="flex flex-col gap-4 mb-8">
                <a href="tel:0501234567" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  050-123-4567
                </a>
                <a href="https://wa.me/972501234567" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  וואטסאפ
                </a>
                <a href="mailto:info@yogabamoshava.co.il" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  info@yogabamoshava.co.il
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-foreground hover:text-primary transition-colors">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <Instagram className="h-5 w-5 text-primary" />
                  </div>
                  @yogabamoshava
                </a>
                <div className="flex items-center gap-3 text-foreground">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  כיכר המושבה, הוד השרון
                </div>
              </motion.div>

              {/* Map placeholder */}
              <motion.div variants={fadeUp} className="bg-accent rounded-xl aspect-video flex items-center justify-center">
                <span className="text-muted-foreground text-sm">מפת Google</span>
              </motion.div>
            </motion.div>

            {/* Form */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.h2 variants={fadeUp} className="font-heading text-2xl font-bold mb-6">
                השאירו פרטים
              </motion.h2>

              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
                <motion.div variants={fadeUp}>
                  <Input placeholder="שם מלא" />
                </motion.div>
                <motion.div variants={fadeUp}>
                  <Input type="email" placeholder="אימייל" />
                </motion.div>
                <motion.div variants={fadeUp}>
                  <Input type="tel" placeholder="טלפון" />
                </motion.div>
                <motion.div variants={fadeUp}>
                  <Textarea placeholder="הודעה" rows={5} />
                </motion.div>
                <motion.div variants={fadeUp}>
                  <Button type="submit" className="w-full gap-2">
                    <Send className="h-4 w-4" />
                    שלחו הודעה
                  </Button>
                </motion.div>
              </form>

              <motion.div variants={fadeUp} className="mt-6">
                <Button variant="outline" asChild className="w-full gap-2">
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
    </Layout>
  );
};

export default Contact;
