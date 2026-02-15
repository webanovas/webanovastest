import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, User } from "lucide-react";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי"];

const Schedule = () => {
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

  const classesByDay = days.reduce((acc, day) => {
    acc[day] = classes.filter((c) => c.day === day);
    return acc;
  }, {} as Record<string, typeof classes>);

  const hasClasses = classes.length > 0;
  const hasTeachers = teachers.length > 0;

  return (
    <Layout>
      <PageHero
        label="לוח שיעורים"
        title="מערכת שעות ומורים"
        subtitle="הצטרפו לשיעור שמתאים לכם – בסטודיו או בזום"
      />

      {/* Schedule */}
      <section className="py-24 md:py-36">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block">שבועי</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold">לוח שיעורים</h2>
          </div>

          {!hasClasses ? (
            <p className="text-center text-muted-foreground">לוח השיעורים יעודכן בקרוב</p>
          ) : (
            <Tabs defaultValue="ראשון" dir="rtl" className="max-w-3xl mx-auto">
              <TabsList className="flex flex-wrap justify-center gap-1.5 mb-10 h-auto bg-transparent">
                {days.map((day) => (
                  <TabsTrigger key={day} value={day} className="px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full font-medium">
                    {day}
                  </TabsTrigger>
                ))}
              </TabsList>

              {days.map((day) => (
                <TabsContent key={day} value={day}>
                  <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col gap-4">
                    {classesByDay[day]?.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">אין שיעורים ביום זה</p>
                    ) : (
                      classesByDay[day]?.map((cls) => (
                        <motion.div key={cls.id} variants={fadeUp}>
                          <Card className="rounded-2xl border-border/30 hover-lift shadow-sm">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between flex-wrap gap-3">
                                <div>
                                  <h3 className="font-heading font-semibold text-lg">{cls.name}</h3>
                                  <p className="text-sm text-muted-foreground mt-1">{cls.description}</p>
                                </div>
                                <div className="flex flex-col items-end gap-1.5 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-2 bg-accent px-3 py-1 rounded-full">
                                    <Clock className="h-3.5 w-3.5" /> {cls.time}
                                  </span>
                                  <span className="flex items-center gap-2">
                                    <User className="h-3.5 w-3.5" /> {cls.teacher}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </section>

      {/* Teachers */}
      <section className="py-24 md:py-36 bg-yoga-cream relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block">הצוות</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold">המורים שלנו</h2>
          </div>

          {!hasTeachers ? (
            <p className="text-center text-muted-foreground">המורים יעודכנו בקרוב</p>
          ) : (
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {teachers.map((t) => (
                <motion.div key={t.id} variants={fadeUp}>
                  <Card className="text-center h-full rounded-3xl border-0 overflow-hidden hover-lift shadow-lg">
                    <div className="aspect-[3/4] overflow-hidden">
                      <ImagePlaceholder label="תמונת מורה" />
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
    </Layout>
  );
};

export default Schedule;
