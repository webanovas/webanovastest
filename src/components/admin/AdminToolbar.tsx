import { useAdminMode } from "@/hooks/useAdminMode";
import { useAuth } from "@/hooks/useAuth";
import { Pencil, Eye, LogOut, Settings, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AdminManagerDialog from "./AdminManagerDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Shield } from "lucide-react";

const AdminToolbar = () => {
  const { isAdmin, isEditMode, toggleEditMode } = useAdminMode();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!isAdmin) return null;

  // Mobile: compact FAB-style toolbar with drawer for more options
  if (isMobile) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 inset-x-0 mx-auto z-50 flex items-center justify-center gap-1.5 bg-card/95 backdrop-blur-xl border border-border shadow-2xl rounded-full px-2.5 py-2 w-fit max-w-[calc(100vw-2rem)]"
        >
          <Button
            size="sm"
            variant={isEditMode ? "default" : "outline"}
            className="rounded-full gap-1.5 text-xs h-10 px-3.5 shrink-0"
            onClick={toggleEditMode}
          >
            {isEditMode ? <Eye className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
            {isEditMode ? "צפייה" : "עריכה"}
          </Button>

          <Button size="sm" variant="ghost" className="rounded-full h-10 w-10 p-0 shrink-0" asChild>
            <Link to="/admin">
              <Settings className="h-4 w-4" />
            </Link>
          </Button>

          <Drawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <DrawerTrigger asChild>
              <Button size="sm" variant="ghost" className="rounded-full h-10 w-10 p-0 shrink-0">
                <Users className="h-4 w-4" />
              </Button>
            </DrawerTrigger>
            <DrawerContent dir="rtl">
              <DrawerHeader>
                <DrawerTitle className="font-heading flex items-center gap-2 justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                  ניהול מנהלים
                </DrawerTitle>
              </DrawerHeader>
              <div className="px-4 pb-6">
                <AdminManagerDialog isMobileDrawer onClose={() => setMobileMenuOpen(false)} />
              </div>
            </DrawerContent>
          </Drawer>

          <div className="w-px h-5 bg-border shrink-0" />

          <Button
            size="sm"
            variant="ghost"
            className="rounded-full h-10 w-10 p-0 text-muted-foreground shrink-0"
            onClick={() => { signOut(); navigate("/"); }}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Desktop
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
          className="rounded-full gap-2 text-xs h-8 px-3 shrink-0"
          onClick={toggleEditMode}
        >
          {isEditMode ? <Eye className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}
          {isEditMode ? "צפייה" : "עריכה"}
        </Button>

        <Button size="sm" variant="ghost" className="rounded-full gap-2 text-xs h-8 shrink-0" asChild>
          <Link to="/admin">
            <Settings className="h-3.5 w-3.5" />
            דשבורד
          </Link>
        </Button>

        <AdminManagerDialog />

        <div className="w-px h-5 bg-border shrink-0" />

        <Button
          size="sm"
          variant="ghost"
          className="rounded-full gap-2 text-xs h-8 text-muted-foreground shrink-0"
          onClick={() => { signOut(); navigate("/"); }}
        >
          <LogOut className="h-3.5 w-3.5" />
          יציאה
        </Button>
      </motion.div>
    </AnimatePresence>
  );
};

export default AdminToolbar;
