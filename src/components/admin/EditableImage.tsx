import { useState } from "react";
import { useAdminMode } from "@/hooks/useAdminMode";
import ImageUpload from "./ImageUpload";
import FocalPointPicker from "./FocalPointPicker";
import { Move, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface EditableImageProps {
  src: string;
  alt: string;
  className?: string;
  folder?: string;
  onUpload?: (url: string) => void;
  objectPosition?: string;
  onPositionChange?: (position: string) => void;
}

const EditableImage = ({ src, alt, className, folder = "images", onUpload, objectPosition, onPositionChange }: EditableImageProps) => {
  const { isEditMode } = useAdminMode();
  const [showFocalPicker, setShowFocalPicker] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const posStyle = objectPosition ? { objectPosition } : undefined;

  if (!isEditMode || !onUpload) {
    return <img src={src} alt={alt} className={className} style={posStyle} />;
  }

  const isAbsolute = className?.includes("absolute");
  const wrapperClass = isAbsolute
    ? "absolute inset-0 group"
    : "relative group";
  const imgClass = isAbsolute
    ? className?.replace(/absolute/, "").replace(/inset-0/, "").trim() + " w-full h-full"
    : className;

  const hasObjectCover = className?.includes("object-cover");

  const handleUpload = (url: string) => {
    onUpload(url);
    setHasChanges(true);
  };

  const handlePositionChange = (pos: string) => {
    onPositionChange?.(pos);
    setHasChanges(true);
  };

  const handleDone = () => {
    setHasChanges(false);
    toast.success("השינויים נשמרו");
  };

  return (
    <div className={wrapperClass}>
      <img src={src} alt={alt} className={imgClass} style={posStyle} />
      <ImageUpload
        currentUrl={src}
        onUpload={handleUpload}
        folder={folder}
        className="top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-50"
      />
      {hasObjectCover && onPositionChange && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); setShowFocalPicker(true); }}
            className="absolute top-3 right-14 opacity-0 group-hover:opacity-100 transition-opacity z-50 bg-background/90 backdrop-blur-sm rounded-full p-2 shadow-md border border-border hover:bg-background"
            title="מיקום מוקד התמונה"
          >
            <Move className="h-4 w-4 text-foreground" />
          </button>
          <FocalPointPicker
            src={src}
            alt={alt}
            objectPosition={objectPosition || "50% 50%"}
            onSave={(pos) => { handlePositionChange(pos); }}
            open={showFocalPicker}
            onOpenChange={setShowFocalPicker}
          />
        </>
      )}
      {hasChanges && (
        <Button
          size="sm"
          className="absolute bottom-3 left-1/2 -translate-x-1/2 z-50 rounded-full gap-1.5 shadow-lg px-5"
          onClick={(e) => { e.stopPropagation(); handleDone(); }}
        >
          <Check className="h-3.5 w-3.5" />
          שמירה וסגירה
        </Button>
      )}
    </div>
  );
};

export default EditableImage;
