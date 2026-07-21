import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useAdminMode } from "@/hooks/useAdminMode";

const FloatingContact = () => {
  const { isAdmin } = useAdminMode();
  const bottomClass = isAdmin ? "bottom-20" : "bottom-6";

  return (
    <motion.a
      href="https://wa.me/972548314247"
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed left-4 sm:left-6 z-[42] hidden md:flex items-center gap-2 text-yoga-dark shadow-lg hover:shadow-xl transition-shadow rounded-full px-5 h-12 border border-[hsl(170,25%,70%)]/30 ${bottomClass}`}
      style={{ backgroundColor: "hsl(170, 25%, 78%)" }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      aria-label="שלחו הודעת וואטסאפ"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="text-sm font-medium">וואטסאפ</span>
    </motion.a>
  );
};

export default FloatingContact;
