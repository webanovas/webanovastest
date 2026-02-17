import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Clock, User, Plus, Trash2, Check, Pencil, CalendarDays, BookOpen, Repeat, CalendarIcon, ImageIcon } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAdminMode } from "@/hooks/useAdminMode";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Tables } from "@/integrations/supabase/types";
import { Link } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import teacherImg from "@/assets/teacher-placeholder.jpg";
import { ClockPicker } from "@/components/ui/clock-picker";
import ImageUpload from "@/components/admin/ImageUpload";
import { usePageContent } from "@/hooks/usePageContent";
import EditableText from "@/components/admin/EditableText";

type ClassRow = Tables<"classes">;
type TeacherRow = Tables<"teachers">;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי"];

const Schedule = () => {
  const { isEditMode } = useAdminMode();
  const queryClient = useQueryClient();
  const { getText, saveText } = usePageContent("schedule");

  const ScheduleE = ({ section, fallback, as, className, multiline }: { section: string; fallback: string; as?: "h1"|"h2"|"h3"|"h4"|"p"|"span"|"div"; className?: string; multiline?: boolean }) => {
    const val = getText(section, fallback);
    if (!isEditMode) {
      const Tag = as || "span";
      return <Tag className={className}>{val}</Tag>;
    }
    return <EditableText value={val} onSave={(v) => saveText(section, v)} as={as} className={className} multiline={multiline} />;
  };
  const [selectedDay, setSelectedDay] = useState(days[0]);
  const [editingClass, setEditingClass] = useState<ClassRow | null>(null);
  const [isAddingClass, setIsAddingClass] = useState(false);
  const [newClass, setNewClass] = useState({ day: "ראשון", time: "", name: "", teacher: "", description: "", is_recurring: true, specific_date: null as string | null });

  const { data: classes = [] } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const { data } = await supabase.from("classes").select("*").order("sort_order");
      return data ?? [];
    },
  });

  const { data: teachers = [] } = useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      const { data } = await supabase.from("teachers").select("*").order("sort_order");
      return data ?? [];
    },
  });

  const [editingTeacher, setEditingTeacher] = useState<TeacherRow | null>(null);
  const [isAddingTeacher, setIsAddingTeacher] = useState(false);
  const [newTeacher, setNewTeacher] = useState({ name: "", role: "", description: "" });

  const dayClasses = classes.filter((c) => c.day === selectedDay).sort((a, b) => a.time.localeCompare(b.time));

  const saveClass = async (cls: ClassRow) => {
    const { error } = await supabase.from("classes").update({
      day: cls.day, time: cls.time, name: cls.name, teacher: cls.teacher, description: cls.description,
      is_recurring: cls.is_recurring, specific_date: cls.specific_date,
    }).eq("id", cls.id);
    if (error) { console.error("Save error:", error); toast.error("שגיאה בשמירה: " + error.message); }
    else { toast.success("נשמר"); queryClient.invalidateQueries({ queryKey: ["classes"] }); }
    setEditingClass(null);
  };

  const addClass = async () => {
    if (!newClass.name || !newClass.time) { toast.error("שם ושעה חובה"); return; }
    const { error } = await supabase.from("classes").insert({
      day: newClass.day, time: newClass.time, name: newClass.name,
      teacher: newClass.teacher, description: newClass.description,
      is_recurring: newClass.is_recurring, specific_date: newClass.specific_date,
    });
    if (error) { console.error("Add error:", error); toast.error("שגיאה: " + error.message); }
    else {
      toast.success("נוסף");
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      setNewClass({ day: "ראשון", time: "", name: "", teacher: "", description: "", is_recurring: true, specific_date: null });
      setIsAddingClass(false);
    }
  };

  const deleteClass = async (id: string) => {
    const { error } = await supabase.from("classes").delete().eq("id", id);
    if (error) { console.error("Delete error:", error); toast.error("שגיאה במחיקה: " + error.message); }
    else { toast.success("נמחק"); queryClient.invalidateQueries({ queryKey: ["classes"] }); }
    setEditingClass(null);
  };

  const saveTeacher = async (t: TeacherRow) => {
    const { error } = await supabase.from("teachers").update({
      name: t.name, role: t.role, description: t.description, image_url: t.image_url,
    }).eq("id", t.id);
    if (error) { console.error("Save error:", error); toast.error("שגיאה: " + error.message); }
    else { toast.success("נשמר"); queryClient.invalidateQueries({ queryKey: ["teachers"] }); }
    setEditingTeacher(null);
  };

  const addTeacher = async () => {
    if (!newTeacher.name) { toast.error("שם חובה"); return; }
    const { error } = await supabase.from("teachers").insert(newTeacher);
    if (error) { console.error("Add error:", error); toast.error("שגיאה: " + error.message); }
    else {
      toast.success("נוסף");
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      setNewTeacher({ name: "", role: "", description: "" });
      setIsAddingTeacher(false);
    }
  };

  const deleteTeacher = async (id: string) => {
    const { error } = await supabase.from("teachers").delete().eq("id", id);
    if (error) toast.error("שגיאה: " + error.message);
    else { toast.success("נמחק"); queryClient.invalidateQueries({ queryKey: ["teachers"] }); }
    setEditingTeacher(null);
  };

  return (
    <Layout>
      <PageHero
        label="לוח שיעורים"
        title="מערכת שעות ומורים"
        subtitle="הצטרפו לשיעור שמתאים לכם – בסטודיו או בזום"
        page="schedule"
        labelSection="hero-label"
        titleSection="hero-title"
        subtitleSection="hero-subtitle"
      />

      {/* Boostapp Registration CTA */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground mb-4 text-sm md:text-base">להרשמה ולצפייה בלוח השעות המלא</p>
            <Button asChild size="lg" className="rounded-full text-base px-8 shadow-lg shadow-primary/20">
              <a href="https://1pa.co/dXjqxqYBbb" target="_blank" rel="noopener noreferrer">
                להרשמה לשיעור
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Schedule with Day Tabs */}
      <section className="py-12 md:py-36">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <ScheduleE section="schedule-label" fallback="שבועי" as="span" className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block" />
            <ScheduleE section="schedule-title" fallback="לוח שיעורים" as="h2" className="font-heading text-3xl md:text-4xl font-bold" />
          </div>

          {/* Day Tabs */}
          <div className="flex justify-center mb-8 md:mb-12 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
            <div className="inline-flex items-center bg-muted/50 rounded-2xl p-1.5 gap-1 min-w-max">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    "relative px-4 md:px-6 py-2.5 rounded-xl text-sm font-heading font-medium transition-all duration-300",
                    selectedDay === day
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {selectedDay === day && (
                    <motion.div
                      layoutId="activeDay"
                      className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/20"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">יום {day}</span>
                </button>
              ))}
            </div>
          </div>

          {isEditMode && (
            <div className="text-center mb-8">
              <Button
                size="sm"
                onClick={() => { setNewClass({ ...newClass, day: selectedDay }); setIsAddingClass(true); }}
                className="rounded-full gap-2"
              >
                <Plus className="h-4 w-4" />הוסף שיעור
              </Button>
            </div>
          )}

          {/* Class Cards */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDay}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10 }}
              variants={stagger}
              className="max-w-3xl mx-auto space-y-4"
            >
              {dayClasses.length === 0 ? (
                <motion.p variants={fadeUp} className="text-center text-muted-foreground py-12">
                  אין שיעורים ביום {selectedDay}
                </motion.p>
              ) : (
                dayClasses.map((cls) => (
                  <motion.div key={cls.id} variants={fadeUp}>
                    <Card
                      className={cn(
                        "rounded-2xl border-0 shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5",
                        isEditMode && "cursor-pointer ring-2 ring-transparent hover:ring-primary/30 group relative"
                      )}
                      onClick={() => isEditMode && setEditingClass({ ...cls })}
                    >
                      {isEditMode && (
                        <div className="absolute top-4 left-4 z-10 bg-card/90 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Pencil className="h-3.5 w-3.5 text-primary" />
                        </div>
                      )}
                      <CardContent className="p-0">
                        <div className="flex items-stretch" dir="rtl">
                          <div className="flex flex-col items-center justify-center px-4 md:px-6 py-4 md:py-5 bg-primary/8 border-l border-primary/10 min-w-[80px] md:min-w-[100px]">
                            <Clock className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary mb-1" />
                            <span className="font-heading font-bold text-base md:text-lg text-primary">{cls.time}</span>
                          </div>
                          <div className="flex-1 p-3.5 md:p-5 flex items-center justify-between gap-3 md:gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-heading font-semibold text-base">{cls.name}</h3>
                                {!cls.is_recurring && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-medium">חד פעמי</span>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                <User className="h-3.5 w-3.5" />{cls.teacher}
                              </p>
                              {cls.description && (
                                <p className="text-xs text-muted-foreground/70 mt-1.5 line-clamp-1">{cls.description}</p>
                              )}
                            </div>
                            {!isEditMode && (
                              <Button asChild size="sm" className="rounded-full shadow-sm shadow-primary/20 shrink-0">
                                <a href="https://1pa.co/dXjqxqYBbb" target="_blank" rel="noopener noreferrer">הרשמה</a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Teachers */}
      <section className="py-14 md:py-36 bg-yoga-cream relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <ScheduleE section="teachers-label" fallback="הצוות" as="span" className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block" />
            <ScheduleE section="teachers-title" fallback="המורים שלנו" as="h2" className="font-heading text-3xl md:text-4xl font-bold" />
            {isEditMode && (
              <Button size="sm" onClick={() => setIsAddingTeacher(true)} className="mt-4 rounded-full gap-2">
                <Plus className="h-4 w-4" />הוסף מורה
              </Button>
            )}
          </div>

          {teachers.length === 0 && !isEditMode ? (
            <p className="text-center text-muted-foreground">המורים יעודכנו בקרוב</p>
          ) : (
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {teachers.map((t) => (
                <motion.div key={t.id} variants={fadeUp}>
                  <Card
                    className={cn(
                      "text-center h-full rounded-3xl border-0 overflow-hidden hover-lift shadow-lg",
                      isEditMode && "cursor-pointer ring-2 ring-transparent hover:ring-primary/30"
                    )}
                    onClick={() => isEditMode && setEditingTeacher({ ...t })}
                  >
                    <div className="aspect-[3/4] overflow-hidden relative">
                      <img src={t.image_url || teacherImg} alt={t.name} className="w-full h-full object-cover" />
                      {isEditMode && (
                        <div className="absolute top-3 left-3 bg-card/90 backdrop-blur-sm rounded-full p-1.5">
                          <Pencil className="h-3.5 w-3.5 text-primary" />
                        </div>
                      )}
                    </div>
                    <CardContent className="pt-6 pb-8 flex flex-col items-center gap-2">
                      <h3 className="font-heading font-semibold text-lg">{t.name}</h3>
                      <p className="text-primary text-sm font-medium">{t.role}</p>
                      <p className="text-muted-foreground text-sm">{t.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Class Edit */}
      <Dialog open={!!editingClass} onOpenChange={(open) => !open && setEditingClass(null)}>
        <DialogContent className="max-w-md p-0 overflow-hidden" dir="rtl">
          {editingClass && (
            <ClassEditPreview
              value={editingClass}
              onChange={setEditingClass}
              onSave={() => saveClass(editingClass)}
              onDelete={() => deleteClass(editingClass.id)}
              onCancel={() => setEditingClass(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Class Add */}
      <Dialog open={isAddingClass} onOpenChange={setIsAddingClass}>
        <DialogContent className="max-w-md p-0 overflow-hidden" dir="rtl">
          <ClassEditPreview
            value={newClass as any}
            onChange={setNewClass as any}
            onSave={addClass}
            onCancel={() => setIsAddingClass(false)}
            isNew
          />
        </DialogContent>
      </Dialog>

      {/* Teacher Edit */}
      <Dialog open={!!editingTeacher} onOpenChange={(open) => !open && setEditingTeacher(null)}>
        <DialogContent className="max-w-md p-0 overflow-hidden" dir="rtl">
          {editingTeacher && (
            <TeacherEditPreview
              value={editingTeacher}
              onChange={setEditingTeacher}
              onSave={() => saveTeacher(editingTeacher)}
              onDelete={() => deleteTeacher(editingTeacher.id)}
              onCancel={() => setEditingTeacher(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Teacher Add */}
      <Dialog open={isAddingTeacher} onOpenChange={setIsAddingTeacher}>
        <DialogContent className="max-w-md p-0 overflow-hidden" dir="rtl">
          <TeacherEditPreview
            value={newTeacher as any}
            onChange={setNewTeacher as any}
            onSave={addTeacher}
            onCancel={() => setIsAddingTeacher(false)}
            isNew
          />
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

/* ──── Section Group for forms ──── */
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

/* ──── Alarm-style Recurring/One-time Toggle ──── */
function RecurringToggle({ value, onChange }: { value: any; onChange: (v: any) => void }) {
  const isRecurring = value.is_recurring !== false;
  const [dateOpen, setDateOpen] = useState(false);
  const parsedDate = value.specific_date ? parseDateStr(value.specific_date) : undefined;

  return (
    <FormSection icon={Repeat} title="תדירות">
      {/* Toggle pills */}
      <div className="flex gap-2">
        <button
          onClick={() => onChange({ ...value, is_recurring: true, specific_date: null })}
          className={cn(
            "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border",
            isRecurring
              ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
              : "bg-card text-muted-foreground border-border/50 hover:border-primary/30"
          )}
        >
          <Repeat className="h-3.5 w-3.5 inline ml-1.5" />
          שבועי קבוע
        </button>
        <button
          onClick={() => onChange({ ...value, is_recurring: false, day: value.day })}
          className={cn(
            "flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border",
            !isRecurring
              ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
              : "bg-card text-muted-foreground border-border/50 hover:border-primary/30"
          )}
        >
          <CalendarIcon className="h-3.5 w-3.5 inline ml-1.5" />
          חד פעמי
        </button>
      </div>

      {/* Day selector - always shown */}
      <div>
        <p className="text-[11px] text-muted-foreground mb-2">{isRecurring ? "חוזר בכל שבוע ביום:" : "יום בשבוע:"}</p>
        <div className="flex gap-1.5">
          {days.map((d) => (
            <button
              key={d}
              onClick={() => onChange({ ...value, day: d })}
              className={cn(
                "flex-1 py-2 rounded-xl text-xs font-medium transition-all duration-200",
                value.day === d
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "bg-card hover:bg-accent text-foreground border border-border/40"
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Date picker - only for one-time */}
      <AnimatePresence mode="wait">
        {!isRecurring && (
          <motion.div
            key="onetime-date"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-[11px] text-muted-foreground mb-2">תאריך ספציפי:</p>
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-right font-normal rounded-xl h-11 border-border/50",
                    !value.specific_date && "text-muted-foreground"
                  )}
                >
                  <CalendarDays className="h-4 w-4 ml-2 text-primary" />
                  {value.specific_date || "בחר תאריך"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={parsedDate}
                  onSelect={(date) => {
                    if (date) {
                      const formatted = format(date, "dd.MM.yyyy");
                      onChange({ ...value, specific_date: formatted });
                    }
                    setDateOpen(false);
                  }}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </motion.div>
        )}
      </AnimatePresence>
    </FormSection>
  );
}

function parseDateStr(str: string): Date | undefined {
  const parts = str?.split(".");
  if (parts?.length === 3) {
    const d = parseInt(parts[0]), m = parseInt(parts[1]) - 1, y = parseInt(parts[2]);
    if (!isNaN(d) && !isNaN(m) && !isNaN(y)) return new Date(y, m, d);
  }
  return undefined;
}

/* WYSIWYG Class Editor */
function ClassEditPreview({ value, onChange, onSave, onDelete, onCancel, isNew = false }: {
  value: any; onChange: (v: any) => void; onSave: () => void;
  onDelete?: () => void; onCancel: () => void; isNew?: boolean;
}) {
  return (
     <div className="bg-card max-h-[85vh] overflow-y-auto">
       {/* Live preview header */}
       <div className="bg-gradient-to-b from-primary/8 to-primary/3 px-5 py-4 border-b border-border/30">
        <p className="text-[11px] text-primary font-medium mb-2.5 tracking-wider uppercase">תצוגה מקדימה</p>
        <div className="bg-card rounded-xl shadow-md overflow-hidden border border-border/20">
          <div className="flex items-stretch" dir="rtl">
            <div className="flex flex-col items-center justify-center px-4 py-3 bg-primary/8 border-l border-primary/10 min-w-[80px]">
              <Clock className="h-3 w-3 text-primary mb-1" />
              <span className="font-heading font-bold text-sm text-primary">{value.time || "--:--"}</span>
            </div>
            <div className="flex-1 p-3">
              <div className="flex items-center gap-1.5">
                <h3 className="font-heading font-semibold text-sm">{value.name || "שם השיעור"}</h3>
                {value.is_recurring === false && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-accent text-accent-foreground font-medium">חד פעמי</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <User className="h-3 w-3" />{value.teacher || "מורה"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Recurring toggle */}
        <RecurringToggle value={value} onChange={onChange} />

        {/* Time */}
        <FormSection icon={Clock} title="שעה">
          <TimePickerField
            value={value.time}
            onChange={(t) => onChange({ ...value, time: t })}
          />
        </FormSection>

        {/* Details */}
        <FormSection icon={BookOpen} title="פרטי השיעור">
          <Input
            value={value.name}
            onChange={(e) => onChange({ ...value, name: e.target.value })}
            placeholder="שם השיעור"
            className="rounded-xl border-0 bg-card h-11 shadow-sm"
          />
          <Input
            value={value.teacher}
            onChange={(e) => onChange({ ...value, teacher: e.target.value })}
            placeholder="שם המורה"
            className="rounded-xl border-0 bg-card h-11 shadow-sm"
          />
          <Textarea
            value={value.description || ""}
            onChange={(e) => onChange({ ...value, description: e.target.value })}
            placeholder="תיאור (אופציונלי)"
            className="rounded-xl border-0 bg-card resize-none shadow-sm"
            rows={2}
          />
        </FormSection>

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

/* Time picker (Clock Face) */
function TimePickerField({ value, onChange }: { value: string; onChange: (t: string) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-center font-mono text-sm rounded-xl h-11 border-0 bg-card shadow-sm",
            !value && "text-muted-foreground"
          )}
        >
          <Clock className="h-4 w-4 ml-2 text-primary" />
          {value || "בחר שעה"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="center">
        <ClockPicker value={value} onChange={onChange} onDone={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}

/* WYSIWYG Teacher Editor */
function TeacherEditPreview({ value, onChange, onSave, onDelete, onCancel, isNew = false }: {
  value: any; onChange: (v: any) => void; onSave: () => void;
  onDelete?: () => void; onCancel: () => void; isNew?: boolean;
}) {
  return (
    <div className="bg-card">
      {/* Image preview with upload */}
      <div className="aspect-[4/3] overflow-hidden relative">
        <img src={value.image_url || teacherImg} alt="preview" className="w-full h-full object-cover" />
        <ImageUpload
          currentUrl={value.image_url}
          onUpload={(url) => onChange({ ...value, image_url: url })}
          folder="teachers"
          className="bottom-20 left-4"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        <div className="absolute bottom-4 right-4 left-4 space-y-2">
          <Input
            value={value.name}
            onChange={(e) => onChange({ ...value, name: e.target.value })}
            placeholder="שם המורה"
            className="bg-card/90 backdrop-blur-sm border-0 rounded-xl font-heading font-semibold text-lg h-12 shadow-lg"
          />
          <Input
            value={value.role}
            onChange={(e) => onChange({ ...value, role: e.target.value })}
            placeholder="תפקיד / התמחות"
            className="bg-card/90 backdrop-blur-sm border-0 rounded-xl text-sm h-10 shadow-lg"
          />
        </div>
      </div>

      <div className="p-5 space-y-4">
        <FormSection icon={User} title="אודות">
          <Textarea
            value={value.description || ""}
            onChange={(e) => onChange({ ...value, description: e.target.value })}
            placeholder="קצת על המורה..."
            className="rounded-xl border-0 bg-card resize-none shadow-sm"
            rows={3}
          />
        </FormSection>

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

export default Schedule;
