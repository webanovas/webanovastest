import { createContext, useContext, useState, ReactNode } from "react";
import { useAuth } from "./useAuth";

interface AdminModeContextType {
  isEditMode: boolean;
  toggleEditMode: () => void;
  isAdmin: boolean;
}

const AdminModeContext = createContext<AdminModeContextType | undefined>(undefined);

export const AdminModeProvider = ({ children }: { children: ReactNode }) => {
  const { isAdmin } = useAuth();
  const [isEditMode, setIsEditMode] = useState(false);

  const toggleEditMode = () => setIsEditMode((prev) => !prev);

  return (
    <AdminModeContext.Provider value={{ isEditMode: isAdmin && isEditMode, toggleEditMode, isAdmin }}>
      {children}
    </AdminModeContext.Provider>
  );
};

export const useAdminMode = () => {
  const ctx = useContext(AdminModeContext);
  if (!ctx) throw new Error("useAdminMode must be used within AdminModeProvider");
  return ctx;
};
