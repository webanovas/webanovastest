import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, MapPin, Plus, Pencil, Check, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import ImagePlaceholder from "@/components/ImagePlaceholder";
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

type WorkshopRow = Tables<"workshops">;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const Workshops = () => {
  const { isEditMode } = useAdminMode();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<WorkshopRow | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ title: "", date: "", time: "", location: "", description: "", is_active: true });

  const { data: workshops = [] } = useQuery({
    queryKey: ["workshops"],
    queryFn: async () => {
      const { data } = await supabase.from("workshops").select("*").order("sort_order");
      return data ?? [];
    },
  });

  const activeWorkshops = workshops.filter((w) => w.is_active);
  const pastWorkshops = workshops.filter((w) => !w.is_active);

  const save = async (w: WorkshopRow) => {
    const { error } = await supabase.from("workshops").update({
      title: w.title, date: w.date, time: w.time, location: w.location,
      description: w.description, is_active: w.is_active,
    }).eq("id", w.id);
    if (error) toast.error("שגיאה"); else { toast.success("נשמר"); queryClient.invalidateQueries({ queryKey: ["workshops"] }); }
    setEditing(null);
  };

  const add = async () => {
    if (!newItem.title) { toast.error("שם חובה"); return; }
    const { error } = await supabase.from("workshops").insert({
      title: newItem.title, date: newItem.date, description: newItem.description,
      time: newItem.time || null, location: newItem.location || null, is_active: newItem.is_active,
    });
    if (error) toast.error("שגיאה"); else {
      toast.success("נוסף"); queryClient.invalidateQueries({ queryKey: ["workshops"] });
      setNewItem({ title: "", date: "", time: "", location: "", description: "", is_active: true }); setIsAdding(false);
    }
  };

  const remove = async (id: string) => {
    await supabase.from("workshops").delete().eq("id", id);
    toast.success("נמחק"); queryClient.invalidateQueries({ queryKey: ["workshops"] });
    setEditing(null);
  };

  const WorkshopForm = ({ value, onChange, onSave, onDelete, onCancel, isNew = false }: {
    value: any; onChange: (v: any) => void; onSave: () => void;
    onDelete?: () => void; onCancel: () => void; isNew?: boolean;
  }) => (
    <div className="space-y-3">
      <Input value={value.title} onChange={(e) => onChange({ ...value, title: e.target.value })} placeholder="שם הסדנה" className="rounded-lg" />
      <Input value={value.date} onChange={(e) => onChange({ ...value, date: e.target.value })} placeholder="תאריך" className="rounded-lg" />
      <Input type="time" value={value.time || ""} onChange={(e) => onChange({ ...value, time: e.target.value })} placeholder="שעה" className="rounded-lg" />
      <Input value={value.location || ""} onChange={(e) => onChange({ ...value, location: e.target.value })} placeholder="מיקום" className="rounded-lg" />
      <Textarea value={value.description} onChange={(e) => onChange({ ...value, description: e.target.value })} placeholder="תיאור" className="rounded-lg" rows={3} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={value.is_active} onChange={(e) => onChange({ ...value, is_active: e.target.checked })} className="rounded" />
        פעיל (מוצג באתר)
      </label>
      <div className="flex gap-2 justify-between pt-2">
        {onDelete && (
          <Button variant="ghost" size="sm" onClick={onDelete} className="text-destructive gap-1 rounded-full"><Trash2 className="h-3.5 w-3.5" />מחק</Button>
        )}
        <div className="flex gap-2 mr-auto">
          <Button variant="outline" size="sm" onClick={onCancel} className="rounded-full">ביטול</Button>
          <Button size="sm" onClick={onSave} className="rounded-full gap-1"><Check className="h-3.5 w-3.5" />{isNew ? "הוסף" : "שמור"}</Button>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <PageHero label="אירועים" title="סדנאות" subtitle="סדנאות מיוחדות להעמקת התרגול והחוויה" />

      {/* Active */}
      <section className="py-24 md:py-36">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block">קרוב</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold">סדנאות קרובות</h2>
            {isEditMode && (
              <Button size="sm" onClick={() => setIsAdding(true)} className="mt-4 rounded-full gap-2">
                <Plus className="h-4 w-4" />הוסף סדנה
              </Button>
            )}
          </div>

          {activeWorkshops.length === 0 && !isEditMode ? (
            <p className="text-center text-muted-foreground">אין סדנאות קרובות כרגע – עקבו אחרינו לעדכונים</p>
          ) : (
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {activeWorkshops.map((w) => (
                <motion.div key={w.id} variants={fadeUp}>
                  <Card
                    className={cn(
                      "h-full rounded-3xl border-0 overflow-hidden hover-lift shadow-lg",
                      isEditMode && "cursor-pointer ring-2 ring-transparent hover:ring-primary/30 relative"
                    )}
                    onClick={() => isEditMode && setEditing({ ...w })}
                  >
                    {isEditMode && (
                      <div className="absolute top-4 left-4 z-10 bg-card/90 backdrop-blur-sm rounded-full p-1.5">
                        <Pencil className="h-3.5 w-3.5 text-primary" />
                      </div>
                    )}
                    <div className="aspect-video overflow-hidden"><ImagePlaceholder label="תמונת סדנה" /></div>
                    <CardContent className="pt-6">
                      <h3 className="font-heading font-semibold text-xl mb-3">{w.title}</h3>
                      <p className="text-sm text-muted-foreground mb-5">{w.description}</p>
                      <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-6">
                        <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />{w.date}</span>
                        {w.time && <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" />{w.time}</span>}
                        {w.location && <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{w.location}</span>}
                      </div>
                      <Button asChild className="w-full rounded-full h-11 shadow-lg shadow-primary/20">
                        <Link to="/contact">הרשמה / פרטים</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Archive */}
      {pastWorkshops.length > 0 && (
        <section className="py-24 md:py-36 bg-yoga-cream relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block">ארכיון</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold">סדנאות שהיו</h2>
            </div>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              {pastWorkshops.map((w) => (
                <Card
                  key={w.id}
                  className={cn(
                    "rounded-3xl border-0 overflow-hidden shadow-md",
                    isEditMode && "cursor-pointer hover:ring-2 hover:ring-primary/30"
                  )}
                  onClick={() => isEditMode && setEditing({ ...w })}
                >
                  <div className="aspect-video overflow-hidden"><ImagePlaceholder label="תמונת סדנה" /></div>
                  <CardContent className="p-5">
                    <span className="font-heading font-medium text-sm">{w.title}</span>
                    <span className="text-xs text-muted-foreground block mt-1">{w.date}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader><DialogTitle className="font-heading">עריכת סדנה</DialogTitle></DialogHeader>
          {editing && <WorkshopForm value={editing} onChange={setEditing} onSave={() => save(editing)} onDelete={() => remove(editing.id)} onCancel={() => setEditing(null)} />}
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={isAdding} onOpenChange={setIsAdding}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader><DialogTitle className="font-heading">הוספת סדנה</DialogTitle></DialogHeader>
          <WorkshopForm value={newItem} onChange={setNewItem} onSave={add} onCancel={() => setIsAdding(false)} isNew />
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Workshops;
