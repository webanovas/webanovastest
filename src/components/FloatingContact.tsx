import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Phone } from "lucide-react";
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
    // Simulate send (no edge function exists yet)
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
            className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 left-4 sm:left-6 z-[70] w-[calc(100%-2rem)] sm:w-80 bg-card rounded-2xl shadow-2xl border border-border/40 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary px-5 py-4 flex items-center justify-between">
              <h3 className="text-primary-foreground font-heading font-semibold text-base">
                צרו קשר
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-3">
              <Input
                placeholder="שם מלא"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="bg-accent/30 border-0 rounded-xl h-11 text-sm"
              />
              <Input
                type="tel"
                placeholder="טלפון"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="bg-accent/30 border-0 rounded-xl h-11 text-sm"
              />
              <Textarea
                placeholder="הודעה (אופציונלי)"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={3}
                className="bg-accent/30 border-0 rounded-xl text-sm resize-none"
              />
              <Button
                type="submit"
                disabled={sending}
                className="w-full gap-2 rounded-full h-11 text-sm shadow-md shadow-primary/20"
              >
                <Send className="h-4 w-4" />
                {sending ? "שולח..." : "שליחה"}
              </Button>
              <Button
                type="button"
                variant="outline"
                asChild
                className="w-full gap-2 rounded-full h-11 text-sm"
              >
                <a
                  href="https://wa.me/972542131254"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Phone className="h-4 w-4" />
                  וואטסאפ ישיר
                </a>
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 left-4 sm:left-6 z-[70] w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 flex items-center justify-center hover:shadow-xl hover:shadow-primary/40 transition-shadow"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="צור קשר"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <MessageCircle className="h-6 w-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
};

export default FloatingContact;
