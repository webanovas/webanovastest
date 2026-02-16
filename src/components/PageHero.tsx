import { motion } from "framer-motion";
import { useAdminMode } from "@/hooks/useAdminMode";
import { usePageContent } from "@/hooks/usePageContent";
import EditableText from "@/components/admin/EditableText";

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
  page?: string;
  titleSection?: string;
  subtitleSection?: string;
  labelSection?: string;
}

const PageHero = ({ title, subtitle, label, image, page, titleSection, subtitleSection, labelSection }: PageHeroProps) => {
  const { isEditMode } = useAdminMode();
  const { getText, saveText } = usePageContent(page || "");

  const resolvedLabel = page && labelSection ? getText(labelSection, label || "") : label;
  const resolvedTitle = page && titleSection ? getText(titleSection, title) : title;
  const resolvedSubtitle = page && subtitleSection ? getText(subtitleSection, subtitle || "") : subtitle;

  return (
    <section className="relative min-h-[50vh] flex items-end overflow-hidden">
      {image ? (
        <>
          <div className="absolute inset-0">
            <img src={image} alt={resolvedTitle} className="w-full h-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-yoga-dark/90 via-yoga-dark/40 to-yoga-dark/20" />
        </>
      ) : (
        <div className="absolute inset-0 page-hero-gradient" />
      )}

      <div className="container mx-auto px-4 relative z-10 pb-14 md:pb-20 pt-32">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          {resolvedLabel && (
            <motion.div variants={fadeUp}>
              {isEditMode && page && labelSection ? (
                <EditableText
                  value={resolvedLabel}
                  onSave={(v) => saveText(labelSection, v)}
                  as="span"
                  className={`font-medium text-sm tracking-wider uppercase mb-3 block ${image ? "text-primary-foreground/80" : "text-primary"}`}
                />
              ) : (
                <span className={`font-medium text-sm tracking-wider uppercase mb-3 block ${image ? "text-primary-foreground/80" : "text-primary"}`}>
                  {resolvedLabel}
                </span>
              )}
            </motion.div>
          )}
          <motion.div variants={fadeUp}>
            {isEditMode && page && titleSection ? (
              <EditableText
                value={resolvedTitle}
                onSave={(v) => saveText(titleSection, v)}
                as="h1"
                className={`font-heading text-4xl md:text-6xl font-extrabold mb-4 tracking-tight ${image ? "text-primary-foreground" : ""}`}
              />
            ) : (
              <h1 className={`font-heading text-4xl md:text-6xl font-extrabold mb-4 tracking-tight ${image ? "text-primary-foreground" : ""}`}>
                {resolvedTitle}
              </h1>
            )}
          </motion.div>
          {resolvedSubtitle && (
            <motion.div variants={fadeUp}>
              {isEditMode && page && subtitleSection ? (
                <EditableText
                  value={resolvedSubtitle}
                  onSave={(v) => saveText(subtitleSection, v)}
                  as="p"
                  className={`text-lg max-w-xl ${image ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                />
              ) : (
                <p className={`text-lg max-w-xl ${image ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {resolvedSubtitle}
                </p>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default PageHero;
