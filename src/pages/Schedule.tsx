import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, User } from "lucide-react";

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
  { name: "שירה פלג", role: "בעלת הסטודיו ומורה בכירה", desc: "מלמדת יוגה מעל 10 שנים בגישה אישית וקשובה." },
  { name: "מיכל לוי", role: "מורה ליוגה ומדיטציה", desc: "מתמחה ביוגה עדינה, יין ונשימות." },
  { name: "נועה כהן", role: "מורה ליוגה למתחילים", desc: "מאמינה שכל אחד יכול לתרגל, ללא קשר לרמה." },
];

const Schedule = () => {
  return (
    <Layout>
      {/* Header */}
      <section className="bg-yoga-sage-light py-16 md:py-20">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">מערכת שעות ומורים</h1>
          <p className="text-muted-foreground text-lg">הצטרפו לשיעור שמתאים לכם – בסטודיו או בזום</p>
        </div>
      </section>

      {/* Schedule */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold text-center mb-10">לוח שיעורים שבועי</h2>

          <Tabs defaultValue="ראשון" dir="rtl" className="max-w-3xl mx-auto">
            <TabsList className="flex flex-wrap justify-center gap-1 mb-8 h-auto bg-transparent">
              {days.map((day) => (
                <TabsTrigger
                  key={day}
                  value={day}
                  className="px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full"
                >
                  {day}
                </TabsTrigger>
              ))}
            </TabsList>

            {days.map((day) => (
              <TabsContent key={day} value={day}>
                <motion.div initial="hidden" animate="visible" variants={stagger} className="flex flex-col gap-4">
                  {scheduleData[day]?.map((cls, i) => (
                    <motion.div key={i} variants={fadeUp}>
                      <Card className="border-border/50 hover:shadow-md transition-shadow">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between flex-wrap gap-2">
                            <div>
                              <h3 className="font-heading font-semibold text-lg">{cls.name}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{cls.desc}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" /> {cls.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <User className="h-4 w-4" /> {cls.teacher}
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
      <section className="py-16 md:py-24 bg-yoga-cream">
        <div className="container mx-auto px-4">
          <h2 className="font-heading text-3xl font-bold text-center mb-10">המורים שלנו</h2>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {teachers.map((t) => (
              <motion.div key={t.name} variants={fadeUp}>
                <Card className="text-center h-full border-border/50">
                  <CardContent className="pt-8 pb-6 flex flex-col items-center gap-3">
                    <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center mb-2">
                      <span className="text-muted-foreground text-xs">תמונה</span>
                    </div>
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
