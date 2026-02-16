import { useAdminMode } from "@/hooks/useAdminMode";
import { useAuth } from "@/hooks/useAuth";
import { Pencil, Eye, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AdminManagerDialog from "./AdminManagerDialog";

const AdminToolbar = () => {
  const { isAdmin, isEditMode, toggleEditMode } = useAdminMode();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  if (!isAdmin) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 md:gap-2 bg-card/95 backdrop-blur-xl border border-border shadow-2xl rounded-full px-3 md:px-4 py-2 md:py-2.5 max-w-[95vw] overflow-x-auto"
      >
        <Button
          size="sm"
          variant={isEditMode ? "default" : "outline"}
          className="rounded-full gap-1.5 md:gap-2 text-xs h-9 md:h-8 px-3 md:px-3 shrink-0"
          onClick={toggleEditMode}
        >
          {isEditMode ? <Eye className="h-4 w-4 md:h-3.5 md:w-3.5" /> : <Pencil className="h-4 w-4 md:h-3.5 md:w-3.5" />}
          {isEditMode ? "צפייה" : "עריכה"}
        </Button>

        <Button size="sm" variant="ghost" className="rounded-full gap-1.5 md:gap-2 text-xs h-9 md:h-8 shrink-0" asChild>
          <Link to="/admin">
            <Settings className="h-4 w-4 md:h-3.5 md:w-3.5" />
            <span className="hidden sm:inline">דשבורד</span>
          </Link>
        </Button>

        <div className="hidden sm:block">
          <AdminManagerDialog />
        </div>

        <div className="w-px h-5 bg-border shrink-0" />

        <Button
          size="sm"
          variant="ghost"
          className="rounded-full gap-1.5 md:gap-2 text-xs h-9 md:h-8 text-muted-foreground shrink-0"
          onClick={() => { signOut(); navigate("/"); }}
        >
          <LogOut className="h-4 w-4 md:h-3.5 md:w-3.5" />
          <span className="hidden sm:inline">יציאה</span>
        </Button>
      </motion.div>
    </AnimatePresence>
  );
};

export default AdminToolbar;
