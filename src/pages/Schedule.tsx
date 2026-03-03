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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { ClockPicker } from "@/components/ui/clock-picker";
import ImageUpload from "@/components/admin/ImageUpload";
import { usePageContent } from "@/hooks/usePageContent";
import EditableText from "@/components/admin/EditableText";

type ClassRow = Tables<"classes">;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

const Schedule = () => {
  const isMobile = useIsMobile();
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
  const [viewingClass, setViewingClass] = useState<ClassRow | null>(null);
  const [newClass, setNewClass] = useState({ day: "ראשון", time: "", end_time: "" as string | null, name: "", teacher: "", description: "", image_url: null as string | null, is_recurring: true, specific_date: null as string | null });

  const { data: classes = [] } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const { data } = await supabase.from("classes").select("*").order("sort_order");
      return data ?? [];
    },
  });

  const dayClasses = classes.filter((c) => c.day === selectedDay).sort((a, b) => a.time.localeCompare(b.time));

  const saveClass = async (cls: any) => {
    const { error } = await supabase.from("classes").update({
      day: cls.day, time: cls.time, end_time: cls.end_time || null, name: cls.name, teacher: cls.teacher, description: cls.description,
      is_recurring: cls.is_recurring, specific_date: cls.specific_date, image_url: cls.image_url || null,
    }).eq("id", cls.id);
    if (error) { console.error("Save error:", error); toast.error("שגיאה בשמירה: " + error.message); }
    else { toast.success("נשמר"); queryClient.invalidateQueries({ queryKey: ["classes"] }); }
    setEditingClass(null);
  };

  const addClass = async () => {
    if (!newClass.name || !newClass.time) { toast.error("שם ושעה חובה"); return; }
    const { error } = await supabase.from("classes").insert({
      day: newClass.day, time: newClass.time, end_time: newClass.end_time || null, name: newClass.name,
      teacher: newClass.teacher, description: newClass.description, image_url: newClass.image_url || null,
      is_recurring: newClass.is_recurring, specific_date: newClass.specific_date,
    } as any);
    if (error) { console.error("Add error:", error); toast.error("שגיאה: " + error.message); }
    else {
      toast.success("נוסף");
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      setNewClass({ day: "ראשון", time: "", end_time: "", name: "", teacher: "", description: "", image_url: null, is_recurring: true, specific_date: null });
      setIsAddingClass(false);
    }
  };

  const deleteClass = async (id: string) => {
    const { error } = await supabase.from("classes").delete().eq("id", id);
    if (error) { console.error("Delete error:", error); toast.error("שגיאה במחיקה: " + error.message); }
    else { toast.success("נמחק"); queryClient.invalidateQueries({ queryKey: ["classes"] }); }
    setEditingClass(null);
  };

  return (
    <Layout>
      <PageHero
        label="לוח שיעורים"
        title="מערכת שעות"
        subtitle=""
        page="schedule"
        labelSection="hero-label"
        titleSection="hero-title"
        subtitleSection="hero-subtitle"
      />

      {/* Weekly Schedule */}
      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <ScheduleE section="schedule-label" fallback="שבועי" as="span" className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block" />
            <ScheduleE section="schedule-title" fallback="לוח שיעורים" as="h2" className="font-heading text-3xl md:text-4xl font-bold" />
          </div>

          {isEditMode && (
            <div className="text-center mb-6">
              <Button size="sm" onClick={() => setIsAddingClass(true)} className="rounded-full gap-2">
                <Plus className="h-4 w-4" />הוסף שיעור
              </Button>
            </div>
          )}

          {/* Mobile: Day selector tabs */}
          <div className="md:hidden max-w-lg mx-auto" dir="rtl">
            <div className="flex gap-1.5 mb-6 overflow-x-auto pb-2 scrollbar-hide">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    "flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-heading font-medium transition-all duration-200",
                    selectedDay === day
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "bg-card text-muted-foreground border border-border/40 hover:border-primary/30"
                  )}
                >
                  {day}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {dayClasses.length === 0 ? (
                <p className="text-sm text-muted-foreground/50 text-center py-10">אין שיעורים ביום {selectedDay}</p>
              ) : (
                dayClasses.map((cls) => (
                  <Card
                    key={cls.id}
                    className={cn(
                      "rounded-xl border-0 shadow-sm overflow-hidden transition-all duration-200 cursor-pointer active:scale-[0.98]",
                      isEditMode && "ring-2 ring-transparent hover:ring-primary/30 group relative"
                    )}
                    onClick={() => isEditMode ? setEditingClass({ ...cls }) : setViewingClass(cls)}
                  >
                    {isEditMode && (
                      <div className="absolute top-2 left-2 z-10 bg-card/90 backdrop-blur-sm rounded-full p-1">
                        <Pencil className="h-3 w-3 text-primary" />
                      </div>
                    )}
                    <CardContent className="p-0">
                      <div className="flex items-stretch">
                        <div className="bg-primary/8 px-4 py-3 border-l border-primary/10 flex flex-col items-center justify-center min-w-[90px]">
                          <Clock className="h-3.5 w-3.5 text-primary mb-1" />
                          <span className="font-heading font-bold text-sm text-primary whitespace-nowrap">
                            {cls.time}
                          </span>
                          {cls.end_time && (
                            <span className="font-heading text-xs text-primary/70">
                              {cls.end_time}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 p-3">
                          <div className="flex items-center gap-1.5 mb-1">
                            <h4 className="font-heading font-semibold text-base leading-tight">{cls.name}</h4>
                            {!cls.is_recurring && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-accent text-accent-foreground font-medium">חד פעמי</span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <User className="h-3.5 w-3.5" />{cls.teacher}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Desktop: 7-column grid */}
          <div className="hidden md:block max-w-7xl mx-auto overflow-x-auto pb-4" dir="rtl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="grid grid-cols-7 gap-3 min-w-[900px]"
            >
              {days.map((day) => {
                const dayItems = classes.filter((c) => c.day === day).sort((a, b) => a.time.localeCompare(b.time));
                return (
                  <motion.div key={day} variants={fadeUp} className="flex flex-col">
                    <div className="text-center mb-3 pb-3 border-b-2 border-primary/20">
                      <h3 className="font-heading font-bold text-base text-primary">יום {day}</h3>
                    </div>
                    <div className="space-y-2.5 flex-1">
                      {dayItems.length === 0 ? (
                        <p className="text-sm text-muted-foreground/50 text-center py-6">—</p>
                      ) : (
                        dayItems.map((cls) => (
                          <Card
                            key={cls.id}
                            className={cn(
                              "rounded-xl border-0 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer",
                              isEditMode && "ring-2 ring-transparent hover:ring-primary/30 group relative"
                            )}
                            onClick={() => isEditMode ? setEditingClass({ ...cls }) : setViewingClass(cls)}
                          >
                            {isEditMode && (
                              <div className="absolute top-1.5 left-1.5 z-10 bg-card/90 backdrop-blur-sm rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Pencil className="h-3 w-3 text-primary" />
                              </div>
                            )}
                            <CardContent className="p-0">
                              <div className="bg-primary/8 px-3 py-2 border-b border-primary/10 flex items-center justify-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-primary" />
                                <span className="font-heading font-bold text-sm text-primary">
                                  {cls.time}{cls.end_time ? ` - ${cls.end_time}` : ""}
                                </span>
                              </div>
                              <div className="p-3">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <h4 className="font-heading font-semibold text-sm leading-tight">{cls.name}</h4>
                                  {!cls.is_recurring && (
                                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-accent text-accent-foreground font-medium">חד פעמי</span>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <User className="h-3 w-3" />{cls.teacher}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Class Details Section */}
      <section className="py-14 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <ScheduleE section="classes-label" fallback="השיעורים" as="span" className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block" />
            <ScheduleE section="classes-title" fallback="הכירו את השיעורים שלנו" as="h2" className="font-heading text-3xl md:text-4xl font-bold" />
          </div>

          {(() => {
            const uniqueClasses = classes.reduce<ClassRow[]>((acc, cls) => {
              if (!acc.find(c => c.name === cls.name)) acc.push(cls);
              return acc;
            }, []);
            return uniqueClasses.length === 0 && !isEditMode ? (
              <p className="text-center text-muted-foreground">השיעורים יעודכנו בקרוב</p>
            ) : (
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {uniqueClasses.map((cls) => (
                  <motion.div key={cls.id} variants={fadeUp}>
                    <Card
                      className={cn(
                        "rounded-2xl border-0 overflow-hidden shadow-md cursor-pointer group h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
                        isEditMode && "ring-2 ring-transparent hover:ring-primary/30 relative"
                      )}
                      onClick={() => isEditMode ? setEditingClass({ ...cls }) : setViewingClass(cls)}
                    >
                      {isEditMode && (
                        <div className="absolute top-3 left-3 z-10 bg-card/90 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Pencil className="h-3.5 w-3.5 text-primary" />
                        </div>
                      )}
                      {cls.image_url ? (
                        <div className="aspect-[16/9] overflow-hidden">
                          <img src={cls.image_url} alt={cls.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                      ) : (
                        <div className="aspect-[16/9] bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 flex items-center justify-center">
                          <BookOpen className="h-12 w-12 text-primary/25" />
                        </div>
                      )}
                      <CardContent className="p-5" dir="rtl">
                        <h3 className="font-heading font-bold text-lg mb-2 group-hover:text-primary transition-colors">{cls.name}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{cls.description || "לחצו לפרטים נוספים"}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            );
          })()}
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

      {/* Class View - Drawer on mobile, Dialog on desktop */}
      {isMobile ? (
        <Drawer open={!!viewingClass} onOpenChange={(open) => !open && setViewingClass(null)}>
          <DrawerContent className="max-h-[85vh]" dir="rtl">
            {viewingClass && <ClassViewContent cls={viewingClass} onClose={() => setViewingClass(null)} />}
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={!!viewingClass} onOpenChange={(open) => !open && setViewingClass(null)}>
          <DialogContent className="max-w-lg p-0 overflow-hidden" dir="rtl">
            {viewingClass && <ClassViewContent cls={viewingClass} onClose={() => setViewingClass(null)} />}
          </DialogContent>
        </Dialog>
      )}
    </Layout>
  );
};

/* ──── Class View Content (shared between Drawer & Dialog) ──── */
function ClassViewContent({ cls, onClose }: { cls: ClassRow; onClose: () => void }) {
  return (
    <div className="bg-card">
      {cls.image_url && (
        <div className="aspect-[16/9] overflow-hidden">
          <img src={cls.image_url} alt={cls.name} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="p-6 space-y-4">
        <div>
          <h2 className="font-heading text-2xl font-bold mb-3">{cls.name}</h2>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {cls.specific_date && (
              <span className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full">
                <CalendarDays className="h-4 w-4 text-primary" />{cls.specific_date}
              </span>
            )}
            <span className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full">
              <Clock className="h-4 w-4 text-primary" />
              {cls.time}{cls.end_time ? ` - ${cls.end_time}` : ""}
            </span>
            <span className="flex items-center gap-1.5 bg-muted/50 px-3 py-1.5 rounded-full">
              <User className="h-4 w-4 text-primary" />{cls.teacher}
            </span>
          </div>
        </div>
        {cls.description && (
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{cls.description}</p>
        )}
        <div className="pt-2">
          <Button variant="outline" size="sm" className="rounded-full w-full md:w-auto" onClick={onClose}>
            סגירה
          </Button>
        </div>
      </div>
    </div>
  );
}

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
       <div className="bg-gradient-to-b from-primary/8 to-primary/3 px-5 py-4 border-b border-border/30">
        <p className="text-[11px] text-primary font-medium mb-2.5 tracking-wider uppercase">תצוגה מקדימה</p>
        <div className="bg-card rounded-xl shadow-md overflow-hidden border border-border/20">
          <div className="flex items-stretch" dir="rtl">
            <div className="flex flex-col items-center justify-center px-4 py-3 bg-primary/8 border-l border-primary/10 min-w-[80px]">
              <Clock className="h-3 w-3 text-primary mb-1" />
              <span className="font-heading font-bold text-sm text-primary">
                {value.time || "--:--"}{value.end_time ? ` - ${value.end_time}` : ""}
              </span>
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
        <RecurringToggle value={value} onChange={onChange} />

        <FormSection icon={Clock} title="שעות">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[11px] text-muted-foreground mb-1.5">משעה</p>
              <TimePickerField value={value.time} onChange={(t) => onChange({ ...value, time: t })} />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground mb-1.5">עד שעה</p>
              <TimePickerField value={value.end_time || ""} onChange={(t) => onChange({ ...value, end_time: t })} />
            </div>
          </div>
        </FormSection>

        <FormSection icon={ImageIcon} title="תמונת השיעור">
          <div className="flex items-center gap-3">
            {value.image_url ? (
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                <img src={value.image_url} alt="" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-6 w-6 text-primary/40" />
              </div>
            )}
            <ImageUpload
              currentUrl={value.image_url}
              onUpload={(url) => onChange({ ...value, image_url: url })}
              folder="classes"
              className="relative static"
            />
          </div>
        </FormSection>

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

export default Schedule;
