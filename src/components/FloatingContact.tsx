import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Phone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const FloatingContact = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast.error("נא למלא שם וטלפון");
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("ההודעה נשלחה בהצלחה!");
    setForm({ name: "", phone: "", message: "" });
    setSending(false);
    setIsOpen(false);
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-[2px]"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
            className="fixed bottom-24 left-4 sm:left-6 z-[70] w-[calc(100%-2rem)] sm:w-[340px] rounded-2xl shadow-2xl overflow-hidden"
            style={{
              background: "linear-gradient(180deg, hsl(var(--card)) 0%, hsl(var(--background)) 100%)",
              border: "1px solid hsl(var(--border) / 0.3)",
            }}
          >
            {/* Header */}
            <div className="px-6 pt-5 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-sm text-foreground">
                    דברו איתנו
                  </h3>
                  <p className="text-[11px] text-muted-foreground">נחזור אליכם בהקדם</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Divider */}
            <div className="mx-5 h-px bg-border/40" />

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 pt-4 flex flex-col gap-2.5">
              <Input
                placeholder="שם מלא"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-muted/40 border-0 rounded-xl h-10 text-sm placeholder:text-muted-foreground/60 focus-visible:ring-primary/30"
              />
              <Input
                type="tel"
                placeholder="טלפון"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="bg-muted/40 border-0 rounded-xl h-10 text-sm placeholder:text-muted-foreground/60 focus-visible:ring-primary/30"
              />
              <Textarea
                placeholder="הודעה (אופציונלי)"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={2}
                className="bg-muted/40 border-0 rounded-xl text-sm resize-none placeholder:text-muted-foreground/60 focus-visible:ring-primary/30"
              />
              <Button
                type="submit"
                disabled={sending}
                className="w-full gap-2 rounded-xl h-10 text-sm mt-1 shadow-sm"
              >
                <Send className="h-3.5 w-3.5" />
                {sending ? "שולח..." : "שליחה"}
              </Button>
              <a
                href="https://wa.me/972542131254"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors py-1.5"
              >
                <Phone className="h-3 w-3" />
                או דברו איתנו בוואטסאפ
              </a>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB as pill button with persistent label */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-4 sm:left-6 z-[70] flex items-center gap-2 bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 transition-shadow rounded-full px-5 h-12"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        aria-label="צור קשר"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="h-5 w-5" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageCircle className="h-5 w-5" />
            </motion.div>
          )}
        </AnimatePresence>
        <span className="text-sm font-medium">{isOpen ? "סגירה" : "דברו איתנו"}</span>
      </motion.button>
    </>
  );
};

export default FloatingContact;
