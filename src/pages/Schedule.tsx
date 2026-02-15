import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, User } from "lucide-react";
import ImagePlaceholder from "@/components/ImagePlaceholder";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי"];

const scheduleData: Record<string, { time: string; name: string; teacher: string; desc: string }[]> = {
  "ראשון": [
    { time: "08:00", name: "ויניאסה בוקר", teacher: "שירה פלג", desc: "שיעור זורם ומעורר לתחילת השבוע" },
    { time: "19:00", name: "יוגה עדינה", teacher: "מיכל לוי", desc: "תרגול רגוע ומרגיע לסיום היום" },
  ],
  "שני": [
    { time: "09:30", name: "האטה יוגה", teacher: "שירה פלג", desc: "החזקת תנוחות לעומק והרפיה" },
    { time: "18:30", name: "יוגה למתחילים", teacher: "נועה כהן", desc: "שיעור בסיסי לכל מי שמתחיל את הדרך" },
  ],
  "שלישי": [
    { time: "07:30", name: "ויניאסה דינמי", teacher: "שירה פלג", desc: "תרגול אנרגטי וחזק" },
    { time: "20:00", name: "יוגה זום", teacher: "מיכל לוי", desc: "שיעור אונליין מהבית" },
  ],
  "רביעי": [
    { time: "09:00", name: "יוגה בוקר", teacher: "נועה כהן", desc: "התחלה רכה ונעימה ליום" },
    { time: "19:00", name: "יין יוגה", teacher: "שירה פלג", desc: "תרגול עדין עם אביזרים ונשימות" },
  ],
  "חמישי": [
    { time: "08:00", name: "פרנאיאמה ומדיטציה", teacher: "שירה פלג", desc: "נשימות ומדיטציה מודרכת" },
    { time: "18:00", name: "ויניאסה ערב", teacher: "מיכל לוי", desc: "זרימה ערבית להורדת מתחים" },
  ],
};

const teachers = [
  { name: "שירה פלג", role: "בעלת הסטודיו ומורה בכירה", desc: "מלמדת יוגה מעל 10 שנים בגישה אישית וקשובה.", imageLabel: "תמונת מורה 1" },
  { name: "מיכל לוי", role: "מורה ליוגה ומדיטציה", desc: "מתמחה ביוגה עדינה, יין ונשימות.", imageLabel: "תמונת מורה 2" },
  { name: "נועה כהן", role: "מורה ליוגה למתחילים", desc: "מאמינה שכל אחד יכול לתרגל, ללא קשר לרמה.", imageLabel: "תמונת מורה 3" },
];

const Schedule = () => {
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
                  {scheduleData[day]?.map((cls, i) => (
                    <motion.div key={i} variants={fadeUp}>
                      <Card className="rounded-2xl border-border/30 hover-lift shadow-sm">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between flex-wrap gap-3">
                            <div>
                              <h3 className="font-heading font-semibold text-lg">{cls.name}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{cls.desc}</p>
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
                  ))}
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Teachers */}
      <section className="py-24 md:py-36 bg-yoga-cream relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block">הצוות</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold">המורים שלנו</h2>
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {teachers.map((t) => (
              <motion.div key={t.name} variants={fadeUp}>
                <Card className="text-center h-full rounded-3xl border-0 overflow-hidden hover-lift shadow-lg">
                  <div className="aspect-[3/4] overflow-hidden">
                    <ImagePlaceholder label={t.imageLabel} />
                  </div>
                  <CardContent className="pt-6 pb-8 flex flex-col items-center gap-2">
                    <h3 className="font-heading font-semibold text-lg">{t.name}</h3>
                    <p className="text-primary text-sm font-medium">{t.role}</p>
                    <p className="text-muted-foreground text-sm">{t.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Schedule;
