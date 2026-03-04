import { useState, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Move } from "lucide-react";

interface FocalPointPickerProps {
  src: string;
  alt: string;
  objectPosition: string;
  onSave: (position: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FocalPointPicker = ({ src, alt, objectPosition, onSave, open, onOpenChange }: FocalPointPickerProps) => {
  const [position, setPosition] = useState(() => {
    const parts = objectPosition.split(" ");
    return {
      x: parseFloat(parts[0]) || 50,
      y: parseFloat(parts[1]) || 50,
    };
  });
  const [dragging, setDragging] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setPosition({ x: Math.round(x), y: Math.round(y) });
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    updatePosition(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging) updatePosition(e);
  };

  const handleMouseUp = () => setDragging(false);

  const handleSave = () => {
    onSave(`${position.x}% ${position.y}%`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="font-heading">מיקום מוקד התמונה</DialogTitle>
          <p className="text-sm text-muted-foreground">לחצו על התמונה כדי לבחור את הנקודה שתישאר במרכז כשהתמונה נחתכת</p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Full image with focal point */}
          <div
            ref={imgRef}
            className="relative cursor-crosshair rounded-lg overflow-hidden border border-border select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img src={src} alt={alt} className="w-full h-auto block" draggable={false} />
            {/* Focal point indicator */}
            <div
              className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
              style={{ left: `${position.x}%`, top: `${position.y}%` }}
            >
              <div className="absolute inset-0 rounded-full border-2 border-white shadow-lg" />
              <div className="absolute inset-[6px] rounded-full bg-primary/80" />
            </div>
            {/* Crosshair lines */}
            <div
              className="absolute top-0 bottom-0 w-px bg-white/40 pointer-events-none"
              style={{ left: `${position.x}%` }}
            />
            <div
              className="absolute left-0 right-0 h-px bg-white/40 pointer-events-none"
              style={{ top: `${position.y}%` }}
            />
          </div>

          {/* Preview strips showing how the crop looks */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">תצוגה רחבה</p>
              <div className="aspect-[16/9] rounded-md overflow-hidden border border-border bg-muted">
                <img
                  src={src}
                  alt="preview"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: `${position.x}% ${position.y}%` }}
                />
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">תצוגה מרובעת</p>
              <div className="aspect-square rounded-md overflow-hidden border border-border bg-muted">
                <img
                  src={src}
                  alt="preview"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: `${position.x}% ${position.y}%` }}
                />
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">תצוגה גבוהה</p>
              <div className="aspect-[3/4] rounded-md overflow-hidden border border-border bg-muted">
                <img
                  src={src}
                  alt="preview"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: `${position.x}% ${position.y}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center sticky bottom-0 bg-card/95 backdrop-blur-sm pt-3 pb-1">
            <span className="text-xs text-muted-foreground">
              מיקום: {position.x}% / {position.y}%
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => { setPosition({ x: 50, y: 50 }); }}>
                איפוס למרכז
              </Button>
              <Button size="sm" onClick={handleSave}>
                שמירה
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FocalPointPicker;
