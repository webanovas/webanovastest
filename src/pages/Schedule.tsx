import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Clock, User, Plus, Trash2, Check, Pencil } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAdminMode } from "@/hooks/useAdminMode";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Tables } from "@/integrations/supabase/types";
import { Link } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import teacherImg from "@/assets/teacher-placeholder.jpg";

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
  const [selectedDay, setSelectedDay] = useState(days[0]);
  const [editingClass, setEditingClass] = useState<ClassRow | null>(null);
  const [isAddingClass, setIsAddingClass] = useState(false);
  const [newClass, setNewClass] = useState({ day: "ראשון", time: "", name: "", teacher: "", description: "" });

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
    }).eq("id", cls.id);
    if (error) toast.error("שגיאה בשמירה");
    else { toast.success("נשמר"); queryClient.invalidateQueries({ queryKey: ["classes"] }); }
    setEditingClass(null);
  };

  const addClass = async () => {
    if (!newClass.name || !newClass.time) { toast.error("שם ושעה חובה"); return; }
    const { error } = await supabase.from("classes").insert({
      day: newClass.day, time: newClass.time, name: newClass.name,
      teacher: newClass.teacher, description: newClass.description,
    });
    if (error) toast.error("שגיאה");
    else {
      toast.success("נוסף");
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      setNewClass({ day: "ראשון", time: "", name: "", teacher: "", description: "" });
      setIsAddingClass(false);
    }
  };

  const deleteClass = async (id: string) => {
    await supabase.from("classes").delete().eq("id", id);
    toast.success("נמחק");
    queryClient.invalidateQueries({ queryKey: ["classes"] });
    setEditingClass(null);
  };

  const saveTeacher = async (t: TeacherRow) => {
    const { error } = await supabase.from("teachers").update({
      name: t.name, role: t.role, description: t.description,
    }).eq("id", t.id);
    if (error) toast.error("שגיאה");
    else { toast.success("נשמר"); queryClient.invalidateQueries({ queryKey: ["teachers"] }); }
    setEditingTeacher(null);
  };

  const addTeacher = async () => {
    if (!newTeacher.name) { toast.error("שם חובה"); return; }
    const { error } = await supabase.from("teachers").insert(newTeacher);
    if (error) toast.error("שגיאה");
    else {
      toast.success("נוסף");
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      setNewTeacher({ name: "", role: "", description: "" });
      setIsAddingTeacher(false);
    }
  };

  const deleteTeacher = async (id: string) => {
    await supabase.from("teachers").delete().eq("id", id);
    toast.success("נמחק");
    queryClient.invalidateQueries({ queryKey: ["teachers"] });
    setEditingTeacher(null);
  };

  return (
    <Layout>
      <PageHero
        label="לוח שיעורים"
        title="מערכת שעות ומורים"
        subtitle="הצטרפו לשיעור שמתאים לכם – בסטודיו או בזום"
      />

      {/* Schedule with Day Tabs */}
      <section className="py-24 md:py-36">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block">שבועי</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold">לוח שיעורים</h2>
          </div>

          {/* Day Tabs */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center bg-muted/50 rounded-2xl p-1.5 gap-1">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={cn(
                    "relative px-6 py-2.5 rounded-xl text-sm font-heading font-medium transition-all duration-300",
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
                          <div className="flex flex-col items-center justify-center px-6 py-5 bg-primary/8 border-l border-primary/10 min-w-[100px]">
                            <Clock className="h-4 w-4 text-primary mb-1.5" />
                            <span className="font-heading font-bold text-lg text-primary">{cls.time}</span>
                          </div>
                          <div className="flex-1 p-5 flex items-center justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="font-heading font-semibold text-base mb-1">{cls.name}</h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                <User className="h-3.5 w-3.5" />{cls.teacher}
                              </p>
                              {cls.description && (
                                <p className="text-xs text-muted-foreground/70 mt-1.5 line-clamp-1">{cls.description}</p>
                              )}
                            </div>
                            {!isEditMode && (
                              <Button asChild size="sm" className="rounded-full shadow-sm shadow-primary/20 shrink-0">
                                <Link to="/contact">הרשמה</Link>
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
      <section className="py-24 md:py-36 bg-yoga-cream relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block">הצוות</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold">המורים שלנו</h2>
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

      {/* Class Edit - WYSIWYG */}
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

      {/* Class Add - WYSIWYG */}
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

      {/* Teacher Edit - WYSIWYG */}
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

      {/* Teacher Add - WYSIWYG */}
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

/* WYSIWYG Class Editor - looks like the actual class card */
function ClassEditPreview({ value, onChange, onSave, onDelete, onCancel, isNew = false }: {
  value: any; onChange: (v: any) => void; onSave: () => void;
  onDelete?: () => void; onCancel: () => void; isNew?: boolean;
}) {
  return (
    <div className="bg-card">
      {/* Preview header that matches the real card */}
      <div className="bg-primary/5 px-5 py-4 border-b border-primary/10">
        <p className="text-xs text-primary font-medium mb-2">תצוגה מקדימה</p>
        {/* Mini preview of how it'll look */}
        <div className="bg-card rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-stretch" dir="rtl">
            <div className="flex flex-col items-center justify-center px-4 py-3 bg-primary/8 border-l border-primary/10 min-w-[80px]">
              <Clock className="h-3 w-3 text-primary mb-1" />
              <span className="font-heading font-bold text-sm text-primary">{value.time || "--:--"}</span>
            </div>
            <div className="flex-1 p-3">
              <h3 className="font-heading font-semibold text-sm">{value.name || "שם השיעור"}</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <User className="h-3 w-3" />{value.teacher || "מורה"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Day selector as chips */}
        <div>
          <label className="text-xs text-muted-foreground block mb-2">יום</label>
          <div className="flex gap-1.5">
            {days.map((d) => (
              <button
                key={d}
                onClick={() => onChange({ ...value, day: d })}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  value.day === d
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted hover:bg-accent text-foreground"
                )}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Time picker with chips */}
        <div>
          <label className="text-xs text-muted-foreground block mb-2">שעה</label>
          <TimeChipPicker
            value={value.time}
            onChange={(t) => onChange({ ...value, time: t })}
          />
        </div>

        {/* Name */}
        <Input
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
          placeholder="שם השיעור"
          className="rounded-xl border-dashed border-primary/20 h-11"
        />

        {/* Teacher */}
        <Input
          value={value.teacher}
          onChange={(e) => onChange({ ...value, teacher: e.target.value })}
          placeholder="שם המורה"
          className="rounded-xl border-dashed border-primary/20 h-11"
        />

        {/* Description */}
        <Textarea
          value={value.description || ""}
          onChange={(e) => onChange({ ...value, description: e.target.value })}
          placeholder="תיאור (אופציונלי)"
          className="rounded-xl border-dashed border-primary/20 resize-none"
          rows={2}
        />

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

/* Time chip picker */
function TimeChipPicker({ value, onChange }: { value: string; onChange: (t: string) => void }) {
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
            "w-full justify-center font-mono text-sm rounded-xl h-11 border-dashed border-primary/20",
            !value && "text-muted-foreground"
          )}
        >
          <Clock className="h-4 w-4 ml-2 text-primary" />
          {value || "בחר שעה"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3 max-h-64 overflow-y-auto" align="center">
        <div className="grid grid-cols-4 gap-1.5">
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

/* WYSIWYG Teacher Editor */
function TeacherEditPreview({ value, onChange, onSave, onDelete, onCancel, isNew = false }: {
  value: any; onChange: (v: any) => void; onSave: () => void;
  onDelete?: () => void; onCancel: () => void; isNew?: boolean;
}) {
  return (
    <div className="bg-card">
      {/* Image preview */}
      <div className="aspect-[4/3] overflow-hidden relative">
        <img src={value.image_url || teacherImg} alt="preview" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
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
        <Textarea
          value={value.description || ""}
          onChange={(e) => onChange({ ...value, description: e.target.value })}
          placeholder="קצת על המורה..."
          className="rounded-xl border-dashed border-primary/20 resize-none"
          rows={3}
        />

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

export default Schedule;
