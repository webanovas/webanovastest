import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon, Clock, MapPin, Plus, Pencil, Check, Trash2, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAdminMode } from "@/hooks/useAdminMode";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Tables } from "@/integrations/supabase/types";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import workshopImg1 from "@/assets/workshop-1.jpg";
import workshopImg2 from "@/assets/workshop-2.jpg";

type WorkshopRow = Tables<"workshops">;

const workshopImages = [workshopImg1, workshopImg2];

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
              {activeWorkshops.map((w, i) => (
                <motion.div key={w.id} variants={fadeUp}>
                  <WorkshopCard workshop={w} isEditMode={isEditMode} onEdit={() => setEditing({ ...w })} imgSrc={workshopImages[i % workshopImages.length]} />
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
              {pastWorkshops.map((w, i) => (
                <Card
                  key={w.id}
                  className={cn(
                    "rounded-3xl border-0 overflow-hidden shadow-md",
                    isEditMode && "cursor-pointer hover:ring-2 hover:ring-primary/30"
                  )}
                  onClick={() => isEditMode && setEditing({ ...w })}
                >
                  <div className="aspect-video overflow-hidden">
                    <img src={workshopImages[i % workshopImages.length]} alt={w.title} className="w-full h-full object-cover" />
                  </div>
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

      {/* Edit Dialog - WYSIWYG style */}
      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-lg p-0 overflow-hidden" dir="rtl">
          <WorkshopEditPreview
            value={editing!}
            onChange={setEditing}
            onSave={() => editing && save(editing)}
            onDelete={() => editing && remove(editing.id)}
            onCancel={() => setEditing(null)}
          />
        </DialogContent>
      </Dialog>

      {/* Add Dialog - WYSIWYG style */}
      <Dialog open={isAdding} onOpenChange={setIsAdding}>
        <DialogContent className="max-w-lg p-0 overflow-hidden" dir="rtl">
          <WorkshopEditPreview
            value={newItem as any}
            onChange={setNewItem as any}
            onSave={add}
            onCancel={() => setIsAdding(false)}
            isNew
          />
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

/* Workshop Card */
function WorkshopCard({ workshop: w, isEditMode, onEdit, imgSrc }: { workshop: WorkshopRow; isEditMode: boolean; onEdit: () => void; imgSrc: string }) {
  return (
    <Card
      className={cn(
        "h-full rounded-3xl border-0 overflow-hidden hover-lift shadow-lg",
        isEditMode && "cursor-pointer ring-2 ring-transparent hover:ring-primary/30 relative"
      )}
      onClick={() => isEditMode && onEdit()}
    >
      {isEditMode && (
        <div className="absolute top-4 left-4 z-10 bg-card/90 backdrop-blur-sm rounded-full p-1.5">
          <Pencil className="h-3.5 w-3.5 text-primary" />
        </div>
      )}
      <div className="aspect-video overflow-hidden">
        <img src={imgSrc} alt={w.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
      </div>
      <CardContent className="pt-6 pb-6">
        <h3 className="font-heading font-semibold text-xl mb-4">{w.title}</h3>
        <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{w.description}</p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
              <CalendarIcon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">תאריך</span>
              <span className="font-medium">{w.date}</span>
            </div>
          </div>
          {w.time && (
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">שעות</span>
                <span className="font-medium">{w.time}</span>
              </div>
            </div>
          )}
          {w.location && (
            <div className="flex items-center gap-3 text-sm">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">מיקום</span>
                <span className="font-medium">{w.location}</span>
              </div>
            </div>
          )}
        </div>

        <Button asChild className="w-full rounded-full h-11 shadow-lg shadow-primary/20">
          <Link to="/contact">הרשמה / פרטים</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

/* WYSIWYG Workshop Editor - looks like the final card while editing */
function WorkshopEditPreview({ value, onChange, onSave, onDelete, onCancel, isNew = false }: {
  value: any; onChange: (v: any) => void; onSave: () => void;
  onDelete?: () => void; onCancel: () => void; isNew?: boolean;
}) {
  const [dateOpen, setDateOpen] = useState(false);
  if (!value) return null;

  const parsedDate = value.date ? parseHebrewDate(value.date) : undefined;

  return (
    <div className="bg-card rounded-3xl overflow-hidden">
      {/* Image preview */}
      <div className="aspect-video overflow-hidden relative">
        <img src={workshopImg1} alt="preview" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        <div className="absolute bottom-4 right-4 left-4">
          <Input
            value={value.title}
            onChange={(e) => onChange({ ...value, title: e.target.value })}
            placeholder="שם הסדנה"
            className="bg-card/90 backdrop-blur-sm border-0 rounded-xl font-heading font-semibold text-lg h-12 shadow-lg"
          />
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Description */}
        <Textarea
          value={value.description || ""}
          onChange={(e) => onChange({ ...value, description: e.target.value })}
          placeholder="תיאור הסדנה..."
          className="rounded-xl border-dashed border-primary/20 focus:border-primary/40 resize-none bg-transparent"
          rows={3}
        />

        {/* Date picker - Calendly-style */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 shrink-0">
            <CalendarDays className="h-5 w-5 text-primary" />
          </div>
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "flex-1 justify-start text-right font-normal rounded-xl h-11 border-dashed border-primary/20",
                  !value.date && "text-muted-foreground"
                )}
              >
                {value.date || "בחר תאריך"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={parsedDate}
                onSelect={(date) => {
                  if (date) {
                    onChange({ ...value, date: format(date, "dd.MM.yyyy") });
                  }
                  setDateOpen(false);
                }}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time range - slot picker style */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 shrink-0">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 flex items-center gap-2">
            <TimeSlotPicker
              value={getTimeStart(value.time)}
              onChange={(t) => onChange({ ...value, time: `${t}-${getTimeEnd(value.time) || "13:00"}` })}
              placeholder="שעת התחלה"
            />
            <span className="text-muted-foreground font-medium">–</span>
            <TimeSlotPicker
              value={getTimeEnd(value.time)}
              onChange={(t) => onChange({ ...value, time: `${getTimeStart(value.time) || "10:00"}-${t}` })}
              placeholder="שעת סיום"
            />
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 shrink-0">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <Input
            value={value.location || ""}
            onChange={(e) => onChange({ ...value, location: e.target.value })}
            placeholder="מיקום הסדנה"
            className="rounded-xl border-dashed border-primary/20 h-11"
          />
        </div>

        {/* Active toggle */}
        <label className="flex items-center gap-3 text-sm px-1 cursor-pointer">
          <div className={cn(
            "w-10 h-6 rounded-full transition-colors relative cursor-pointer",
            value.is_active ? "bg-primary" : "bg-muted"
          )} onClick={() => onChange({ ...value, is_active: !value.is_active })}>
            <div className={cn(
              "absolute top-0.5 w-5 h-5 rounded-full bg-card shadow transition-transform",
              value.is_active ? "right-0.5" : "left-0.5"
            )} />
          </div>
          <span className="text-muted-foreground">{value.is_active ? "פעיל – מוצג באתר" : "לא פעיל – מוסתר"}</span>
        </label>

        {/* Actions */}
        <div className="flex gap-2 justify-between pt-2 border-t border-border/50">
          {onDelete && (
            <Button variant="ghost" size="sm" onClick={onDelete} className="text-destructive gap-1 rounded-full">
              <Trash2 className="h-3.5 w-3.5" />מחק
            </Button>
          )}
          <div className="flex gap-2 mr-auto">
            <Button variant="outline" size="sm" onClick={onCancel} className="rounded-full">ביטול</Button>
            <Button size="sm" onClick={onSave} className="rounded-full gap-1">
              <Check className="h-3.5 w-3.5" />{isNew ? "הוסף" : "שמור"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Time slot picker with visual chips */
function TimeSlotPicker({ value, onChange, placeholder }: { value: string; onChange: (t: string) => void; placeholder: string }) {
  const [open, setOpen] = useState(false);
  const hours = Array.from({ length: 15 }, (_, i) => {
    const h = i + 6;
    return [`${String(h).padStart(2, "0")}:00`, `${String(h).padStart(2, "0")}:30`];
  }).flat();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "flex-1 justify-center font-mono text-sm rounded-xl h-11 border-dashed border-primary/20",
            !value && "text-muted-foreground"
          )}
        >
          {value || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3 max-h-64 overflow-y-auto" align="center">
        <div className="grid grid-cols-3 gap-1.5">
          {hours.map((h) => (
            <button
              key={h}
              onClick={() => { onChange(h); setOpen(false); }}
              className={cn(
                "px-2 py-2 rounded-lg text-xs font-mono transition-all",
                value === h
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-accent text-foreground"
              )}
            >
              {h}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/* Helpers */
function getTimeStart(time: string | null): string {
  if (!time) return "";
  const parts = time.split("-");
  return parts[0]?.trim() || "";
}

function getTimeEnd(time: string | null): string {
  if (!time) return "";
  const parts = time.split("-");
  return parts[1]?.trim() || "";
}

function parseHebrewDate(dateStr: string): Date | undefined {
  const parts = dateStr.split(".");
  if (parts.length === 3) {
    const d = parseInt(parts[0]), m = parseInt(parts[1]) - 1, y = parseInt(parts[2]);
    if (!isNaN(d) && !isNaN(m) && !isNaN(y)) return new Date(y, m, d);
  }
  return undefined;
}

export default Workshops;
