import { useAdminMode } from "@/hooks/useAdminMode";
import ImageUpload from "./ImageUpload";

interface EditableImageProps {
  src: string;
  alt: string;
  className?: string;
  folder?: string;
  onUpload?: (url: string) => void;
}

const EditableImage = ({ src, alt, className, folder = "images", onUpload }: EditableImageProps) => {
  const { isEditMode } = useAdminMode();

  if (!isEditMode || !onUpload) {
    return <img src={src} alt={alt} className={className} />;
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

  return (
    <div className={wrapperClass}>
      <img src={src} alt={alt} className={imgClass} />
      <ImageUpload
        currentUrl={src}
        onUpload={onUpload}
        folder={folder}
        className="top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-50"
      />
    </div>
  );
};

export default EditableImage;
