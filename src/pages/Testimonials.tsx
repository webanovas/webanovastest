import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import PageHero from "@/components/PageHero";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const Testimonials = () => {
  const { data: testimonials = [] } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data } = await supabase.from("testimonials").select("*").order("sort_order");
      return data ?? [];
    },
  });

  return (
    <Layout>
      <PageHero
        label="המלצות"
        title="מילים חמות"
        subtitle="מה אומרים המתרגלים שלנו"
      />

      <section className="py-24 md:py-36">
        <div className="container mx-auto px-4">
          {testimonials.length === 0 ? (
            <p className="text-center text-muted-foreground">מילים חמות יעודכנו בקרוב</p>
          ) : (
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {testimonials.map((t) => (
                <motion.div key={t.id} variants={fadeUp}>
                  <Card className="h-full rounded-3xl border-0 shadow-md hover-lift bg-card">
                    <CardContent className="pt-8 pb-8 px-8">
                      <Quote className="h-8 w-8 text-primary/20 mb-4" />
                      <p className="text-foreground/80 leading-relaxed mb-6">{t.text}</p>
                      <div className="flex items-center gap-3 pt-4 border-t border-border">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-heading font-bold text-primary text-sm">{t.name.charAt(0)}</span>
                        </div>
                        <span className="font-heading font-medium text-sm">{t.name}</span>
                      </div>
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

export default Testimonials;
