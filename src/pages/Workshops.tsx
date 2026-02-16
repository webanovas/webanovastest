import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon, Clock, MapPin, Plus, Pencil, Check, Trash2, CalendarDays, BookOpen, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAdminMode } from "@/hooks/useAdminMode";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Tables } from "@/integrations/supabase/types";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { ClockPicker } from "@/components/ui/clock-picker";
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

/* ──── Form Section ──── */
function FormSection({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-3.5 w-3.5 text-primary" />
        </div>
        <span className="text-xs font-heading font-semibold text-foreground/70 uppercase tracking-wider">{title}</span>
      </div>
      <div className="bg-muted/30 rounded-2xl p-4 space-y-3 border border-border/30">
        {children}
      </div>
    </div>
  );
}

/* ──── Time Picker with Clock Face ──── */
function TimeSlotPicker({ value, onChange, placeholder }: { value: string; onChange: (t: string) => void; placeholder: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "flex-1 justify-center font-mono text-sm rounded-xl h-11 border-0 bg-card shadow-sm",
            !value && "text-muted-foreground"
          )}
        >
          {value || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="center">
        <ClockPicker value={value} onChange={onChange} onDone={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}

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
    if (error) { console.error("Save error:", error); toast.error("שגיאה: " + error.message); }
    else { toast.success("נשמר"); queryClient.invalidateQueries({ queryKey: ["workshops"] }); }
    setEditing(null);
  };

  const add = async () => {
    if (!newItem.title) { toast.error("שם חובה"); return; }
    const { error } = await supabase.from("workshops").insert({
      title: newItem.title, date: newItem.date, description: newItem.description,
      time: newItem.time || null, location: newItem.location || null, is_active: newItem.is_active,
    });
    if (error) { console.error("Add error:", error); toast.error("שגיאה: " + error.message); }
    else {
      toast.success("נוסף"); queryClient.invalidateQueries({ queryKey: ["workshops"] });
      setNewItem({ title: "", date: "", time: "", location: "", description: "", is_active: true }); setIsAdding(false);
    }
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("workshops").delete().eq("id", id);
    if (error) toast.error("שגיאה: " + error.message);
    else { toast.success("נמחק"); queryClient.invalidateQueries({ queryKey: ["workshops"] }); }
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

      {/* Edit Dialog */}
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

      {/* Add Dialog */}
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

/* WYSIWYG Workshop Editor */
function WorkshopEditPreview({ value, onChange, onSave, onDelete, onCancel, isNew = false }: {
  value: any; onChange: (v: any) => void; onSave: () => void;
  onDelete?: () => void; onCancel: () => void; isNew?: boolean;
}) {
  const [dateOpen, setDateOpen] = useState(false);
  if (!value) return null;

  const parsedDate = value.date ? parseHebrewDate(value.date) : undefined;

  return (
    <div className="bg-card rounded-3xl overflow-hidden">
      {/* Image preview with title overlay */}
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

      <div className="p-5 space-y-5">
        {/* Description */}
        <FormSection icon={FileText} title="תיאור">
          <Textarea
            value={value.description || ""}
            onChange={(e) => onChange({ ...value, description: e.target.value })}
            placeholder="תיאור הסדנה..."
            className="rounded-xl border-0 bg-card resize-none shadow-sm"
            rows={3}
          />
        </FormSection>

        {/* Date */}
        <FormSection icon={CalendarDays} title="תאריך">
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-right font-normal rounded-xl h-11 border-0 bg-card shadow-sm",
                  !value.date && "text-muted-foreground"
                )}
              >
                <CalendarDays className="h-4 w-4 ml-2 text-primary" />
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
        </FormSection>

        {/* Time range */}
        <FormSection icon={Clock} title="שעות">
          <div className="flex items-center gap-2">
            <TimeSlotPicker
              value={getTimeStart(value.time)}
              onChange={(t) => onChange({ ...value, time: `${t}-${getTimeEnd(value.time) || "13:00"}` })}
              placeholder="התחלה"
            />
            <span className="text-muted-foreground font-medium text-lg">–</span>
            <TimeSlotPicker
              value={getTimeEnd(value.time)}
              onChange={(t) => onChange({ ...value, time: `${getTimeStart(value.time) || "10:00"}-${t}` })}
              placeholder="סיום"
            />
          </div>
        </FormSection>

        {/* Location */}
        <FormSection icon={MapPin} title="מיקום">
          <Input
            value={value.location || ""}
            onChange={(e) => onChange({ ...value, location: e.target.value })}
            placeholder="מיקום הסדנה"
            className="rounded-xl border-0 bg-card h-11 shadow-sm"
          />
        </FormSection>

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
          <span className="text-muted-foreground font-medium text-sm">{value.is_active ? "פעיל – מוצג באתר" : "לא פעיל – מוסתר"}</span>
        </label>

        {/* Actions */}
        <div className="flex gap-2 justify-between pt-3 border-t border-border/30">
          {onDelete && (
            <Button variant="ghost" size="sm" onClick={onDelete} className="text-destructive gap-1.5 rounded-full hover:bg-destructive/10">
              <Trash2 className="h-3.5 w-3.5" />מחק
            </Button>
          )}
          <div className="flex gap-2 mr-auto">
            <Button variant="outline" size="sm" onClick={onCancel} className="rounded-full px-5">ביטול</Button>
            <Button size="sm" onClick={onSave} className="rounded-full gap-1.5 px-5 shadow-md shadow-primary/20">
              <Check className="h-3.5 w-3.5" />{isNew ? "הוסף" : "שמור"}
            </Button>
          </div>
        </div>
      </div>
    </div>
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
