import { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon, Clock, MapPin, Plus, Pencil, Check, Trash2, CalendarDays, FileText, Move, MessageCircle, Phone, Mail, Send, Loader2, CreditCard, Link as LinkIcon, Users, AlignLeft, Share2, Copy } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
// Workshop fallback uses first uploaded workshop image
const WORKSHOP_FALLBACK = "https://muhfaqvpnyakhfkcfhkc.supabase.co/storage/v1/object/public/site-images/workshops/1773666905225.jpeg";
import ImageUpload from "@/components/admin/ImageUpload";
import FocalPointPicker from "@/components/admin/FocalPointPicker";
import { usePageContent } from "@/hooks/usePageContent";
import EditableText from "@/components/admin/EditableText";

type WorkshopRow = Tables<"workshops">;

const workshopImages = [WORKSHOP_FALLBACK, WORKSHOP_FALLBACK];

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

/* ──── Share Menu ──── */
function ShareMenu({ workshopId, workshopTitle, className }: { workshopId: string; workshopTitle: string; className?: string }) {
  const shareUrl = `${window.location.origin}/workshops#workshop-${workshopId}`;
  const shareText = `בואו לסדנה: ${workshopTitle}`;
  const [copied, setCopied] = useState(false);

  const handleShare = async (method: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    e?.preventDefault();
    switch (method) {
      case "native":
        if (navigator.share) {
          try { await navigator.share({ title: workshopTitle, text: shareText, url: shareUrl }); } catch {}
        }
        break;
      case "whatsapp":
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + "\n" + shareUrl)}`, "_blank");
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, "_blank");
        break;
      case "copy":
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success("הקישור הועתק");
        setTimeout(() => setCopied(false), 2000);
        break;
    }
  };

  // Use native share only on mobile (touch devices)
  const isMobile = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  if (isMobile && navigator.share) {
    return (
      <button onClick={(e) => { e.stopPropagation(); handleShare("native", e); }} className={cn("flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors", className)} title="שיתוף">
        <Share2 className="h-3.5 w-3.5" />
        <span>שיתוף</span>
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button onClick={(e) => e.stopPropagation()} className={cn("flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors", className)} title="שיתוף">
          {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Share2 className="h-3.5 w-3.5" />}
          <span>{copied ? "הועתק!" : "שיתוף"}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem onClick={(e) => handleShare("whatsapp", e)} className="gap-2 cursor-pointer">
          <MessageCircle className="h-4 w-4" /> וואטסאפ
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => handleShare("facebook", e)} className="gap-2 cursor-pointer">
          <Users className="h-4 w-4" /> פייסבוק
        </DropdownMenuItem>
        <DropdownMenuItem onClick={(e) => handleShare("copy", e)} className="gap-2 cursor-pointer">
          {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
          {copied ? "הועתק!" : "העתק קישור"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


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
  const { getText, saveText } = usePageContent("workshops");
  const location = useLocation();
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [pendingScrollId, setPendingScrollId] = useState<string | null>(null);
  const highlightTimeoutRef = useRef<number | null>(null);

  const getCenteredScrollTop = useCallback((el: HTMLElement) => {
    const header = document.querySelector("header");
    const headerHeight = header instanceof HTMLElement ? header.getBoundingClientRect().height : 0;
    const rect = el.getBoundingClientRect();
    const elementCenter = rect.top + window.scrollY + rect.height / 2;
    const visibleCenter = window.innerHeight / 2 + headerHeight / 2;

    return Math.max(0, elementCenter - visibleCenter);
  }, []);

  const WE = ({ section, fallback, as, className }: { section: string; fallback: string; as?: "h1"|"h2"|"h3"|"h4"|"p"|"span"|"div"; className?: string }) => {
    const val = getText(section, fallback);
    if (!isEditMode) {
      const Tag = as || "span";
      return <Tag className={className}>{val}</Tag>;
    }
    return <EditableText value={val} onSave={(v) => saveText(section, v)} as={as} className={className} persistKey={`workshops:${section}`} />;
  };

  const [editing, setEditing] = useState<WorkshopRow | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [viewingWorkshop, setViewingWorkshop] = useState<WorkshopRow | null>(null);
  const [newItem, setNewItem] = useState({ title: "", date: "", time: "", location: "", description: "", short_description: "", target_audience: "", is_active: true, payment_url: "", instructor: "", display_from: "" });

  const { data: workshops = [] } = useQuery({
    queryKey: ["workshops"],
    queryFn: async () => {
      const { data } = await supabase.from("workshops").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const todayStr = new Date().toISOString().slice(0, 10);
  const activeWorkshops = workshops.filter((w) => {
    if (!w.is_active) return false;
    const df = (w as any).display_from as string | null;
    // Hide for public until display_from; admins see everything
    if (df && df > todayStr && !isEditMode) return false;
    return true;
  });
  const pastWorkshops = workshops.filter((w) => !w.is_active);

  // Resolve deep link target + ensure the correct tab is rendered before paint
  useLayoutEffect(() => {
    if (workshops.length === 0) return;

    const hash = location.hash;
    if (!hash.startsWith("#workshop-")) {
      setPendingScrollId(null);
      return;
    }

    const targetId = hash.replace("#workshop-", "");
    const workshop = workshops.find((w) => w.id === targetId);
    if (!workshop) return;

    const nextTab = workshop.is_active ? "upcoming" : "past";
    if (activeTab !== nextTab) {
      setActiveTab(nextTab);
    }

    setPendingScrollId(targetId);
  }, [workshops, location.hash, activeTab]);

  // Center the shared workshop as soon as it exists, then re-center after layout settles
  useEffect(() => {
    if (!pendingScrollId) return;

    let cancelled = false;
    let pollFrame = 0;
    let correctionFrame = 0;
    let correctionTimeoutA = 0;
    let correctionTimeoutB = 0;

    const centerWorkshop = () => {
      const el = document.getElementById(`workshop-${pendingScrollId}`);
      if (!el) return false;

      window.scrollTo({ top: getCenteredScrollTop(el), behavior: "auto" });
      setHighlightedId(pendingScrollId);

      if (highlightTimeoutRef.current) {
        window.clearTimeout(highlightTimeoutRef.current);
      }

      highlightTimeoutRef.current = window.setTimeout(() => {
        setHighlightedId((current) => (current === pendingScrollId ? null : current));
      }, 3000);

      return true;
    };

    const tryCenter = (attempt = 0) => {
      if (cancelled) return;

      if (centerWorkshop()) {
        correctionTimeoutA = window.setTimeout(() => {
          correctionFrame = window.requestAnimationFrame(() => {
            if (!cancelled) centerWorkshop();
          });
        }, 120);

        correctionTimeoutB = window.setTimeout(() => {
          correctionFrame = window.requestAnimationFrame(() => {
            if (!cancelled) centerWorkshop();
          });
        }, 360);

        return;
      }

      if (attempt < 45) {
        pollFrame = window.requestAnimationFrame(() => tryCenter(attempt + 1));
      }
    };

    tryCenter();

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(pollFrame);
      window.cancelAnimationFrame(correctionFrame);
      window.clearTimeout(correctionTimeoutA);
      window.clearTimeout(correctionTimeoutB);
    };
  }, [pendingScrollId, activeTab, workshops.length, getCenteredScrollTop]);


  const save = async (w: WorkshopRow) => {
    const { error } = await supabase.from("workshops").update({
      title: w.title, date: w.date, time: w.time, location: w.location,
      description: w.description, is_active: w.is_active, image_url: w.image_url,
      image_position: (w as any).image_position || "50% 50%",
      detail_image_position: (w as any).detail_image_position || "50% 50%",
      payment_url: (w as any).payment_url || null,
      short_description: (w as any).short_description || "",
      target_audience: (w as any).target_audience || "",
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
      payment_url: newItem.payment_url || null,
      short_description: newItem.short_description || "",
      target_audience: newItem.target_audience || "",
    });
    if (error) { console.error("Add error:", error); toast.error("שגיאה: " + error.message); }
    else {
      toast.success("נוסף"); queryClient.invalidateQueries({ queryKey: ["workshops"] });
      setNewItem({ title: "", date: "", time: "", location: "", description: "", short_description: "", target_audience: "", is_active: true, payment_url: "", instructor: "", display_from: "" }); setIsAdding(false);
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
      <PageHero label="אירועים" title="סדנאות" subtitle="סדנאות מיוחדות להעמקת התרגול והחוויה" page="workshops" labelSection="hero-label" titleSection="hero-title" subtitleSection="hero-subtitle" />

      {/* Workshop Tabs */}
      <section className="py-12 md:py-36">
        <div className="container mx-auto px-4">
          {/* Tab buttons */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex items-center bg-muted/50 rounded-2xl p-1.5 gap-1">
              <button
                onClick={() => setActiveTab("upcoming")}
                className={cn(
                  "relative px-6 py-2.5 rounded-xl text-sm font-heading font-medium transition-all duration-300",
                  activeTab === "upcoming" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {activeTab === "upcoming" && (
                  <motion.div layoutId="workshopTab" className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/20" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />
                )}
                <span className="relative z-10">סדנאות קרובות</span>
              </button>
              <button
                onClick={() => setActiveTab("past")}
                className={cn(
                  "relative px-6 py-2.5 rounded-xl text-sm font-heading font-medium transition-all duration-300",
                  activeTab === "past" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {activeTab === "past" && (
                  <motion.div layoutId="workshopTab" className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/20" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />
                )}
                <span className="relative z-10">סדנאות עבר</span>
              </button>
            </div>
          </div>

          {isEditMode && (
            <div className="text-center mb-8">
              <Button size="sm" onClick={() => { setNewItem({ title: "", date: "", time: "", location: "", description: "", short_description: "", target_audience: "", is_active: activeTab === "upcoming", payment_url: "" }); setIsAdding(true); }} className="rounded-full gap-2">
                <Plus className="h-4 w-4" />הוסף סדנה
              </Button>
            </div>
          )}

          <AnimatePresence mode="wait">
            {activeTab === "upcoming" ? (
              <motion.div key="upcoming" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {activeWorkshops.length === 0 && !isEditMode ? (
                  <p className="text-center text-muted-foreground py-12">אין סדנאות קרובות כרגע – עקבו אחרינו לעדכונים</p>
                ) : (
                  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="flex flex-col gap-8 max-w-3xl mx-auto">
                    {activeWorkshops.map((w, i) => (
                      <motion.div key={w.id} id={`workshop-${w.id}`} variants={fadeUp} className={cn("transition-all duration-700", highlightedId === w.id && "ring-2 ring-primary rounded-3xl shadow-xl shadow-primary/20")}>
                        <WorkshopCard
                          workshop={w}
                          isEditMode={isEditMode}
                          onEdit={() => setEditing({ ...w })}
                          onView={() => setViewingWorkshop(w)}
                          imgSrc={w.image_url || workshopImages[i % workshopImages.length]}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div key="past" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {pastWorkshops.length === 0 ? (
                  <p className="text-center text-muted-foreground py-12">אין סדנאות עבר</p>
                ) : (
                  <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {pastWorkshops.map((w, i) => (
                      <Card
                        key={w.id}
                        id={`workshop-${w.id}`}
                        className={cn(
                          "rounded-3xl border-0 overflow-hidden shadow-md group cursor-pointer transition-all duration-700",
                          isEditMode && "hover:ring-2 hover:ring-primary/30",
                          highlightedId === w.id && "ring-2 ring-primary shadow-xl shadow-primary/20"
                        )}
                        onClick={() => isEditMode ? setEditing({ ...w }) : setViewingWorkshop(w)}
                      >
                        <div className="aspect-square overflow-hidden relative">
                          <img
                            src={w.image_url || workshopImages[i % workshopImages.length]}
                            alt={w.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            style={{ objectPosition: (w as any).image_position || "50% 50%" }}
                            loading="lazy"
                            decoding="async"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
                          <h3 className="absolute bottom-4 right-4 left-4 font-heading font-bold text-lg text-primary-foreground drop-shadow-md">
                            {w.title}
                          </h3>
                        </div>
                        <CardContent className="p-5 space-y-3">
                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                            {(w as any).short_description || w.description}
                          </p>
                          <div className="flex items-center gap-3">
                            <Button variant="outline" size="sm" className="rounded-full px-6 text-xs" onClick={(e) => { e.stopPropagation(); setViewingWorkshop(w); }}>
                              פרטים
                            </Button>
                            <ShareMenu workshopId={w.id} workshopTitle={w.title} />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Workshop Detail Dialog (public view) */}
      <Dialog open={!!viewingWorkshop} onOpenChange={(open) => !open && setViewingWorkshop(null)}>
        <DialogContent className="max-w-lg p-0 overflow-hidden max-h-[85vh] overflow-y-auto" dir="rtl">
          {viewingWorkshop && (
            <WorkshopDetailView
              workshop={viewingWorkshop}
              imgSrc={viewingWorkshop.image_url || workshopImages[0]}
              onClose={() => setViewingWorkshop(null)}
              isPast={!viewingWorkshop.is_active}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-w-lg p-0 overflow-hidden max-h-[85vh] overflow-y-auto" dir="rtl">
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
        <DialogContent className="max-w-lg p-0 overflow-hidden max-h-[85vh] overflow-y-auto" dir="rtl">
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

/* ──── Workshop Detail View (public) ──── */
function WorkshopDetailView({ workshop: w, imgSrc, onClose, isPast = false }: { workshop: WorkshopRow; imgSrc: string; onClose: () => void; isPast?: boolean }) {
  const workshopName = w.title;
  const whatsappMessage = encodeURIComponent(`היי שירה, אשמח לשמוע פרטים על הסדנה "${workshopName}" 🙏`);
  const whatsappUrl = `https://wa.me/972542131254?text=${whatsappMessage}`;

  const paymentUrl = (w as any).payment_url;

  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailForm, setEmailForm] = useState({ name: "", phone: "", message: `אשמח לקבל פרטים נוספים על הסדנה "${workshopName}"` });
  const [emailSending, setEmailSending] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailForm.name || !emailForm.phone) {
      toast.error("נא למלא שם וטלפון");
      return;
    }
    setEmailSending(true);
    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: { name: emailForm.name, phone: emailForm.phone, message: emailForm.message },
      });
      if (error) throw error;
      toast.success("ההודעה נשלחה בהצלחה!");
      setShowEmailForm(false);
      setEmailForm({ name: "", phone: "", message: `אשמח לקבל פרטים נוספים על הסדנה "${workshopName}"` });
    } catch (err) {
      console.error(err);
      toast.error("שגיאה בשליחה, נסו שוב או פנו בוואטסאפ");
    } finally {
      setEmailSending(false);
    }
  };


  return (
    <div className="bg-card rounded-3xl overflow-hidden">
      {/* Hero image */}
      <div className={cn("overflow-hidden relative", isPast ? "aspect-square" : "aspect-video")}>
        <img
          src={imgSrc}
          alt={w.title}
          className="w-full h-full object-cover"
          style={{ objectPosition: (w as any).detail_image_position || (w as any).image_position || "50% 50%" }}
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
        <div className="absolute bottom-5 right-5 left-5">
          <h2 className="font-heading font-bold text-2xl text-primary-foreground drop-shadow-lg">{w.title}</h2>
        </div>
      </div>

      {/* Details */}
      <div className="p-6 space-y-5">
        {/* Meta info (only for active workshops) */}
        {!isPast && (
          <div className="flex flex-wrap gap-4 text-sm">
            {w.date && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <CalendarIcon className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium">{w.date}</span>
              </div>
            )}
            {w.time && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium">{w.time}</span>
              </div>
            )}
            {w.location && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium">{w.location}</span>
              </div>
            )}
          </div>
        )}

        {/* Description */}
        {w.description && (
          <p className="text-foreground/80 leading-relaxed whitespace-pre-line">{w.description}</p>
        )}

        {/* Target audience */}
        {(w as any).target_audience && (
          <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="font-heading font-semibold text-sm text-foreground">למי מתאים?</span>
            </div>
            <p className="text-sm text-foreground/70 leading-relaxed whitespace-pre-line">{(w as any).target_audience}</p>
          </div>
        )}

        {/* Share button (always visible, even for past) */}
        {isPast && (
          <div className="flex justify-center pt-2">
            <ShareMenu workshopId={w.id} workshopTitle={w.title} className="py-2 px-4 bg-muted/50 rounded-full" />
          </div>
        )}

        {/* Action buttons (only for active workshops) */}
        {!isPast && (
          <>
            <div className="h-px bg-border/50" />
            <div className="flex flex-col gap-3">
              {paymentUrl ? (
                <Button className="w-full rounded-full h-12 text-base gap-2 shadow-lg shadow-primary/20" asChild>
                  <a href={paymentUrl} target="_blank" rel="noopener noreferrer">
                    <CreditCard className="h-4 w-4" />
                    לתשלום והרשמה
                  </a>
                </Button>
              ) : (
                <Button className="w-full rounded-full h-12 text-base gap-2 shadow-lg shadow-primary/20" onClick={() => window.open(whatsappUrl, "_blank")}>
                  <CreditCard className="h-4 w-4" />
                  הרשמה
                </Button>
              )}

              <div className="flex justify-center gap-4">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors py-1">
                  <MessageCircle className="h-3.5 w-3.5" />
                  וואטסאפ
                </a>
                <span className="text-muted-foreground/30 text-xs leading-6">|</span>
                <button onClick={() => setShowEmailForm(!showEmailForm)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors py-1">
                  <Mail className="h-3.5 w-3.5" />
                  אימייל
                </button>
                <span className="text-muted-foreground/30 text-xs leading-6">|</span>
                <ShareMenu workshopId={w.id} workshopTitle={w.title} className="py-1" />
              </div>

              {/* Inline email form */}
              <AnimatePresence>
                {showEmailForm && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    onSubmit={handleEmailSubmit}
                    className="flex flex-col gap-2.5 overflow-hidden"
                  >
                    <Input
                      placeholder="שם מלא"
                      value={emailForm.name}
                      onChange={(e) => setEmailForm({ ...emailForm, name: e.target.value })}
                      className="bg-accent/30 border-0 rounded-xl h-10 text-sm"
                    />
                    <Input
                      type="tel"
                      placeholder="טלפון"
                      value={emailForm.phone}
                      onChange={(e) => setEmailForm({ ...emailForm, phone: e.target.value })}
                      className="bg-accent/30 border-0 rounded-xl h-10 text-sm"
                    />
                    <Textarea
                      placeholder="הודעה"
                      value={emailForm.message}
                      onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
                      rows={2}
                      className="bg-accent/30 border-0 rounded-xl text-sm resize-none"
                    />
                    <Button type="submit" disabled={emailSending} size="sm" className="w-full gap-2 rounded-xl">
                      {emailSending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                      {emailSending ? "שולח..." : "שליחה"}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* Workshop Card */
function WorkshopCard({ workshop: w, isEditMode, onEdit, onView, imgSrc }: { workshop: WorkshopRow; isEditMode: boolean; onEdit: () => void; onView: () => void; imgSrc: string }) {
  return (
    <Card
      className={cn(
        "h-full rounded-3xl border-0 overflow-hidden hover-lift shadow-lg flex flex-col sm:flex-row cursor-pointer",
        isEditMode && "ring-2 ring-transparent hover:ring-primary/30 relative"
      )}
      onClick={() => isEditMode ? onEdit() : onView()}
    >
      {isEditMode && (
        <div className="absolute top-4 left-4 z-10 bg-card/90 backdrop-blur-sm rounded-full p-1.5">
          <Pencil className="h-3.5 w-3.5 text-primary" />
        </div>
      )}
      <div className="w-full sm:w-56 md:w-64 shrink-0 aspect-square sm:aspect-auto overflow-hidden">
        <img src={imgSrc} alt={w.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" style={{ objectPosition: (w as any).image_position || "50% 50%" }} loading="lazy" decoding="async" />
      </div>
      <CardContent className="pt-6 pb-6 flex flex-col justify-center flex-1">
        <h3 className="font-heading font-semibold text-xl mb-2">{w.title}</h3>
        {(w as any).short_description ? (
          <p className="text-sm text-foreground/70 mb-4 leading-relaxed">{(w as any).short_description}</p>
        ) : (
          <p className="text-sm text-muted-foreground mb-5 leading-relaxed line-clamp-3">{w.description}</p>
        )}

        <div className="flex flex-wrap gap-4 mb-5 text-sm">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10">
              <CalendarIcon className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="font-medium">{w.date}</span>
          </div>
          {w.time && (
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10">
                <Clock className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="font-medium">{w.time}</span>
            </div>
          )}
          {w.location && (
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10">
                <MapPin className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="font-medium">{w.location}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button className="flex-1 sm:flex-none rounded-full h-10 px-8 shadow-lg shadow-primary/20" onClick={(e) => { e.stopPropagation(); isEditMode ? onEdit() : onView(); }}>
            פרטים והרשמה
          </Button>
          <ShareMenu workshopId={w.id} workshopTitle={w.title} />
        </div>
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
  const [showFocalPicker, setShowFocalPicker] = useState(false);
  const [showDetailFocalPicker, setShowDetailFocalPicker] = useState(false);
  if (!value) return null;

  const parsedDate = value.date ? parseHebrewDate(value.date) : undefined;

  return (
    <div className="bg-card rounded-3xl overflow-hidden">
      {/* Image preview with upload */}
      <div className="aspect-square overflow-hidden relative">
        <img src={value.image_url || WORKSHOP_FALLBACK} alt="preview" className="w-full h-full object-cover" style={{ objectPosition: value.image_position || "50% 50%" }} />
        <ImageUpload
          currentUrl={value.image_url}
          onUpload={(url) => onChange({ ...value, image_url: url })}
          folder="workshops"
          className="bottom-20 left-4"
        />
        {value.image_url && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); setShowFocalPicker(true); }}
              className="absolute bottom-20 left-16 z-50 bg-background/90 backdrop-blur-sm rounded-full p-2 shadow-md border border-border hover:bg-background"
              title="מיקוד כרטיס (ריבוע)"
            >
              <Move className="h-4 w-4 text-foreground" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setShowDetailFocalPicker(true); }}
              className="absolute bottom-20 left-28 z-50 bg-background/90 backdrop-blur-sm rounded-full p-2 shadow-md border border-border hover:bg-background flex items-center gap-1"
              title="מיקוד תצוגה פנימית"
            >
              <FileText className="h-4 w-4 text-foreground" />
            </button>
          </>
        )}
        <FocalPointPicker
          src={value.image_url || WORKSHOP_FALLBACK}
          alt="מיקוד כרטיס"
          objectPosition={value.image_position || "50% 50%"}
          onSave={(pos) => onChange({ ...value, image_position: pos })}
          open={showFocalPicker}
          onOpenChange={setShowFocalPicker}
          fixedAspectRatio={1}
        />
        <FocalPointPicker
          src={value.image_url || WORKSHOP_FALLBACK}
          alt="מיקוד תצוגה פנימית"
          objectPosition={value.detail_image_position || "50% 50%"}
          onSave={(pos) => onChange({ ...value, detail_image_position: pos })}
          open={showDetailFocalPicker}
          onOpenChange={setShowDetailFocalPicker}
          fixedAspectRatio={value.is_active ? 16 / 9 : 1}
        />
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
        {/* Short description */}
        <FormSection icon={AlignLeft} title="תיאור קצר (מוצג בכרטיס)">
          <Input
            value={value.short_description || ""}
            onChange={(e) => onChange({ ...value, short_description: e.target.value })}
            placeholder="משפט קצר שמתאר את הסדנה..."
            className="rounded-xl border-0 bg-card h-11 shadow-sm"
          />
        </FormSection>

        {/* Description */}
        <FormSection icon={FileText} title="תיאור מלא">
          <Textarea
            value={value.description || ""}
            onChange={(e) => onChange({ ...value, description: e.target.value })}
            placeholder="תיאור מפורט של הסדנה..."
            className="rounded-xl border-0 bg-card resize-none shadow-sm"
            rows={3}
          />
        </FormSection>

        {/* Target audience */}
        {value.is_active && (
          <FormSection icon={Users} title="למי מתאים?">
            <Textarea
              value={value.target_audience || ""}
              onChange={(e) => onChange({ ...value, target_audience: e.target.value })}
              placeholder="למי הסדנה מתאימה? (למשל: מתחילים, מתקדמים, כולם...)"
              className="rounded-xl border-0 bg-card resize-none shadow-sm"
              rows={2}
            />
          </FormSection>
        )}

        {/* Date */}
        {value.is_active && (
          <FormSection icon={CalendarDays} title="תאריך">
            <div className="flex items-center gap-2 mb-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={value.date === "עדכון בקרוב"}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onChange({ ...value, date: "עדכון בקרוב" });
                    } else {
                      onChange({ ...value, date: "" });
                    }
                  }}
                  className="rounded"
                />
                <span>עדכון בקרוב (טרם נקבע תאריך)</span>
              </label>
            </div>
            {value.date !== "עדכון בקרוב" && (
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
            )}
          </FormSection>
        )}

        {/* Time range */}
        {value.is_active && (
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
        )}

        {/* Location */}
        {value.is_active && (
          <FormSection icon={MapPin} title="מיקום">
            <Input
              value={value.location || ""}
              onChange={(e) => onChange({ ...value, location: e.target.value })}
              placeholder="מיקום הסדנה"
              className="rounded-xl border-0 bg-card h-11 shadow-sm"
            />
          </FormSection>
        )}

        {/* Payment URL */}
        {value.is_active && (
          <FormSection icon={LinkIcon} title="קישור לתשלום">
            <Input
              value={value.payment_url || ""}
              onChange={(e) => onChange({ ...value, payment_url: e.target.value })}
              placeholder="https://... (קישור לדף תשלום)"
              className="rounded-xl border-0 bg-card h-11 shadow-sm text-left ltr"
              dir="ltr"
            />
            <p className="text-xs text-muted-foreground px-1">הדביקי קישור לדף תשלום – יופיע ככפתור ללקוחות</p>
          </FormSection>
        )}

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
