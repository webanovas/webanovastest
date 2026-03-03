import { useState } from "react";
import { useAdminMode } from "@/hooks/useAdminMode";
import ImageUpload from "./ImageUpload";
import FocalPointPicker from "./FocalPointPicker";
import { Move } from "lucide-react";

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

  const posStyle = objectPosition ? { objectPosition } : undefined;

  if (!isEditMode || !onUpload) {
    return <img src={src} alt={alt} className={className} style={posStyle} />;
  }

  // Check if the image uses absolute positioning — if so, apply it to the wrapper
  const isAbsolute = className?.includes("absolute");
  const wrapperClass = isAbsolute
    ? "absolute inset-0 group"
    : "relative group";
  // Remove absolute/inset from image class since wrapper handles it
  const imgClass = isAbsolute
    ? className?.replace(/absolute/, "").replace(/inset-0/, "").trim() + " w-full h-full"
    : className;

  const hasObjectCover = className?.includes("object-cover");

  return (
    <div className={wrapperClass}>
      <img src={src} alt={alt} className={imgClass} style={posStyle} />
      <ImageUpload
        currentUrl={src}
        onUpload={onUpload}
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
            onSave={onPositionChange}
            open={showFocalPicker}
            onOpenChange={setShowFocalPicker}
          />
        </>
      )}
    </div>
  );
};

export default EditableImage;
