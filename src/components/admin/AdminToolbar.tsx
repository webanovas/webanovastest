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
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-card/95 backdrop-blur-xl border border-border shadow-2xl rounded-full px-4 py-2.5"
      >
        <Button
          size="sm"
          variant={isEditMode ? "default" : "outline"}
          className="rounded-full gap-2 text-xs h-8"
          onClick={toggleEditMode}
        >
          {isEditMode ? <Eye className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}
          {isEditMode ? "צפייה" : "עריכה"}
        </Button>

        <Button size="sm" variant="ghost" className="rounded-full gap-2 text-xs h-8" asChild>
          <Link to="/admin">
            <Settings className="h-3.5 w-3.5" />דשבורד
          </Link>
        </Button>

        <AdminManagerDialog />

        <div className="w-px h-5 bg-border" />

        <Button
          size="sm"
          variant="ghost"
          className="rounded-full gap-2 text-xs h-8 text-muted-foreground"
          onClick={() => { signOut(); navigate("/"); }}
        >
          <LogOut className="h-3.5 w-3.5" />יציאה
        </Button>
      </motion.div>
    </AnimatePresence>
  );
};

export default AdminToolbar;
