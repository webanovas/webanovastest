import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { LogOut, Plus, Trash2, Save } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type ClassRow = Tables<"classes">;
type TeacherRow = Tables<"teachers">;
type WorkshopRow = Tables<"workshops">;
type TestimonialRow = Tables<"testimonials">;
type PageContentRow = Tables<"page_content">;

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
      <header className="border-b border-border px-4 py-3 flex items-center justify-between">
        <h1 className="font-heading font-bold text-lg">ניהול האתר</h1>
        <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/"); }} className="gap-2">
          <LogOut className="h-4 w-4" />יציאה
        </Button>
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

// ──── Classes ────
function ClassesManager() {
  const [items, setItems] = useState<ClassRow[]>([]);
  const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי"];

  const load = async () => {
    const { data } = await supabase.from("classes").select("*").order("sort_order");
    if (data) setItems(data);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    const { error } = await supabase.from("classes").insert({ day: "ראשון", time: "", name: "", teacher: "", description: "" });
    if (error) toast.error("שגיאה"); else { toast.success("נוסף"); load(); }
  };
  const update = async (id: string, field: string, value: string) => {
    await supabase.from("classes").update({ [field]: value }).eq("id", id);
  };
  const save = async () => { toast.success("נשמר"); };
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
        <Card key={item.id} className="rounded-xl">
          <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              defaultValue={item.day}
              onChange={(e) => update(item.id, "day", e.target.value)}
              className="rounded-lg border border-border p-2 text-sm bg-background"
            >
              {days.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <Input defaultValue={item.time} placeholder="שעה" onBlur={(e) => update(item.id, "time", e.target.value)} className="rounded-lg" />
            <Input defaultValue={item.name} placeholder="שם השיעור" onBlur={(e) => update(item.id, "name", e.target.value)} className="rounded-lg" />
            <Input defaultValue={item.teacher} placeholder="מורה" onBlur={(e) => update(item.id, "teacher", e.target.value)} className="rounded-lg" />
            <Textarea defaultValue={item.description} placeholder="תיאור" onBlur={(e) => update(item.id, "description", e.target.value)} className="rounded-lg col-span-full" rows={2} />
            <div className="col-span-full flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => remove(item.id)} className="text-destructive gap-1"><Trash2 className="h-3.5 w-3.5" />מחק</Button>
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
        <Card key={item.id} className="rounded-xl">
          <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input defaultValue={item.name} placeholder="שם" onBlur={(e) => update(item.id, "name", e.target.value)} className="rounded-lg" />
            <Input defaultValue={item.role} placeholder="תפקיד" onBlur={(e) => update(item.id, "role", e.target.value)} className="rounded-lg" />
            <Textarea defaultValue={item.description} placeholder="תיאור" onBlur={(e) => update(item.id, "description", e.target.value)} className="rounded-lg col-span-full" rows={2} />
            <div className="col-span-full flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => remove(item.id)} className="text-destructive gap-1"><Trash2 className="h-3.5 w-3.5" />מחק</Button>
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-heading font-semibold text-lg">ניהול סדנאות</h2>
        <Button size="sm" onClick={add} className="gap-1 rounded-full"><Plus className="h-4 w-4" />הוסף סדנה</Button>
      </div>
      {items.map((item) => (
        <Card key={item.id} className="rounded-xl">
          <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input defaultValue={item.title} placeholder="שם הסדנה" onBlur={(e) => update(item.id, "title", e.target.value)} className="rounded-lg" />
            <Input defaultValue={item.date} placeholder="תאריך" onBlur={(e) => update(item.id, "date", e.target.value)} className="rounded-lg" />
            <Input defaultValue={item.time ?? ""} placeholder="שעות" onBlur={(e) => update(item.id, "time", e.target.value)} className="rounded-lg" />
            <Input defaultValue={item.location ?? ""} placeholder="מיקום" onBlur={(e) => update(item.id, "location", e.target.value)} className="rounded-lg" />
            <Textarea defaultValue={item.description} placeholder="תיאור" onBlur={(e) => update(item.id, "description", e.target.value)} className="rounded-lg col-span-full" rows={2} />
            <div className="col-span-full flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  defaultChecked={item.is_active}
                  onChange={(e) => { update(item.id, "is_active", e.target.checked); }}
                  className="rounded"
                />
                פעיל (מוצג באתר)
              </label>
              <Button variant="ghost" size="sm" onClick={() => remove(item.id)} className="text-destructive gap-1"><Trash2 className="h-3.5 w-3.5" />מחק</Button>
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
        <Card key={item.id} className="rounded-xl">
          <CardContent className="p-4 grid grid-cols-1 gap-3">
            <Input defaultValue={item.name} placeholder="שם" onBlur={(e) => update(item.id, "name", e.target.value)} className="rounded-lg" />
            <Textarea defaultValue={item.text} placeholder="תוכן ההמלצה" onBlur={(e) => update(item.id, "text", e.target.value)} className="rounded-lg" rows={3} />
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => remove(item.id)} className="text-destructive gap-1"><Trash2 className="h-3.5 w-3.5" />מחק</Button>
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
        <Card key={item.id} className="rounded-xl">
          <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input defaultValue={item.page} placeholder="עמוד (home, about...)" onBlur={(e) => update(item.id, "page", e.target.value)} className="rounded-lg" />
            <Input defaultValue={item.section} placeholder="סקשן (hero-title, about-text...)" onBlur={(e) => update(item.id, "section", e.target.value)} className="rounded-lg" />
            <Textarea defaultValue={item.content} placeholder="תוכן" onBlur={(e) => update(item.id, "content", e.target.value)} className="rounded-lg col-span-full" rows={4} />
            <div className="col-span-full flex justify-end">
              <Button variant="ghost" size="sm" onClick={() => remove(item.id)} className="text-destructive gap-1"><Trash2 className="h-3.5 w-3.5" />מחק</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default Admin;
