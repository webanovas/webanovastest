import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MessageCircle, MapPin, Instagram, Send, Loader2 } from "lucide-react";
import studioInterior from "@/assets/studio-interior.jpg";
import { useAdminMode } from "@/hooks/useAdminMode";
import { usePageContent } from "@/hooks/usePageContent";
import EditableText from "@/components/admin/EditableText";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);

  const E = ({ section, fallback, as, className, multiline }: { section: string; fallback: string; as?: "h1"|"h2"|"h3"|"p"|"span"|"div"; className?: string; multiline?: boolean }) => {
    const val = getText(section, fallback);
    if (!isEditMode) {
      const Tag = as || "span";
      return <Tag className={className}>{val}</Tag>;
    }
    return <EditableText value={val} onSave={(v) => saveText(section, v)} as={as} className={className} multiline={multiline} />;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast.error("נא למלא שם וטלפון");
      return;
    }
    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-contact-email", {
        body: { name: form.name, phone: form.phone, email: form.email, message: form.message },
      });
      if (error) throw error;
      toast.success("ההודעה נשלחה בהצלחה!");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error(err);
      toast.error("שגיאה בשליחה, נסו שוב או פנו בוואטסאפ");
    } finally {
      setSending(false);
    }
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

      <section className="py-12 md:py-36">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 max-w-5xl mx-auto">
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
                  <E section="phone" fallback="054-213-1254" />
                </a>
                <a href="https://wa.me/972542131254" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-foreground/70 hover:text-primary transition-colors">
                  <div className="w-11 h-11 rounded-full bg-accent flex items-center justify-center"><MessageCircle className="h-5 w-5 text-primary" /></div>
                  <E section="whatsapp" fallback="וואטסאפ" />
                </a>
                <a href="mailto:shira.pelleg@gmail.com" className="flex items-center gap-4 text-foreground/70 hover:text-primary transition-colors">
                  <div className="w-11 h-11 rounded-full bg-accent flex items-center justify-center"><Mail className="h-5 w-5 text-primary" /></div>
                  <E section="email" fallback="shira.pelleg@gmail.com" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-foreground/70 hover:text-primary transition-colors">
                  <div className="w-11 h-11 rounded-full bg-accent flex items-center justify-center"><Instagram className="h-5 w-5 text-primary" /></div>
                  <E section="instagram" fallback="@yogabamoshava" />
                </a>
                <div className="flex items-center gap-4 text-foreground/70">
                  <div className="w-11 h-11 rounded-full bg-accent flex items-center justify-center"><MapPin className="h-5 w-5 text-primary" /></div>
                  <E section="address" fallback="כיכר המושבה, הוד השרון" />
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

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <motion.div variants={fadeUp}>
                  <Input placeholder="שם מלא" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-accent/30 border-0 rounded-xl h-12" />
                </motion.div>
                <motion.div variants={fadeUp}>
                  <Input type="email" placeholder="אימייל" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-accent/30 border-0 rounded-xl h-12" />
                </motion.div>
                <motion.div variants={fadeUp}>
                  <Input type="tel" placeholder="טלפון" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-accent/30 border-0 rounded-xl h-12" />
                </motion.div>
                <motion.div variants={fadeUp}>
                  <Textarea placeholder="הודעה" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="bg-accent/30 border-0 rounded-xl" />
                </motion.div>
                <motion.div variants={fadeUp}>
                  <Button type="submit" disabled={sending} className="w-full gap-2 rounded-full h-12 text-base shadow-lg shadow-primary/20">
                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    <E section="send-btn" fallback={sending ? "שולח..." : "שלחו הודעה"} />
                  </Button>
                </motion.div>
              </form>

              <motion.div variants={fadeUp} className="mt-5">
                <Button variant="outline" asChild className="w-full gap-2 rounded-full h-12">
                  <a href="https://wa.me/972542131254" target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4" /><E section="whatsapp-btn" fallback="שלחו הודעה בוואטסאפ" />
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
