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
  image?: string;
}

const PageHero = ({ title, subtitle, label, image }: PageHeroProps) => {
  return (
    <section className="relative min-h-[50vh] flex items-end overflow-hidden">
      {image ? (
        <>
          <div className="absolute inset-0">
            <img src={image} alt={title} className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-yoga-dark/90 via-yoga-dark/40 to-yoga-dark/20" />
        </>
      ) : (
        <div className="absolute inset-0 page-hero-gradient" />
      )}

      <div className="container mx-auto px-4 relative z-10 pb-14 md:pb-20 pt-32">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          {label && (
            <motion.span variants={fadeUp} className={`font-medium text-sm tracking-wider uppercase mb-3 block ${image ? "text-primary-foreground/80" : "text-primary"}`}>
              {label}
            </motion.span>
          )}
          <motion.h1 variants={fadeUp} className={`font-heading text-4xl md:text-6xl font-extrabold mb-4 tracking-tight ${image ? "text-primary-foreground" : ""}`}>
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p variants={fadeUp} className={`text-lg max-w-xl ${image ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
              {subtitle}
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default PageHero;
