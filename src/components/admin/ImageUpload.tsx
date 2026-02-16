import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Camera, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  currentUrl: string | null;
  onUpload: (url: string) => void;
  folder: string;
  className?: string;
  children?: React.ReactNode;
}

const ImageUpload = ({ currentUrl, onUpload, folder, className, children }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("יש לבחור קובץ תמונה");
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${folder}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("site-images")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("site-images")
        .getPublicUrl(fileName);

      onUpload(publicUrl);
      toast.success("התמונה הועלתה");
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error("שגיאה בהעלאה: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
      <button
        onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
        disabled={uploading}
        className={cn(
          "absolute z-20 bg-primary text-primary-foreground rounded-full p-2.5 shadow-lg hover:bg-primary/90 transition-all",
          "opacity-80 hover:opacity-100",
          uploading && "opacity-50 cursor-wait",
          className
        )}
      >
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Camera className="h-4 w-4" />
        )}
      </button>
      {children}
    </>
  );
};

export default ImageUpload;
