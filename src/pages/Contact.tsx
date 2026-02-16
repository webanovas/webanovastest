import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MessageCircle, MapPin, Instagram, Send } from "lucide-react";
import studioInterior from "@/assets/studio-interior.jpg";
import { useAdminMode } from "@/hooks/useAdminMode";
import { usePageContent } from "@/hooks/usePageContent";
import EditableText from "@/components/admin/EditableText";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

const Contact = () => {
  const { isEditMode } = useAdminMode();
  const { getText, saveText } = usePageContent("contact");

  const E = ({ section, fallback, as, className, multiline }: { section: string; fallback: string; as?: "h1"|"h2"|"h3"|"p"|"span"|"div"; className?: string; multiline?: boolean }) => {
    const val = getText(section, fallback);
    if (!isEditMode) {
      const Tag = as || "span";
      return <Tag className={className}>{val}</Tag>;
    }
    return <EditableText value={val} onSave={(v) => saveText(section, v)} as={as} className={className} multiline={multiline} />;
  };

  return (
    <Layout>
      <PageHero
        label="נשמח לשמוע"
        title="צור קשר"
        subtitle="נשמח לשמוע מכם ולענות על כל שאלה"
        page="contact"
        labelSection="hero-label"
        titleSection="hero-title"
        subtitleSection="hero-subtitle"
      />

      <section className="py-24 md:py-36">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 max-w-5xl mx-auto">
            {/* Contact info */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.div variants={fadeUp}>
                <E section="info-label" fallback="פרטים" as="span" className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block" />
              </motion.div>
              <motion.div variants={fadeUp}>
                <E section="info-title" fallback="פרטי התקשרות" as="h2" className="font-heading text-2xl font-bold mb-8" />
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-col gap-5 mb-10">
                <a href="tel:0542131254" className="flex items-center gap-4 text-foreground/70 hover:text-primary transition-colors">
                  <div className="w-11 h-11 rounded-full bg-accent flex items-center justify-center"><Phone className="h-5 w-5 text-primary" /></div>
                  054-213-1254
                </a>
                <a href="https://wa.me/972542131254" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-foreground/70 hover:text-primary transition-colors">
                  <div className="w-11 h-11 rounded-full bg-accent flex items-center justify-center"><MessageCircle className="h-5 w-5 text-primary" /></div>
                  וואטסאפ
                </a>
                <a href="mailto:shira.pelleg@gmail.com" className="flex items-center gap-4 text-foreground/70 hover:text-primary transition-colors">
                  <div className="w-11 h-11 rounded-full bg-accent flex items-center justify-center"><Mail className="h-5 w-5 text-primary" /></div>
                  shira.pelleg@gmail.com
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-foreground/70 hover:text-primary transition-colors">
                  <div className="w-11 h-11 rounded-full bg-accent flex items-center justify-center"><Instagram className="h-5 w-5 text-primary" /></div>
                  @yogabamoshava
                </a>
                <div className="flex items-center gap-4 text-foreground/70">
                  <div className="w-11 h-11 rounded-full bg-accent flex items-center justify-center"><MapPin className="h-5 w-5 text-primary" /></div>
                  כיכר המושבה, הוד השרון
                </div>
              </motion.div>

              <motion.div variants={fadeUp} className="rounded-2xl overflow-hidden shadow-md border border-border/30 aspect-video">
                <img src={studioInterior} alt="הסטודיו שלנו" className="w-full h-full object-cover" />
              </motion.div>
            </motion.div>

            {/* Form */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.div variants={fadeUp}>
                <E section="form-label" fallback="טופס" as="span" className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block" />
              </motion.div>
              <motion.div variants={fadeUp}>
                <E section="form-title" fallback="השאירו פרטים" as="h2" className="font-heading text-2xl font-bold mb-8" />
              </motion.div>

              <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
                <motion.div variants={fadeUp}><Input placeholder="שם מלא" className="bg-accent/30 border-0 rounded-xl h-12" /></motion.div>
                <motion.div variants={fadeUp}><Input type="email" placeholder="אימייל" className="bg-accent/30 border-0 rounded-xl h-12" /></motion.div>
                <motion.div variants={fadeUp}><Input type="tel" placeholder="טלפון" className="bg-accent/30 border-0 rounded-xl h-12" /></motion.div>
                <motion.div variants={fadeUp}><Textarea placeholder="הודעה" rows={5} className="bg-accent/30 border-0 rounded-xl" /></motion.div>
                <motion.div variants={fadeUp}>
                  <Button type="submit" className="w-full gap-2 rounded-full h-12 text-base shadow-lg shadow-primary/20">
                    <Send className="h-4 w-4" />שלחו הודעה
                  </Button>
                </motion.div>
              </form>

              <motion.div variants={fadeUp} className="mt-5">
                <Button variant="outline" asChild className="w-full gap-2 rounded-full h-12">
                  <a href="https://wa.me/972542131254" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4" />שלחו הודעה בוואטסאפ
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
