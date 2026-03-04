import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Plus, Pencil, Check, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAdminMode } from "@/hooks/useAdminMode";
import { usePageContent } from "@/hooks/usePageContent";
import EditableText from "@/components/admin/EditableText";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Tables } from "@/integrations/supabase/types";
import ImageUpload from "@/components/admin/ImageUpload";
import teacherImg from "@/assets/teacher-placeholder.jpg";

type TeacherRow = Tables<"teachers">;

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

/* ──── WYSIWYG Teacher Editor ──── */
function TeacherEditPreview({ value, onChange, onSave, onDelete, onCancel, isNew = false }: {
  value: any; onChange: (v: any) => void; onSave: () => void;
  onDelete?: () => void; onCancel: () => void; isNew?: boolean;
}) {
  return (
    <div className="bg-card">
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

const Team = () => {
  const { isEditMode } = useAdminMode();
  const [searchParams] = useSearchParams();
  const highlightTeacher = searchParams.get("teacher");
  const teacherRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const { getText, saveText } = usePageContent("team");
  const queryClient = useQueryClient();

  const { data: teachers = [] } = useQuery({
    queryKey: ["teachers"],
    queryFn: async () => {
      const { data } = await supabase.from("teachers").select("*").order("sort_order");
      return data ?? [];
    },
  });

  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);

  useEffect(() => {
    if (highlightTeacher && teachers.length > 0) {
      setActiveHighlight(highlightTeacher);
      setTimeout(() => {
        teacherRefs.current[highlightTeacher]?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
      // Remove highlight after 4 seconds
      const timer = setTimeout(() => setActiveHighlight(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [highlightTeacher, teachers]);
  const [editingTeacher, setEditingTeacher] = useState<TeacherRow | null>(null);

  const [isAddingTeacher, setIsAddingTeacher] = useState(false);
  const [newTeacher, setNewTeacher] = useState({ name: "", role: "", description: "" });

  const saveTeacher = async (t: TeacherRow) => {
    const { error } = await supabase.from("teachers").update({
      name: t.name, role: t.role, description: t.description, image_url: t.image_url,
    }).eq("id", t.id);
    if (error) { toast.error("שגיאה: " + error.message); }
    else { toast.success("נשמר"); queryClient.invalidateQueries({ queryKey: ["teachers"] }); }
    setEditingTeacher(null);
  };

  const addTeacher = async () => {
    if (!newTeacher.name) { toast.error("שם חובה"); return; }
    const { error } = await supabase.from("teachers").insert(newTeacher);
    if (error) { toast.error("שגיאה: " + error.message); }
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

  const E = ({ section, fallback, as, className }: { section: string; fallback: string; as?: "h1"|"h2"|"h3"|"p"|"span"|"div"; className?: string }) => {
    const val = getText(section, fallback);
    if (!isEditMode) {
      const Tag = as || "span";
      return <Tag className={className}>{val}</Tag>;
    }
    return <EditableText value={val} onSave={(v) => saveText(section, v)} as={as} className={className} />;
  };

  return (
    <Layout>
      <PageHero
        label="הצוות"
        title="הצוות שלנו"
        subtitle="הכירו את המורים והמורות של יוגה במושבה"
        page="team"
        labelSection="hero-label"
        titleSection="hero-title"
        subtitleSection="hero-subtitle"
      />

      <section className="py-14 md:py-36">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <E section="teachers-label" fallback="המורים שלנו" as="span" className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block" />
            <E section="teachers-title" fallback="צוות הסטודיו" as="h2" className="font-heading text-3xl md:text-4xl font-bold" />
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
                <motion.div key={t.id} variants={fadeUp} ref={(el) => { teacherRefs.current[t.name] = el; }}>
                  <Card
                    className={cn(
                      "text-center h-full rounded-3xl border-0 overflow-hidden hover-lift shadow-lg transition-all duration-500",
                      isEditMode && "cursor-pointer ring-2 ring-transparent hover:ring-primary/30",
                      highlightTeacher === t.name && "ring-2 ring-primary shadow-xl shadow-primary/20"
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

      {/* Teacher Edit Dialog */}
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

      {/* Teacher Add Dialog */}
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

export default Team;
