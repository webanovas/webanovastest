import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png";

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<"logo" | "exit">("logo");

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase("exit"), 1800);
    const timer2 = setTimeout(() => onComplete(), 2400);
    return () => { clearTimeout(timer1); clearTimeout(timer2); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "exit" ? null : null}
      <motion.div
        key="splash"
        initial={{ opacity: 1 }}
        animate={phase === "exit" ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
      >
        {/* Subtle radial glow behind logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.15, scale: 1.2 }}
          transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
          className="absolute w-80 h-80 rounded-full bg-primary/30 blur-3xl"
        />

        {/* Logo */}
        <motion.img
          src={logo}
          alt="יוגה במושבה"
          className="relative w-36 h-36 md:w-44 md:h-44 object-contain drop-shadow-lg"
          initial={{ opacity: 0, scale: 0.85, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        />

        {/* Subtle line beneath */}
        <motion.div
          className="absolute bottom-[38%] h-px bg-primary/20"
          initial={{ width: 0 }}
          animate={{ width: "6rem" }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.7 }}
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashScreen;
