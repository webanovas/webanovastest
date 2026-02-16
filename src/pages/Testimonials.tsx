import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Quote, Plus, Pencil, Check, Trash2 } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAdminMode } from "@/hooks/useAdminMode";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Tables } from "@/integrations/supabase/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type TestimonialRow = Tables<"testimonials">;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const Testimonials = () => {
  const { isEditMode } = useAdminMode();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<TestimonialRow | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", text: "" });

  const { data: testimonials = [] } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data } = await supabase.from("testimonials").select("*").order("sort_order");
      return data ?? [];
    },
  });

  const save = async (t: TestimonialRow) => {
    const { error } = await supabase.from("testimonials").update({ name: t.name, text: t.text }).eq("id", t.id);
    if (error) toast.error("שגיאה"); else { toast.success("נשמר"); queryClient.invalidateQueries({ queryKey: ["testimonials"] }); }
    setEditing(null);
  };

  const add = async () => {
    if (!newItem.name || !newItem.text) { toast.error("שם וטקסט חובה"); return; }
    const { error } = await supabase.from("testimonials").insert(newItem);
    if (error) toast.error("שגיאה"); else {
      toast.success("נוסף"); queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      setNewItem({ name: "", text: "" }); setIsAdding(false);
    }
  };

  const remove = async (id: string) => {
    await supabase.from("testimonials").delete().eq("id", id);
    toast.success("נמחק"); queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    setEditing(null);
  };

  return (
    <Layout>
      <PageHero label="המלצות" title="מילים חמות" subtitle="מה אומרים המתרגלים שלנו" page="testimonials" labelSection="hero-label" titleSection="hero-title" subtitleSection="hero-subtitle" />

      <section className="py-12 md:py-36">
        <div className="container mx-auto px-4">
          {isEditMode && (
            <div className="text-center mb-8">
              <Button size="sm" onClick={() => setIsAdding(true)} className="rounded-full gap-2">
                <Plus className="h-4 w-4" />הוסף המלצה
              </Button>
            </div>
          )}

          {testimonials.length === 0 && !isEditMode ? (
            <p className="text-center text-muted-foreground">מילים חמות יעודכנו בקרוב</p>
          ) : (
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {testimonials.map((t) => (
                <motion.div key={t.id} variants={fadeUp}>
                  <Card
                    className={cn(
                      "h-full rounded-3xl border-0 shadow-md hover-lift bg-card",
                      isEditMode && "cursor-pointer ring-2 ring-transparent hover:ring-primary/30 relative"
                    )}
                    onClick={() => isEditMode && setEditing({ ...t })}
                  >
                    {isEditMode && (
                      <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-full p-1.5">
                        <Pencil className="h-3.5 w-3.5 text-primary" />
                      </div>
                    )}
                    <CardContent className="pt-8 pb-8 px-8">
                      <Quote className="h-8 w-8 text-primary/20 mb-4" />
                      <p className="text-foreground/80 leading-relaxed mb-6">{t.text}</p>
                      <div className="flex items-center gap-3 pt-4 border-t border-border">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-heading font-bold text-primary text-sm">{t.name.charAt(0)}</span>
                        </div>
                        <span className="font-heading font-medium text-sm">{t.name}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Edit Dialog */}
      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader><DialogTitle className="font-heading">עריכת המלצה</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="שם" className="rounded-lg" />
              <Textarea value={editing.text} onChange={(e) => setEditing({ ...editing, text: e.target.value })} placeholder="תוכן" className="rounded-lg" rows={4} />
              <div className="flex gap-2 justify-between pt-2">
                <Button variant="ghost" size="sm" onClick={() => remove(editing.id)} className="text-destructive gap-1 rounded-full"><Trash2 className="h-3.5 w-3.5" />מחק</Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditing(null)} className="rounded-full">ביטול</Button>
                  <Button size="sm" onClick={() => save(editing)} className="rounded-full gap-1"><Check className="h-3.5 w-3.5" />שמור</Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={isAdding} onOpenChange={setIsAdding}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader><DialogTitle className="font-heading">הוספת המלצה</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} placeholder="שם" className="rounded-lg" />
            <Textarea value={newItem.text} onChange={(e) => setNewItem({ ...newItem, text: e.target.value })} placeholder="תוכן ההמלצה" className="rounded-lg" rows={4} />
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => setIsAdding(false)} className="rounded-full">ביטול</Button>
              <Button size="sm" onClick={add} className="rounded-full gap-1"><Check className="h-3.5 w-3.5" />הוסף</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Testimonials;
