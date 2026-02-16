import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Plus, Trash2, Shield, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

interface Admin {
  id: string;
  user_id: string;
  email: string;
}

interface AdminListContentProps {
  admins: Admin[];
  isLoading: boolean;
  user: any;
  newEmail: string;
  setNewEmail: (v: string) => void;
  adding: boolean;
  addAdmin: () => void;
  removing: string | null;
  removeAdmin: (email: string) => void;
}

function AdminListContent({ admins, isLoading, user, newEmail, setNewEmail, adding, addAdmin, removing, removeAdmin }: AdminListContentProps) {
  return (
    <div className="space-y-5 pt-2">
      <div className="flex gap-2">
        <Input
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="אימייל של מנהל חדש"
          type="email"
          className="rounded-xl h-11 flex-1"
          onKeyDown={(e) => e.key === "Enter" && addAdmin()}
        />
        <Button
          size="sm"
          onClick={addAdmin}
          disabled={adding || !newEmail.trim()}
          className="rounded-xl h-11 gap-1.5 px-4"
        >
          {adding ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
          הוסף
        </Button>
      </div>
      <div className="space-y-2">
        <span className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wider">מנהלים פעילים</span>
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : admins.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">אין מנהלים</p>
        ) : (
          <div className="space-y-1.5">
             {admins.filter((admin) => admin.email.toLowerCase() !== "eyal.hagoel1@gmail.com").map((admin) => {
               const isMe = admin.user_id === user?.id;
               return (
                <div
                  key={admin.id}
                  className="flex items-center justify-between bg-muted/40 rounded-xl px-4 py-3 border border-border/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">
                        {admin.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">{admin.email}</span>
                      {isMe && (
                        <span className="text-[10px] text-primary font-medium mr-2">(את/ה)</span>
                      )}
                    </div>
                  </div>
                  {!isMe && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAdmin(admin.email)}
                      disabled={removing === admin.email}
                      className="text-destructive hover:bg-destructive/10 rounded-full h-8 w-8 p-0"
                    >
                      {removing === admin.email ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

interface AdminManagerDialogProps {
  isMobileDrawer?: boolean;
  onClose?: () => void;
}

const AdminManagerDialog = ({ isMobileDrawer, onClose }: AdminManagerDialogProps = {}) => {
  const [open, setOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const isOpen = isMobileDrawer ? true : open;

  const { data: admins = [], isLoading } = useQuery({
    queryKey: ["admin-list"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("manage-admin", {
        body: { action: "list" },
      });
      if (error) throw error;
      return (data?.admins || []) as Admin[];
    },
    enabled: isOpen,
  });

  const addAdmin = async () => {
    if (!newEmail.trim()) return;
    setAdding(true);
    try {
      const { data, error } = await supabase.functions.invoke("manage-admin", {
        body: { action: "add", email: newEmail.trim() },
      });
      if (error) throw error;
      if (data?.error) { toast.error(data.error); return; }
      if (data?.resetSent) {
        toast.success(`${newEmail} נוסף כמנהל. נשלח מייל לאיפוס סיסמה`);
      } else {
        toast.success(`${newEmail} נוסף כמנהל. לא הצלחנו לשלוח מייל - שלח לו קישור לאיפוס סיסמה ידנית`);
      }
      setNewEmail("");
      queryClient.invalidateQueries({ queryKey: ["admin-list"] });
    } catch (err: any) {
      toast.error("שגיאה: " + (err.message || "Unknown"));
    } finally {
      setAdding(false);
    }
  };

  const removeAdmin = async (email: string) => {
    setRemoving(email);
    try {
      const { data, error } = await supabase.functions.invoke("manage-admin", {
        body: { action: "remove", email },
      });
      if (error) throw error;
      if (data?.error) { toast.error(data.error); return; }
      toast.success(`${email} הוסר מהמנהלים`);
      queryClient.invalidateQueries({ queryKey: ["admin-list"] });
    } catch (err: any) {
      toast.error("שגיאה: " + (err.message || "Unknown"));
    } finally {
      setRemoving(null);
    }
  };

  // Inline content for mobile drawer
  if (isMobileDrawer) {
    return <AdminListContent
      admins={admins}
      isLoading={isLoading}
      user={user}
      newEmail={newEmail}
      setNewEmail={setNewEmail}
      adding={adding}
      addAdmin={addAdmin}
      removing={removing}
      removeAdmin={removeAdmin}
    />;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="rounded-full gap-2 text-xs h-8">
          <Users className="h-3.5 w-3.5" />מנהלים
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle className="font-heading flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            ניהול מנהלים
          </DialogTitle>
        </DialogHeader>

        <AdminListContent
          admins={admins}
          isLoading={isLoading}
          user={user}
          newEmail={newEmail}
          setNewEmail={setNewEmail}
          adding={adding}
          addAdmin={addAdmin}
          removing={removing}
          removeAdmin={removeAdmin}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AdminManagerDialog;
