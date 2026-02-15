import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, isAdmin, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect when logged in as admin
  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      navigate("/admin", { replace: true });
    }
  }, [user, isAdmin, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (isSignup) {
      const { error } = await (await import("@/integrations/supabase/client")).supabase.auth.signUp({ email, password });
      if (error) {
        toast.error("שגיאה בהרשמה: " + error.message);
      } else {
        toast.success("נרשמת בהצלחה! מתחבר...");
        const { error: signInError } = await signIn(email, password);
        if (signInError) {
          toast.error("שגיאה בהתחברות: " + signInError.message);
        }
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error("שגיאה בהתחברות – בדקו אימייל וסיסמה");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4" dir="rtl">
      <Card className="w-full max-w-sm rounded-2xl shadow-lg border-0">
        <CardContent className="pt-8 pb-8 px-6">
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h1 className="font-heading text-xl font-bold text-center mb-6">כניסת מנהל</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="email"
              placeholder="אימייל"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-xl h-11"
              dir="ltr"
            />
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="סיסמה"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-xl h-11 pr-3 pl-10"
                dir="ltr"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Button type="submit" disabled={loading} className="rounded-full h-11 mt-2">
              {loading ? "מתחבר..." : isSignup ? "הרשמה" : "כניסה"}
            </Button>
            <button
              type="button"
              onClick={() => setIsSignup(!isSignup)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {isSignup ? "יש לך חשבון? התחבר" : "אין לך חשבון? הירשם"}
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
