import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Leaf, Award, Heart, ArrowLeft, Plus, Pencil, Check, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { useAdminMode } from "@/hooks/useAdminMode";
import { usePageContent } from "@/hooks/usePageContent";
import EditableText from "@/components/admin/EditableText";
import EditableImage from "@/components/admin/EditableImage";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { Tables } from "@/integrations/supabase/types";
import ImageUpload from "@/components/admin/ImageUpload";

import teacherShira from "@/assets/teacher-shira.jpg";
import studioInterior from "@/assets/studio-interior.jpg";
import yogaGroup from "@/assets/yoga-group.jpg";
import meditationHands from "@/assets/meditation-hands.jpg";
import yogaSunset from "@/assets/yoga-sunset.jpg";
import heroYoga from "@/assets/hero-yoga.jpg";
import zoomYoga from "@/assets/zoom-yoga.jpg";
import teacherImg from "@/assets/teacher-placeholder.jpg";

type TeacherRow = Tables<"teachers">;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const galleryDefaults = [
  { src: studioInterior, alt: "הסטודיו" },
  { src: yogaGroup, alt: "שיעור קבוצתי" },
  { src: meditationHands, alt: "מדיטציה" },
  { src: heroYoga, alt: "תרגול יוגה" },
  { src: zoomYoga, alt: "שיעור זום" },
  { src: yogaSunset, alt: "יוגה בשקיעה" },
];

const valueIcons = [Leaf, Award, Heart];
const valueDefaults = [
  { title: "טבעיות", desc: "תרגול שמכבד את הגוף ואת הקצב האישי" },
  { title: "מקצועיות", desc: "הכשרה מעמיקה וליווי מותאם אישית" },
  { title: "קהילה", desc: "מרחב חם, קשוב ותומך לכל המתרגלים" },
];

/* ──── Teacher Edit Form Section ──── */
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

const About = () => {
  const { isEditMode } = useAdminMode();
  const { getText, saveText } = usePageContent("about");
  const queryClient = useQueryClient();

  // Teacher state
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

  const E = ({ section, fallback, as, className, multiline }: { section: string; fallback: string; as?: "h1"|"h2"|"h3"|"p"|"span"|"div"; className?: string; multiline?: boolean }) => {
    const val = getText(section, fallback);
    if (!isEditMode) {
      const Tag = as || "span";
      return <Tag className={className}>{val}</Tag>;
    }
    return <EditableText value={val} onSave={(v) => saveText(section, v)} as={as} className={className} multiline={multiline} />;
  };

  const getImage = (section: string, fallback: string) => {
    const saved = getText(section, "");
    return saved || fallback;
  };

  return (
    <Layout>
      <PageHero
        label="הסטודיו שלנו"
        title="על הסטודיו"
        subtitle="יוגה במושבה הוא סטודיו בוטיק בכיכר המושבה בהוד השרון"
        page="about"
        labelSection="hero-label"
        titleSection="hero-title"
        subtitleSection="hero-subtitle"
      />

      {/* About Shira */}
      <section className="py-14 md:py-36">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[3/4]">
                <EditableImage
                  src={getImage("shira-image", teacherShira)}
                  alt="שירה פלג"
                  className="w-full h-full object-cover"
                  folder="about"
                  onUpload={isEditMode ? (url) => saveText("shira-image", url) : undefined}
                  objectPosition={getText("shira-image-pos", "50% 50%")}
                  onPositionChange={isEditMode ? (pos) => saveText("shira-image-pos", pos) : undefined}
                />
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
              <motion.div variants={fadeUp}>
                <E section="shira-label" fallback="בעלת הסטודיו" as="span" className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block" />
              </motion.div>
              <motion.div variants={fadeUp}>
                <E section="shira-name" fallback="שירה פלג" as="h2" className="font-heading text-3xl md:text-4xl font-bold mb-5" />
              </motion.div>
              <motion.div variants={fadeUp}>
                <E section="shira-bio-1" fallback="מורה ומטפלת ביוגה עם ניסיון של שנים רבות. שירה מלמדת מתוך אהבה אמיתית לתרגול ומאמינה שכל אחד יכול למצוא את הדרך שלו על המזרן." as="p" className="text-muted-foreground leading-relaxed mb-4 text-lg" multiline />
              </motion.div>
              <motion.div variants={fadeUp}>
                <E section="shira-bio-2" fallback="הסטודיו מציע מרחב חם ומזמין, עם קבוצות קטנות שמאפשרות תשומת לב אישית לכל מתרגל ומתרגלת." as="p" className="text-muted-foreground leading-relaxed mb-8" multiline />
              </motion.div>
              <motion.div variants={fadeUp}>
                <Button variant="outline" className="rounded-full gap-2 px-8 h-12" asChild={!isEditMode}>
                  {isEditMode ? (
                    <span><E section="shira-btn" fallback="לוח שיעורים" /><ArrowLeft className="h-4 w-4" /></span>
                  ) : (
                    <Link to="/schedule"><E section="shira-btn" fallback="לוח שיעורים" /><ArrowLeft className="h-4 w-4" /></Link>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-4 px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {galleryDefaults.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl overflow-hidden shadow-md aspect-square"
            >
              <EditableImage
                src={getImage(`gallery-${i}`, img.src)}
                alt={img.alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                folder="gallery"
                onUpload={isEditMode ? (url) => saveText(`gallery-${i}`, url) : undefined}
                objectPosition={getText(`gallery-${i}-pos`, "50% 50%")}
                onPositionChange={isEditMode ? (pos) => saveText(`gallery-${i}-pos`, pos) : undefined}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-14 md:py-36 bg-yoga-cream relative">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-16">
            <motion.div variants={fadeUp}>
              <E section="values-label" fallback="מי אנחנו" as="span" className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block" />
            </motion.div>
            <motion.div variants={fadeUp}>
              <E section="values-title" fallback="הערכים שלנו" as="h2" className="font-heading text-3xl md:text-4xl font-bold" />
            </motion.div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto">
            {valueDefaults.map((v, i) => {
              const Icon = valueIcons[i];
              return (
                <motion.div key={i} variants={fadeUp} className="text-center group">
                  <div className="w-20 h-20 rounded-full bg-primary/8 flex items-center justify-center mx-auto mb-5 group-hover:bg-primary/15 group-hover:scale-110 transition-all duration-300">
                    <Icon className="h-9 w-9 text-primary" />
                  </div>
                  <E section={`value-${i}-title`} fallback={v.title} as="h3" className="font-heading font-semibold text-xl mb-2" />
                  <E section={`value-${i}-desc`} fallback={v.desc} as="p" className="text-muted-foreground text-sm" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Teachers */}
      <section className="py-14 md:py-36 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <E section="teachers-label" fallback="הצוות" as="span" className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block" />
            <E section="teachers-title" fallback="המורים שלנו" as="h2" className="font-heading text-3xl md:text-4xl font-bold" />
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

      {/* CTA Banner */}
      <section className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <EditableImage
          src={getImage("cta-bg", yogaSunset)}
          alt="יוגה בשקיעה"
          className="absolute inset-0 w-full h-full object-cover"
          folder="about-cta"
          onUpload={isEditMode ? (url) => saveText("cta-bg", url) : undefined}
          objectPosition={getText("cta-bg-pos", "50% 50%")}
          onPositionChange={isEditMode ? (pos) => saveText("cta-bg-pos", pos) : undefined}
        />
        <div className="absolute inset-0 bg-yoga-dark/50 flex items-center justify-center pointer-events-none">
          <div className="text-center px-4 pointer-events-auto">
            <E section="cta-title" fallback="בואו לתרגל" as="h2"
              className="font-heading text-3xl md:text-5xl font-bold text-primary-foreground mb-4" />
            <Button size="lg" className="rounded-full px-10 h-14 text-lg shadow-xl shadow-primary/30" asChild={!isEditMode}>
              {isEditMode ? (
                <span><E section="cta-btn" fallback="צרו קשר" /></span>
              ) : (
                <Link to="/contact"><E section="cta-btn" fallback="צרו קשר" /></Link>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* Blog placeholder */}
      <section className="py-14 md:py-36">
        <div className="container mx-auto px-4 text-center">
          <E section="blog-label" fallback="בקרוב" as="span" className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block" />
          <E section="blog-title" fallback="מאמרים ותוכן" as="h2" className="font-heading text-3xl font-bold mb-4" />
          <E section="blog-subtitle" fallback="בקרוב – מאמרים, טיפים ותכנים מעולם היוגה" as="p" className="text-muted-foreground mb-8 text-lg" />
          <div className="bg-accent/40 rounded-3xl p-14 max-w-2xl mx-auto border border-border/30">
            <E section="blog-placeholder" fallback="מקום שמור לבלוג עתידי 🌿" as="p" className="text-muted-foreground text-sm" />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
