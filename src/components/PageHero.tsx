import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

interface PageHeroProps {
  title: string;
  subtitle?: string;
  label?: string;
}

const PageHero = ({ title, subtitle, label }: PageHeroProps) => {
  return (
    <section className="page-hero-gradient pt-28 md:pt-36 pb-16 md:pb-20 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 right-10 w-32 h-32 rounded-full bg-yoga-sand/30 blur-2xl" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          {label && (
            <motion.span variants={fadeUp} className="text-primary font-medium text-sm tracking-wider uppercase mb-3 block">
              {label}
            </motion.span>
          )}
          <motion.h1 variants={fadeUp} className="font-heading text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p variants={fadeUp} className="text-muted-foreground text-lg max-w-xl">
              {subtitle}
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default PageHero;
