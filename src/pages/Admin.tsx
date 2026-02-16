import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { LogOut, Plus, Trash2, CalendarDays, Clock, MapPin, User, BookOpen, Quote, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";
import { ClockPicker } from "@/components/ui/clock-picker";

type ClassRow = Tables<"classes">;
type TeacherRow = Tables<"teachers">;
type WorkshopRow = Tables<"workshops">;
type TestimonialRow = Tables<"testimonials">;
type PageContentRow = Tables<"page_content">;

const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי"];

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/admin-login", { replace: true });
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">טוען...</div>;
  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <header className="border-b border-border px-4 py-3 flex items-center justify-between bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <h1 className="font-heading font-bold text-lg">ניהול האתר</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/")} className="gap-2 rounded-full">
            חזרה לאתר
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/"); }} className="gap-2">
            <LogOut className="h-4 w-4" />יציאה
          </Button>
        </div>
      </header>

      <div className="container mx-auto p-4 max-w-4xl">
        <Tabs defaultValue="classes" dir="rtl">
          <TabsList className="flex flex-wrap gap-1 h-auto bg-transparent mb-6">
            {[
              { val: "classes", label: "שיעורים" },
              { val: "teachers", label: "מורים" },
              { val: "workshops", label: "סדנאות" },
              { val: "testimonials", label: "מילים חמות" },
              { val: "content", label: "תוכן עמודים" },
            ].map((t) => (
              <TabsTrigger key={t.val} value={t.val} className="px-5 py-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="classes"><ClassesManager /></TabsContent>
          <TabsContent value="teachers"><TeachersManager /></TabsContent>
          <TabsContent value="workshops"><WorkshopsManager /></TabsContent>
          <TabsContent value="testimonials"><TestimonialsManager /></TabsContent>
          <TabsContent value="content"><ContentManager /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

/* ──── Labeled Field ──── */
function Field({ label, icon: Icon, children, className }: { label: string; icon?: any; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
        {Icon && <Icon className="h-3 w-3" />}
        {label}
      </label>
      {children}
    </div>
  );
}

/* ──── Time Picker (Clock Face) ──── */
function TimePicker({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-center font-mono text-sm rounded-xl h-10 border-dashed border-primary/20",
            !value && "text-muted-foreground"
          )}
        >
          <Clock className="h-3.5 w-3.5 ml-2 text-primary" />
          {value || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4" align="center">
        <ClockPicker value={value} onChange={onChange} onDone={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}

/* ──── Date Picker ──── */
function DatePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const parsed = parseDate(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-right font-normal rounded-xl h-10 border-dashed border-primary/20",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarDays className="h-3.5 w-3.5 ml-2 text-primary" />
          {value || "בחר תאריך"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={parsed}
          onSelect={(date) => {
            if (date) onChange(format(date, "dd.MM.yyyy"));
            setOpen(false);
          }}
          initialFocus
          className="p-3 pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
}

function parseDate(dateStr: string): Date | undefined {
  const parts = dateStr?.split(".");
  if (parts?.length === 3) {
    const d = parseInt(parts[0]), m = parseInt(parts[1]) - 1, y = parseInt(parts[2]);
    if (!isNaN(d) && !isNaN(m) && !isNaN(y)) return new Date(y, m, d);
  }
  return undefined;
}

// ──── Classes ────
function ClassesManager() {
  const [items, setItems] = useState<ClassRow[]>([]);

  const load = async () => {
    const { data } = await supabase.from("classes").select("*").order("sort_order");
    if (data) setItems(data);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    const { error } = await supabase.from("classes").insert({ day: "ראשון", time: "09:00", name: "", teacher: "", description: "" });
    if (error) toast.error("שגיאה"); else { toast.success("נוסף"); load(); }
  };
  const update = async (id: string, field: string, value: string) => {
    await supabase.from("classes").update({ [field]: value }).eq("id", id);
  };
  const remove = async (id: string) => {
    await supabase.from("classes").delete().eq("id", id);
    toast.success("נמחק"); load();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-heading font-semibold text-lg">ניהול שיעורים</h2>
        <Button size="sm" onClick={add} className="gap-1 rounded-full"><Plus className="h-4 w-4" />הוסף שיעור</Button>
      </div>
      {items.map((item) => (
        <Card key={item.id} className="rounded-2xl border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5 space-y-4">
            {/* Day chips */}
            <Field label="יום" icon={CalendarDays}>
              <div className="flex gap-1.5 flex-wrap">
                {days.map((d) => (
                  <button
                    key={d}
                    onClick={() => update(item.id, "day", d)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                      item.day === d
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-muted hover:bg-accent text-foreground"
                    )}
                  >
                    יום {d}
                  </button>
                ))}
              </div>
            </Field>

            {/* Time picker */}
            <Field label="שעה" icon={Clock}>
              <TimePicker
                value={item.time}
                onChange={(v) => { update(item.id, "time", v); load(); }}
                placeholder="בחר שעה"
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="שם השיעור" icon={BookOpen}>
                <Input defaultValue={item.name} placeholder="לדוגמה: ויניאסה" onBlur={(e) => update(item.id, "name", e.target.value)} className="rounded-xl h-10" />
              </Field>
              <Field label="מורה" icon={User}>
                <Input defaultValue={item.teacher} placeholder="שם המורה" onBlur={(e) => update(item.id, "teacher", e.target.value)} className="rounded-xl h-10" />
              </Field>
            </div>

            <Field label="תיאור">
              <Textarea defaultValue={item.description} placeholder="תיאור קצר של השיעור" onBlur={(e) => update(item.id, "description", e.target.value)} className="rounded-xl" rows={2} />
            </Field>

            <div className="flex justify-end pt-1 border-t border-border/30">
              <Button variant="ghost" size="sm" onClick={() => remove(item.id)} className="text-destructive gap-1 rounded-full text-xs">
                <Trash2 className="h-3.5 w-3.5" />מחק שיעור
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ──── Teachers ────
function TeachersManager() {
  const [items, setItems] = useState<TeacherRow[]>([]);
  const load = async () => {
    const { data } = await supabase.from("teachers").select("*").order("sort_order");
    if (data) setItems(data);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    const { error } = await supabase.from("teachers").insert({ name: "", role: "", description: "" });
    if (error) toast.error("שגיאה"); else { toast.success("נוסף"); load(); }
  };
  const update = async (id: string, field: string, value: string) => {
    await supabase.from("teachers").update({ [field]: value }).eq("id", id);
  };
  const remove = async (id: string) => {
    await supabase.from("teachers").delete().eq("id", id);
    toast.success("נמחק"); load();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-heading font-semibold text-lg">ניהול מורים</h2>
        <Button size="sm" onClick={add} className="gap-1 rounded-full"><Plus className="h-4 w-4" />הוסף מורה</Button>
      </div>
      {items.map((item) => (
        <Card key={item.id} className="rounded-2xl border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="שם המורה" icon={User}>
                <Input defaultValue={item.name} placeholder="שם מלא" onBlur={(e) => update(item.id, "name", e.target.value)} className="rounded-xl h-10" />
              </Field>
              <Field label="תפקיד / התמחות">
                <Input defaultValue={item.role} placeholder="לדוגמה: מורה ויניאסה" onBlur={(e) => update(item.id, "role", e.target.value)} className="rounded-xl h-10" />
              </Field>
            </div>
            <Field label="תיאור">
              <Textarea defaultValue={item.description} placeholder="כמה מילים על המורה..." onBlur={(e) => update(item.id, "description", e.target.value)} className="rounded-xl" rows={2} />
            </Field>
            <div className="flex justify-end pt-1 border-t border-border/30">
              <Button variant="ghost" size="sm" onClick={() => remove(item.id)} className="text-destructive gap-1 rounded-full text-xs">
                <Trash2 className="h-3.5 w-3.5" />מחק מורה
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ──── Workshops ────
function WorkshopsManager() {
  const [items, setItems] = useState<WorkshopRow[]>([]);
  const load = async () => {
    const { data } = await supabase.from("workshops").select("*").order("sort_order");
    if (data) setItems(data);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    const { error } = await supabase.from("workshops").insert({ title: "", date: "", description: "" });
    if (error) toast.error("שגיאה"); else { toast.success("נוסף"); load(); }
  };
  const update = async (id: string, field: string, value: string | boolean) => {
    await supabase.from("workshops").update({ [field]: value }).eq("id", id);
  };
  const remove = async (id: string) => {
    await supabase.from("workshops").delete().eq("id", id);
    toast.success("נמחק"); load();
  };

  const getTimeStart = (time: string | null) => time?.split("-")[0]?.trim() || "";
  const getTimeEnd = (time: string | null) => time?.split("-")[1]?.trim() || "";

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-heading font-semibold text-lg">ניהול סדנאות</h2>
        <Button size="sm" onClick={add} className="gap-1 rounded-full"><Plus className="h-4 w-4" />הוסף סדנה</Button>
      </div>
      {items.map((item) => (
        <Card key={item.id} className="rounded-2xl border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5 space-y-4">
            <Field label="שם הסדנה" icon={BookOpen}>
              <Input defaultValue={item.title} placeholder="שם הסדנה" onBlur={(e) => update(item.id, "title", e.target.value)} className="rounded-xl h-10" />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="תאריך" icon={CalendarDays}>
                <DatePicker value={item.date} onChange={(v) => { update(item.id, "date", v); load(); }} />
              </Field>
              <Field label="מיקום" icon={MapPin}>
                <Input defaultValue={item.location ?? ""} placeholder="מיקום הסדנה" onBlur={(e) => update(item.id, "location", e.target.value)} className="rounded-xl h-10" />
              </Field>
            </div>

            <Field label="טווח שעות" icon={Clock}>
              <div className="flex items-center gap-2">
                <TimePicker
                  value={getTimeStart(item.time)}
                  onChange={(v) => { update(item.id, "time", `${v}-${getTimeEnd(item.time) || "13:00"}`); load(); }}
                  placeholder="שעת התחלה"
                />
                <span className="text-muted-foreground font-medium">–</span>
                <TimePicker
                  value={getTimeEnd(item.time)}
                  onChange={(v) => { update(item.id, "time", `${getTimeStart(item.time) || "10:00"}-${v}`); load(); }}
                  placeholder="שעת סיום"
                />
              </div>
            </Field>

            <Field label="תיאור">
              <Textarea defaultValue={item.description} placeholder="תיאור הסדנה" onBlur={(e) => update(item.id, "description", e.target.value)} className="rounded-xl" rows={2} />
            </Field>

            <div className="flex items-center justify-between pt-1 border-t border-border/30">
              <label className="flex items-center gap-2.5 text-sm cursor-pointer">
                <div
                  className={cn(
                    "w-9 h-5 rounded-full transition-colors relative cursor-pointer",
                    item.is_active ? "bg-primary" : "bg-muted"
                  )}
                  onClick={() => { update(item.id, "is_active", !item.is_active); load(); }}
                >
                  <div className={cn(
                    "absolute top-0.5 w-4 h-4 rounded-full bg-card shadow transition-transform",
                    item.is_active ? "right-0.5" : "left-0.5"
                  )} />
                </div>
                <span className="text-xs text-muted-foreground">{item.is_active ? "פעיל" : "מוסתר"}</span>
              </label>
              <Button variant="ghost" size="sm" onClick={() => remove(item.id)} className="text-destructive gap-1 rounded-full text-xs">
                <Trash2 className="h-3.5 w-3.5" />מחק סדנה
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ──── Testimonials ────
function TestimonialsManager() {
  const [items, setItems] = useState<TestimonialRow[]>([]);
  const load = async () => {
    const { data } = await supabase.from("testimonials").select("*").order("sort_order");
    if (data) setItems(data);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    const { error } = await supabase.from("testimonials").insert({ name: "", text: "" });
    if (error) toast.error("שגיאה"); else { toast.success("נוסף"); load(); }
  };
  const update = async (id: string, field: string, value: string) => {
    await supabase.from("testimonials").update({ [field]: value }).eq("id", id);
  };
  const remove = async (id: string) => {
    await supabase.from("testimonials").delete().eq("id", id);
    toast.success("נמחק"); load();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-heading font-semibold text-lg">ניהול מילים חמות</h2>
        <Button size="sm" onClick={add} className="gap-1 rounded-full"><Plus className="h-4 w-4" />הוסף המלצה</Button>
      </div>
      {items.map((item) => (
        <Card key={item.id} className="rounded-2xl border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5 space-y-4">
            {/* Preview of how it'll look */}
            <div className="bg-accent/30 rounded-xl p-4 border border-border/30">
              <Quote className="h-5 w-5 text-primary/30 mb-2" />
              <p className="text-sm text-foreground/70 leading-relaxed mb-3">{item.text || "תוכן ההמלצה..."}</p>
              <div className="flex items-center gap-2 pt-2 border-t border-border/30">
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-heading font-bold text-primary text-xs">{(item.name || "?").charAt(0)}</span>
                </div>
                <span className="font-heading font-medium text-xs">{item.name || "שם"}</span>
              </div>
            </div>

            <Field label="שם" icon={User}>
              <Input defaultValue={item.name} placeholder="שם המממליץ/ה" onBlur={(e) => update(item.id, "name", e.target.value)} className="rounded-xl h-10" />
            </Field>
            <Field label="תוכן ההמלצה" icon={Quote}>
              <Textarea defaultValue={item.text} placeholder="תוכן ההמלצה" onBlur={(e) => update(item.id, "text", e.target.value)} className="rounded-xl" rows={3} />
            </Field>
            <div className="flex justify-end pt-1 border-t border-border/30">
              <Button variant="ghost" size="sm" onClick={() => remove(item.id)} className="text-destructive gap-1 rounded-full text-xs">
                <Trash2 className="h-3.5 w-3.5" />מחק
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ──── Page Content ────
function ContentManager() {
  const [items, setItems] = useState<PageContentRow[]>([]);
  const load = async () => {
    const { data } = await supabase.from("page_content").select("*").order("page");
    if (data) setItems(data);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    const { error } = await supabase.from("page_content").insert({ page: "home", section: "new-section", content: "" });
    if (error) toast.error(error.message); else { toast.success("נוסף"); load(); }
  };
  const update = async (id: string, field: string, value: string) => {
    await supabase.from("page_content").update({ [field]: value }).eq("id", id);
  };
  const remove = async (id: string) => {
    await supabase.from("page_content").delete().eq("id", id);
    toast.success("נמחק"); load();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-heading font-semibold text-lg">ניהול תוכן עמודים</h2>
        <Button size="sm" onClick={add} className="gap-1 rounded-full"><Plus className="h-4 w-4" />הוסף תוכן</Button>
      </div>
      {items.map((item) => (
        <Card key={item.id} className="rounded-2xl border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="עמוד" icon={FileText}>
                <Input defaultValue={item.page} placeholder="home, about..." onBlur={(e) => update(item.id, "page", e.target.value)} className="rounded-xl h-10" />
              </Field>
              <Field label="סקשן">
                <Input defaultValue={item.section} placeholder="hero-title, about-text..." onBlur={(e) => update(item.id, "section", e.target.value)} className="rounded-xl h-10" />
              </Field>
            </div>
            <Field label="תוכן">
              <Textarea defaultValue={item.content} placeholder="תוכן" onBlur={(e) => update(item.id, "content", e.target.value)} className="rounded-xl" rows={4} />
            </Field>
            <div className="flex justify-end pt-1 border-t border-border/30">
              <Button variant="ghost" size="sm" onClick={() => remove(item.id)} className="text-destructive gap-1 rounded-full text-xs">
                <Trash2 className="h-3.5 w-3.5" />מחק
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default Admin;
