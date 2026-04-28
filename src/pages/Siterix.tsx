import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import siterixLogo from "@/assets/siterix-logo.png";

const SITERIX_URL = "https://siterixstudios.com";
const REDIRECT_DELAY_MS = 4000;

const Siterix = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    document.title = "נבנה ע\"י Siterix Studios";
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.min(100, (elapsed / REDIRECT_DELAY_MS) * 100));
    }, 30);
    const timer = setTimeout(() => {
      navigate("/", { replace: true });
    }, REDIRECT_DELAY_MS);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/10 px-6 overflow-hidden relative">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-accent/20 blur-3xl" />

      <AnimatePresence>
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center text-center max-w-xl"
        >
          {/* Logo mark */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full" />
              <img
                src={siterixLogo}
                alt="Siterix Studios"
                className="relative w-32 h-32 md:w-40 md:h-40 rounded-full shadow-2xl"
              />
            </div>
          </motion.div>

          {/* Brand name */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-3"
          >
            Siterix <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Studios</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-base md:text-lg text-muted-foreground mb-8"
            dir="rtl"
          >
            האתר הזה נבנה ועוצב ע"י Siterix Studios
          </motion.p>

          {/* CTA */}
          <motion.a
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            href={SITERIX_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition shadow-lg mb-8"
          >
            בקרו באתר שלנו
            <span aria-hidden>↗</span>
          </motion.a>

          {/* Progress bar to redirect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="w-full max-w-xs"
          >
            <div className="h-1 w-full rounded-full bg-foreground/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary/60 transition-[width] duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-muted-foreground" dir="rtl">
              מעבירים אתכם לאתר...{" "}
              <button
                onClick={() => navigate("/", { replace: true })}
                className="underline hover:text-foreground transition"
              >
                דלג
              </button>
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Siterix;
