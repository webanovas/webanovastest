import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  label: string;
  className?: string;
}

const ImagePlaceholder = ({ label, className }: ImagePlaceholderProps) => {
  return (
    <div
      className={cn(
        "w-full h-full bg-accent/60 flex flex-col items-center justify-center gap-3 text-center p-6",
        className
      )}
    >
      <ImageIcon className="h-10 w-10 text-primary/30" />
      <span className="text-sm text-muted-foreground font-medium leading-snug max-w-[200px]">
        {label}
      </span>
    </div>
  );
};

export default ImagePlaceholder;
