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

  return (
    <div className="relative group">
      <img src={src} alt={alt} className={className} />
      <ImageUpload
        currentUrl={src}
        onUpload={onUpload}
        folder={folder}
        className="top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </div>
  );
};

export default EditableImage;
