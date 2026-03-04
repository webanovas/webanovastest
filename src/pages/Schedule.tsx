import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Clock, User, Plus, Trash2, Check, Pencil, CalendarDays, BookOpen, Repeat, CalendarIcon, ImageIcon, Undo2, Redo2, Flame, Leaf, Mountain, Sparkles, Star } from "lucide-react";
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
import FocalPointPicker from "@/components/admin/FocalPointPicker";
import { Move } from "lucide-react";
import { usePageContent } from "@/hooks/usePageContent";
import EditableText from "@/components/admin/EditableText";

type ClassRow = Tables<"classes">;
type SpecialClass = { id: string; name: string; description: string; image_url: string | null; image_position: string | null; sort_order: number; is_active: boolean; created_at: string };

const LEVELS = {
  beginner: { label: "מתחילים", icon: Leaf, color: "text-emerald-600", bg: "bg-emerald-500/10", dots: 1 },
  all: { label: "כל הרמות", icon: Sparkles, color: "text-blue-600", bg: "bg-blue-500/10", dots: 0 },
  advanced: { label: "מתקדמים", icon: Flame, color: "text-rose-600", bg: "bg-rose-500/10", dots: 3 },
} as const;

type LevelKey = keyof typeof LEVELS;

function LevelBadge({ level, compact = false }: { level: string; compact?: boolean }) {
  const l = LEVELS[(level as LevelKey)] || LEVELS.all;
  const Icon = l.icon;
  if (compact) {
    return (
      <span className={cn("inline-flex items-center gap-0.5", l.color)} title={l.label}>
        <Icon className="h-3 w-3" />
      </span>
    );
  }
  return (
    <span className={cn("inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full", l.bg, l.color)}>
      <Icon className="h-3 w-3" />
      {l.label}
    </span>
  );
}

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
  const navigate = useNavigate();
  const [selectedDay, setSelectedDay] = useState(days[0]);
  const [editingClass, setEditingClass] = useState<ClassRow | null>(null);
  const [isAddingClass, setIsAddingClass] = useState(false);
  const [viewingClass, setViewingClass] = useState<ClassRow | null>(null);
  const [viewingClassMode, setViewingClassMode] = useState<"specific" | "general">("specific");
  const [editingClassInfo, setEditingClassInfo] = useState<ClassRow | null>(null);
  const [editingClassInfoOriginalName, setEditingClassInfoOriginalName] = useState<string>("");
  const [newClass, setNewClass] = useState({ day: "ראשון", time: "", end_time: "" as string | null, name: "", teacher: "", description: "", image_url: null as string | null, is_recurring: true, specific_date: null as string | null, level: "all" });
  const [showClassInfoFocal, setShowClassInfoFocal] = useState(false);
  const [showSpecialClasses, setShowSpecialClasses] = useState(false);
  const [editingSpecialClass, setEditingSpecialClass] = useState<SpecialClass | null>(null);
  const [isAddingSpecialClass, setIsAddingSpecialClass] = useState(false);
  const [viewingSpecialClass, setViewingSpecialClass] = useState<SpecialClass | null>(null);
  const [newSpecialClass, setNewSpecialClass] = useState({ name: "", description: "", image_url: null as string | null, image_position: "50% 50%" });
  const [showSpecialClassFocal, setShowSpecialClassFocal] = useState(false);

  // Auto-adopt description/image when renaming to an existing class or special class name
  useEffect(() => {
    if (
      editingClassInfo?.name &&
      editingClassInfo.name !== editingClassInfoOriginalName &&
      classes
    ) {
      // Check regular classes first
      const existing = classes.find(c => c.name === editingClassInfo.name);
      if (existing) {
        setEditingClassInfo(prev => prev ? {
          ...prev,
          description: existing.description,
          image_url: existing.image_url,
          image_position: existing.image_position,
        } : prev);
        return;
      }
      // Then check special classes
      const special = specialClasses.find(sc => sc.name === editingClassInfo.name);
      if (special) {
        setEditingClassInfo(prev => prev ? {
          ...prev,
          description: special.description,
          image_url: special.image_url,
          image_position: special.image_position,
        } : prev);
      }
    }
  }, [editingClassInfo?.name]);

  // Undo/Redo history
  type UndoAction = 
    | { type: "add"; classData: ClassRow }
    | { type: "delete"; classData: ClassRow }
    | { type: "update"; oldData: ClassRow; newData: ClassRow };
  const [undoStack, setUndoStack] = useState<UndoAction[]>([]);
  const [redoStack, setRedoStack] = useState<UndoAction[]>([]);

  const { data: classes = [] } = useQuery({
    queryKey: ["classes"],
    queryFn: async () => {
      const { data } = await supabase.from("classes").select("*").order("sort_order");
      return data ?? [];
    },
  });

  const { data: specialClasses = [] } = useQuery({
    queryKey: ["special_classes"],
    queryFn: async () => {
      const { data } = await supabase.from("special_classes" as any).select("*").order("sort_order") as any;
      return (data ?? []) as SpecialClass[];
    },
  });

  const dayClasses = classes.filter((c) => c.day === selectedDay).sort((a, b) => a.time.localeCompare(b.time));

  const saveClass = async (cls: any) => {
    const oldData = classes.find(c => c.id === cls.id);
    const { error } = await supabase.from("classes").update({
      day: cls.day, time: cls.time, end_time: cls.end_time || null, name: cls.name, teacher: cls.teacher, description: cls.description,
      is_recurring: cls.is_recurring, specific_date: cls.specific_date, image_url: cls.image_url || null,
      image_position: (cls as any).image_position || "50% 50%", level: (cls as any).level || "all",
    }).eq("id", cls.id);
    if (error) { console.error("Save error:", error); toast.error("שגיאה בשמירה: " + error.message); }
    else {
      toast.success("נשמר");
      if (oldData) {
        setUndoStack(prev => [...prev, { type: "update", oldData, newData: cls }]);
        setRedoStack([]);
      }
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    }
    setEditingClass(null);
  };

  const addClass = async () => {
    if (!newClass.name || !newClass.time) { toast.error("שם ושעה חובה"); return; }
    const { data, error } = await supabase.from("classes").insert({
      day: newClass.day, time: newClass.time, end_time: newClass.end_time || null, name: newClass.name,
      teacher: newClass.teacher, description: newClass.description, image_url: newClass.image_url || null,
      is_recurring: newClass.is_recurring, specific_date: newClass.specific_date, level: (newClass as any).level || "all",
    } as any).select().single();
    if (error) { console.error("Add error:", error); toast.error("שגיאה: " + error.message); }
    else {
      toast.success("נוסף");
      if (data) {
        setUndoStack(prev => [...prev, { type: "add", classData: data }]);
        setRedoStack([]);
      }
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      setNewClass({ day: "ראשון", time: "", end_time: "", name: "", teacher: "", description: "", image_url: null, is_recurring: true, specific_date: null, level: "all" } as any);
      setIsAddingClass(false);
    }
  };

  const deleteClass = async (id: string) => {
    const deletedClass = classes.find(c => c.id === id);
    const { error } = await supabase.from("classes").delete().eq("id", id);
    if (error) { console.error("Delete error:", error); toast.error("שגיאה במחיקה: " + error.message); }
    else {
      toast.success("נמחק");
      if (deletedClass) {
        setUndoStack(prev => [...prev, { type: "delete", classData: deletedClass }]);
        setRedoStack([]);
      }
      queryClient.invalidateQueries({ queryKey: ["classes"] });
    }
    setEditingClass(null);
  };

  const handleUndo = async () => {
    if (undoStack.length === 0) return;
    const action = undoStack[undoStack.length - 1];
    let success = false;
    if (action.type === "add") {
      const { error } = await supabase.from("classes").delete().eq("id", action.classData.id);
      success = !error;
    } else if (action.type === "delete") {
      const { id, ...rest } = action.classData;
      const { error } = await supabase.from("classes").insert({ ...rest, id } as any);
      success = !error;
    } else if (action.type === "update") {
      const { error } = await supabase.from("classes").update({
        day: action.oldData.day, time: action.oldData.time, end_time: action.oldData.end_time,
        name: action.oldData.name, teacher: action.oldData.teacher, description: action.oldData.description,
        is_recurring: action.oldData.is_recurring, specific_date: action.oldData.specific_date, image_url: action.oldData.image_url, level: (action.oldData as any).level || "all",
      }).eq("id", action.oldData.id);
      success = !error;
    }
    if (success) {
      setUndoStack(prev => prev.slice(0, -1));
      setRedoStack(prev => [...prev, action]);
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      toast.success("בוטל");
    } else { toast.error("שגיאה בביטול"); }
  };

  const handleRedo = async () => {
    if (redoStack.length === 0) return;
    const action = redoStack[redoStack.length - 1];
    let success = false;
    if (action.type === "add") {
      const { id, ...rest } = action.classData;
      const { error } = await supabase.from("classes").insert({ ...rest, id } as any);
      success = !error;
    } else if (action.type === "delete") {
      const { error } = await supabase.from("classes").delete().eq("id", action.classData.id);
      success = !error;
    } else if (action.type === "update") {
      const { error } = await supabase.from("classes").update({
        day: action.newData.day, time: action.newData.time, end_time: action.newData.end_time,
        name: action.newData.name, teacher: action.newData.teacher, description: action.newData.description,
        is_recurring: action.newData.is_recurring, specific_date: action.newData.specific_date, image_url: action.newData.image_url, level: (action.newData as any).level || "all",
      }).eq("id", action.newData.id);
      success = !error;
    }
    if (success) {
      setRedoStack(prev => prev.slice(0, -1));
      setUndoStack(prev => [...prev, action]);
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      toast.success("שוחזר");
    } else { toast.error("שגיאה בשחזור"); }
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
            {/* Level Legend */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
              {(Object.keys(LEVELS) as LevelKey[]).map((key) => {
                const l = LEVELS[key];
                const Icon = l.icon;
                const desc = getText(`level-${key}`, "");
                const hasPopover = isEditMode || !!desc;
                
                const badge = (
                  <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full", l.bg, l.color, hasPopover && "cursor-pointer transition-transform hover:scale-105")}>
                    <Icon className="h-3.5 w-3.5" />
                    {l.label}
                  </span>
                );

                if (!hasPopover) return <span key={key}>{badge}</span>;

                return (
                  <Popover key={key}>
                    <PopoverTrigger asChild>
                      <button>{badge}</button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 text-right" side="bottom">
                      {isEditMode ? (
                        <div className="space-y-2">
                          <p className={cn("font-semibold text-sm flex items-center gap-1", l.color)}>
                            <Icon className="h-4 w-4" /> {l.label}
                          </p>
                          <textarea
                            placeholder="הוסף תיאור לרמה..."
                            className="w-full min-h-[60px] text-sm rounded-md border border-input bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring resize-y"
                            defaultValue={desc}
                            key={`level-${key}-${desc}`}
                            onBlur={(e) => saveText(`level-${key}`, e.target.value)}
                          />
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className={cn("font-semibold text-sm flex items-center gap-1", l.color)}>
                            <Icon className="h-4 w-4" /> {l.label}
                          </p>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{desc}</p>
                        </div>
                      )}
                    </PopoverContent>
                  </Popover>
                );
              })}
            </div>
          </div>

          {isEditMode && (
            <div className="flex items-center justify-center gap-3 mb-6">
              <Button size="sm" variant="outline" onClick={handleUndo} disabled={undoStack.length === 0} className="rounded-full gap-1.5">
                <Undo2 className="h-4 w-4" />ביטול
              </Button>
              <Button size="sm" onClick={() => setIsAddingClass(true)} className="rounded-full gap-2">
                <Plus className="h-4 w-4" />הוסף שיעור
              </Button>
              <Button size="sm" variant="outline" onClick={handleRedo} disabled={redoStack.length === 0} className="rounded-full gap-1.5">
                <Redo2 className="h-4 w-4" />שחזור
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
                      "rounded-xl border-0 shadow-sm overflow-hidden transition-all duration-200",
                      isEditMode && "ring-2 ring-transparent hover:ring-primary/30 group relative cursor-pointer active:scale-[0.98]"
                    )}
                    onClick={() => isEditMode && setEditingClass({ ...cls })}
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
                          <LevelBadge level={(cls as any).level || "all"} compact />
                          <button
                              onClick={(e) => { e.stopPropagation(); if (!isEditMode) { setViewingClassMode("general"); setViewingClass(cls); } }}
                              className="font-heading font-semibold text-base leading-tight text-foreground underline decoration-foreground/20 underline-offset-2 hover:decoration-primary hover:text-primary transition-colors text-right"
                            >
                              {cls.name}
                            </button>
                            {!cls.is_recurring && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-accent text-accent-foreground font-medium">חד פעמי</span>
                            )}
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); if (!isEditMode) navigate(`/team?teacher=${encodeURIComponent(cls.teacher)}`); }}
                            className="text-sm text-muted-foreground flex items-center gap-1 hover:text-primary transition-colors"
                          >
                            <User className="h-3.5 w-3.5" /><span className="underline decoration-muted-foreground/30 underline-offset-2 hover:decoration-primary">{cls.teacher}</span>
                          </button>
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
                              "rounded-xl border-0 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-0.5",
                              isEditMode && "ring-2 ring-transparent hover:ring-primary/30 group relative cursor-pointer"
                            )}
                            onClick={() => isEditMode && setEditingClass({ ...cls })}
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
                                  <LevelBadge level={(cls as any).level || "all"} compact />
                                  <button
                                    onClick={(e) => { e.stopPropagation(); if (!isEditMode) { setViewingClassMode("general"); setViewingClass(cls); } }}
                                    className="font-heading font-semibold text-sm leading-tight text-foreground underline decoration-foreground/20 underline-offset-2 hover:decoration-primary hover:text-primary transition-colors text-right"
                                  >
                                    {cls.name}
                                  </button>
                                  {!cls.is_recurring && (
                                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-accent text-accent-foreground font-medium">חד פעמי</span>
                                  )}
                                </div>
                                <button
                                  onClick={(e) => { e.stopPropagation(); if (!isEditMode) navigate(`/team?teacher=${encodeURIComponent(cls.teacher)}`); }}
                                  className="text-xs text-muted-foreground flex items-center gap-1 hover:text-primary transition-colors"
                                >
                                  <User className="h-3 w-3" /><span className="underline decoration-muted-foreground/30 underline-offset-2 hover:decoration-primary">{cls.teacher}</span>
                                </button>
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
            }, []).filter(cls => cls.name.trim() !== "יוגה ויניאסה יסודות").sort((a, b) => {
              const priority = "יוגה ויניאסה לכל הרמות";
              if (a.name === priority && b.name !== priority) return -1;
              if (b.name === priority && a.name !== priority) return 1;
              return 0;
            });
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
                      onClick={() => { if (isEditMode) { setEditingClassInfo({ ...cls }); setEditingClassInfoOriginalName(cls.name); } else { setViewingClassMode("general"); setViewingClass(cls); } }}
                    >
                      {isEditMode && (
                        <div className="absolute top-3 left-3 z-10 bg-card/90 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Pencil className="h-3.5 w-3.5 text-primary" />
                        </div>
                      )}
                      {cls.image_url ? (
                        <div className="aspect-[16/9] overflow-hidden">
                          <img src={cls.image_url} alt={cls.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" style={{ objectPosition: (cls as any).image_position || "50% 50%" }} />
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

          {/* Special Classes Toggle */}
          {(specialClasses.filter(sc => sc.is_active).length > 0 || isEditMode) && (
            <div className="mt-12 max-w-5xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-8">
                <button
                  onClick={() => setShowSpecialClasses(!showSpecialClasses)}
                  className="flex items-center gap-2 text-primary font-heading font-semibold text-lg hover:opacity-80 transition-opacity"
                >
                  <Star className="h-5 w-5" />
                  <ScheduleE section="special-classes-title" fallback="שיעורים מיוחדים" as="span" className="" />
                  <motion.span
                    animate={{ rotate: showSpecialClasses ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-primary"
                  >
                    ▼
                  </motion.span>
                </button>
              </div>

              <AnimatePresence>
                {showSpecialClasses && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {isEditMode && (
                      <div className="flex justify-center mb-6">
                        <Button size="sm" onClick={() => setIsAddingSpecialClass(true)} className="rounded-full gap-2">
                          <Plus className="h-4 w-4" />הוסף שיעור מיוחד
                        </Button>
                      </div>
                    )}

                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {specialClasses.filter(sc => sc.is_active || isEditMode).map((sc) => (
                        <motion.div key={sc.id} variants={fadeUp}>
                          <Card
                            className={cn(
                              "rounded-2xl border-0 overflow-hidden shadow-md cursor-pointer group h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
                              isEditMode && "ring-2 ring-transparent hover:ring-primary/30 relative",
                              !sc.is_active && "opacity-50"
                            )}
                            onClick={() => {
                              if (isEditMode) {
                                setEditingSpecialClass({ ...sc });
                              } else {
                                setViewingSpecialClass(sc);
                              }
                            }}
                          >
                            {isEditMode && (
                              <div className="absolute top-3 left-3 z-10 bg-card/90 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Pencil className="h-3.5 w-3.5 text-primary" />
                              </div>
                            )}
                            {sc.image_url ? (
                              <div className="aspect-[16/9] overflow-hidden">
                                <img src={sc.image_url} alt={sc.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" style={{ objectPosition: sc.image_position || "50% 50%" }} />
                              </div>
                            ) : (
                              <div className="aspect-[16/9] bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 flex items-center justify-center">
                                <Star className="h-12 w-12 text-primary/25" />
                              </div>
                            )}
                            <CardContent className="p-5" dir="rtl">
                              <div className="flex items-center gap-2 mb-2">
                                <Star className="h-4 w-4 text-primary" />
                                <h3 className="font-heading font-bold text-lg group-hover:text-primary transition-colors">{sc.name}</h3>
                              </div>
                              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{sc.description || "לחצו לפרטים נוספים"}</p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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

      {/* Class Info Edit (image + description only) */}
      <Dialog open={!!editingClassInfo} onOpenChange={(open) => !open && setEditingClassInfo(null)}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto" dir="rtl">
          {editingClassInfo && (
            <div className="space-y-5 pt-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/70">שם השיעור</label>
                <Input
                  value={editingClassInfo.name}
                  onChange={(e) => setEditingClassInfo({ ...editingClassInfo, name: e.target.value })}
                  className="rounded-xl font-heading text-lg font-bold"
                  placeholder="שם השיעור..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/70">תמונה</label>
                {editingClassInfo.image_url && (
                  <div className="aspect-[16/9] rounded-xl overflow-hidden relative group">
                    <img src={editingClassInfo.image_url} alt="" className="w-full h-full object-cover" style={{ objectPosition: (editingClassInfo as any).image_position || "50% 50%" }} />
                    <button
                      onClick={() => setShowClassInfoFocal(true)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 backdrop-blur-sm rounded-full p-2 shadow-md border border-border hover:bg-background"
                      title="מיקום מוקד התמונה"
                    >
                      <Move className="h-4 w-4 text-foreground" />
                    </button>
                  </div>
                )}
                <ImageUpload
                  currentUrl={editingClassInfo.image_url}
                  onUpload={(url) => setEditingClassInfo({ ...editingClassInfo, image_url: url })}
                  folder="classes"
                  className="relative static"
                />
                <FocalPointPicker
                  src={editingClassInfo.image_url || ""}
                  alt={editingClassInfo.name}
                  objectPosition={(editingClassInfo as any).image_position || "50% 50%"}
                  onSave={(pos) => setEditingClassInfo({ ...editingClassInfo, image_position: pos } as any)}
                  open={showClassInfoFocal}
                  onOpenChange={setShowClassInfoFocal}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/70">תיאור השיעור</label>
                <Textarea
                  value={editingClassInfo.description}
                  onChange={(e) => setEditingClassInfo({ ...editingClassInfo, description: e.target.value })}
                  rows={4}
                  className="rounded-xl resize-none"
                  placeholder="תיאור השיעור..."
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button onClick={async () => {
                  // Update all classes with same name
                  const { error } = await supabase
                    .from("classes")
                    .update({ name: editingClassInfo.name, description: editingClassInfo.description, image_url: editingClassInfo.image_url || null, image_position: (editingClassInfo as any).image_position || "50% 50%" })
                    .eq("name", editingClassInfoOriginalName);
                  if (error) { toast.error("שגיאה: " + error.message); }
                  else { toast.success("נשמר"); queryClient.invalidateQueries({ queryKey: ["classes"] }); }
                  setEditingClassInfo(null);
                }} className="rounded-full flex-1 gap-2">
                  <Check className="h-4 w-4" />שמירה
                </Button>
                <Button variant="outline" onClick={() => setEditingClassInfo(null)} className="rounded-full">ביטול</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Class View - Drawer on mobile, Dialog on desktop */}
      {isMobile ? (
        <Drawer open={!!viewingClass} onOpenChange={(open) => !open && setViewingClass(null)}>
          <DrawerContent className="max-h-[85vh]" dir="rtl">
            {viewingClass && <ClassViewContent cls={viewingClass} onClose={() => setViewingClass(null)} allClasses={classes} specialClasses={specialClasses} initialMode={viewingClassMode} />}
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={!!viewingClass} onOpenChange={(open) => !open && setViewingClass(null)}>
          <DialogContent className="max-w-lg p-0 overflow-hidden [&>button]:hidden" dir="rtl">
            {viewingClass && <ClassViewContent cls={viewingClass} onClose={() => setViewingClass(null)} allClasses={classes} specialClasses={specialClasses} initialMode={viewingClassMode} />}
          </DialogContent>
        </Dialog>
      )}

      {/* Special Class View */}
      {isMobile ? (
        <Drawer open={!!viewingSpecialClass} onOpenChange={(open) => !open && setViewingSpecialClass(null)}>
          <DrawerContent className="max-h-[85vh]" dir="rtl">
            {viewingSpecialClass && <SpecialClassViewContent sc={viewingSpecialClass} onClose={() => setViewingSpecialClass(null)} />}
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={!!viewingSpecialClass} onOpenChange={(open) => !open && setViewingSpecialClass(null)}>
          <DialogContent className="max-w-lg p-0 overflow-hidden [&>button]:hidden" dir="rtl">
            {viewingSpecialClass && <SpecialClassViewContent sc={viewingSpecialClass} onClose={() => setViewingSpecialClass(null)} />}
          </DialogContent>
        </Dialog>
      )}

      {/* Special Class Edit */}
      <Dialog open={!!editingSpecialClass} onOpenChange={(open) => !open && setEditingSpecialClass(null)}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto" dir="rtl">
          {editingSpecialClass && (
            <div className="space-y-5 pt-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/70">שם השיעור</label>
                <Input
                  value={editingSpecialClass.name}
                  onChange={(e) => setEditingSpecialClass({ ...editingSpecialClass, name: e.target.value })}
                  className="rounded-xl font-heading text-lg font-bold"
                  placeholder="שם השיעור..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/70">תמונה</label>
                {editingSpecialClass.image_url && (
                  <div className="aspect-[16/9] rounded-xl overflow-hidden relative group">
                    <img src={editingSpecialClass.image_url} alt="" className="w-full h-full object-cover" style={{ objectPosition: editingSpecialClass.image_position || "50% 50%" }} />
                    <button
                      onClick={() => setShowSpecialClassFocal(true)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 backdrop-blur-sm rounded-full p-2 shadow-md border border-border hover:bg-background"
                      title="מיקום מוקד התמונה"
                    >
                      <Move className="h-4 w-4 text-foreground" />
                    </button>
                  </div>
                )}
                <ImageUpload
                  currentUrl={editingSpecialClass.image_url}
                  onUpload={(url) => setEditingSpecialClass({ ...editingSpecialClass, image_url: url })}
                  folder="classes"
                  className="relative static"
                />
                <FocalPointPicker
                  src={editingSpecialClass.image_url || ""}
                  alt={editingSpecialClass.name}
                  objectPosition={editingSpecialClass.image_position || "50% 50%"}
                  onSave={(pos) => setEditingSpecialClass({ ...editingSpecialClass, image_position: pos })}
                  open={showSpecialClassFocal}
                  onOpenChange={setShowSpecialClassFocal}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/70">תיאור השיעור</label>
                <Textarea
                  value={editingSpecialClass.description}
                  onChange={(e) => setEditingSpecialClass({ ...editingSpecialClass, description: e.target.value })}
                  rows={4}
                  className="rounded-xl resize-none"
                  placeholder="תיאור השיעור..."
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-foreground/70">פעיל</label>
                <Switch
                  checked={editingSpecialClass.is_active}
                  onCheckedChange={(checked) => setEditingSpecialClass({ ...editingSpecialClass, is_active: checked })}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button onClick={async () => {
                  const { error } = await supabase
                    .from("special_classes" as any)
                    .update({ name: editingSpecialClass.name, description: editingSpecialClass.description, image_url: editingSpecialClass.image_url || null, image_position: editingSpecialClass.image_position || "50% 50%", is_active: editingSpecialClass.is_active } as any)
                    .eq("id", editingSpecialClass.id);
                  if (error) { toast.error("שגיאה: " + error.message); }
                  else { toast.success("נשמר"); queryClient.invalidateQueries({ queryKey: ["special_classes"] }); }
                  setEditingSpecialClass(null);
                }} className="rounded-full flex-1 gap-2">
                  <Check className="h-4 w-4" />שמירה
                </Button>
                <Button variant="destructive" size="sm" onClick={async () => {
                  const { error } = await supabase.from("special_classes" as any).delete().eq("id", editingSpecialClass.id);
                  if (error) { toast.error("שגיאה: " + error.message); }
                  else { toast.success("נמחק"); queryClient.invalidateQueries({ queryKey: ["special_classes"] }); }
                  setEditingSpecialClass(null);
                }} className="rounded-full gap-1.5">
                  <Trash2 className="h-3.5 w-3.5" />מחק
                </Button>
                <Button variant="outline" onClick={() => setEditingSpecialClass(null)} className="rounded-full">ביטול</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Special Class Add */}
      <Dialog open={isAddingSpecialClass} onOpenChange={setIsAddingSpecialClass}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto" dir="rtl">
          <div className="space-y-5 pt-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70">שם השיעור</label>
              <Input
                value={newSpecialClass.name}
                onChange={(e) => setNewSpecialClass({ ...newSpecialClass, name: e.target.value })}
                className="rounded-xl font-heading text-lg font-bold"
                placeholder="למשל: היפהופ, פילאטיס..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70">תמונה</label>
              <ImageUpload
                currentUrl={newSpecialClass.image_url}
                onUpload={(url) => setNewSpecialClass({ ...newSpecialClass, image_url: url })}
                folder="classes"
                className="relative static"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/70">תיאור השיעור</label>
              <Textarea
                value={newSpecialClass.description}
                onChange={(e) => setNewSpecialClass({ ...newSpecialClass, description: e.target.value })}
                rows={4}
                className="rounded-xl resize-none"
                placeholder="תיאור השיעור..."
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={async () => {
                if (!newSpecialClass.name) { toast.error("שם השיעור חובה"); return; }
                const { error } = await supabase.from("special_classes" as any).insert({
                  name: newSpecialClass.name,
                  description: newSpecialClass.description,
                  image_url: newSpecialClass.image_url || null,
                  image_position: newSpecialClass.image_position,
                } as any);
                if (error) { toast.error("שגיאה: " + error.message); }
                else { toast.success("נוסף"); queryClient.invalidateQueries({ queryKey: ["special_classes"] }); }
                setNewSpecialClass({ name: "", description: "", image_url: null, image_position: "50% 50%" });
                setIsAddingSpecialClass(false);
              }} className="rounded-full flex-1 gap-2">
                <Check className="h-4 w-4" />הוסף
              </Button>
              <Button variant="outline" onClick={() => setIsAddingSpecialClass(false)} className="rounded-full">ביטול</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

/* ──── Class View Content (shared between Drawer & Dialog) ──── */
function ClassViewContent({ cls, onClose, allClasses, specialClasses }: { cls: ClassRow; onClose: () => void; allClasses?: ClassRow[]; specialClasses?: SpecialClass[]; initialMode?: "specific" | "general" }) {
  const generalClass = allClasses?.find(c => c.name === cls.name) || cls;
  // Check if there's a special class with matching name that has better info
  const matchingSpecial = specialClasses?.find(sc => sc.name === cls.name && sc.is_active);
  const displayData = matchingSpecial ? {
    name: matchingSpecial.name,
    description: matchingSpecial.description || generalClass.description,
    image_url: matchingSpecial.image_url || generalClass.image_url,
    image_position: matchingSpecial.image_position || (generalClass as any).image_position || "50% 50%",
    level: (generalClass as any).level || "all",
  } : {
    name: generalClass.name,
    description: generalClass.description,
    image_url: generalClass.image_url,
    image_position: (generalClass as any).image_position || "50% 50%",
    level: (generalClass as any).level || "all",
  };

  return (
    <div className="bg-card overflow-hidden">
      {displayData.image_url && (
        <div className="aspect-[16/9] overflow-hidden">
          <img src={displayData.image_url} alt={displayData.name} className="w-full h-full object-cover" style={{ objectPosition: displayData.image_position }} />
        </div>
      )}
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          {matchingSpecial ? <Star className="h-5 w-5 text-primary" /> : <BookOpen className="h-5 w-5 text-primary" />}
          <h2 className="font-heading text-2xl font-bold">{displayData.name}</h2>
          <LevelBadge level={displayData.level} />
        </div>
        {displayData.description && (
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{displayData.description}</p>
        )}
        <Button variant="outline" size="sm" className="rounded-full" onClick={onClose}>
          סגירה
        </Button>
      </div>
    </div>
  );
}

/* ──── Special Class View Content ──── */
function SpecialClassViewContent({ sc, onClose }: { sc: SpecialClass; onClose: () => void }) {
  return (
    <div className="bg-card overflow-hidden">
      {sc.image_url && (
        <div className="aspect-[16/9] overflow-hidden">
          <img src={sc.image_url} alt={sc.name} className="w-full h-full object-cover" style={{ objectPosition: sc.image_position || "50% 50%" }} />
        </div>
      )}
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-primary" />
          <h2 className="font-heading text-2xl font-bold">{sc.name}</h2>
        </div>
        {sc.description && (
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{sc.description}</p>
        )}
        <Button variant="outline" size="sm" className="rounded-full" onClick={onClose}>
          סגירה
        </Button>
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
  const [showFocalPicker, setShowFocalPicker] = useState(false);
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
                <LevelBadge level={value.level || "all"} compact />
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
                <img src={value.image_url} alt="" className="w-full h-full object-cover" style={{ objectPosition: value.image_position || "50% 50%" }} />
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
            {value.image_url && (
              <button
                onClick={(e) => { e.stopPropagation(); setShowFocalPicker(true); }}
                className="bg-background/90 backdrop-blur-sm rounded-full p-2 shadow-md border border-border hover:bg-background"
                title="מיקום מוקד התמונה"
              >
                <Move className="h-4 w-4 text-foreground" />
              </button>
            )}
          </div>
          <FocalPointPicker
            src={value.image_url || ""}
            alt="preview"
            objectPosition={value.image_position || "50% 50%"}
            onSave={(pos) => onChange({ ...value, image_position: pos })}
            open={showFocalPicker}
            onOpenChange={setShowFocalPicker}
          />
        </FormSection>

        <FormSection icon={Flame} title="רמת השיעור">
          <div className="flex gap-1.5">
            {(Object.keys(LEVELS) as LevelKey[]).map((key) => {
              const l = LEVELS[key];
              const Icon = l.icon;
              const isSelected = (value.level || "all") === key;
              return (
                <button
                  key={key}
                  onClick={() => onChange({ ...value, level: key })}
                  className={cn(
                    "flex-1 py-2 rounded-xl text-xs font-medium transition-all duration-200 border flex flex-col items-center gap-1",
                    isSelected
                      ? cn("border-current shadow-md", l.color, l.bg)
                      : "bg-card text-muted-foreground border-border/50 hover:border-primary/30"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {l.label}
                </button>
              );
            })}
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
