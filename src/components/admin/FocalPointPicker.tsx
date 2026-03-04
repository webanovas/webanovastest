import { useState, useRef, useCallback, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RectangleHorizontal, Square, RectangleVertical } from "lucide-react";

interface FocalPointPickerProps {
  src: string;
  alt: string;
  objectPosition: string;
  onSave: (position: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type AspectMode = "wide" | "square" | "tall";

const ASPECT_RATIOS: Record<AspectMode, number> = {
  wide: 16 / 9,
  square: 1,
  tall: 3 / 4,
};

const ASPECT_LABELS: Record<AspectMode, string> = {
  wide: "רחב",
  square: "ריבוע",
  tall: "גבוה",
};

const ASPECT_ICONS: Record<AspectMode, typeof Square> = {
  wide: RectangleHorizontal,
  square: Square,
  tall: RectangleVertical,
};

const FocalPointPicker = ({ src, alt, objectPosition, onSave, open, onOpenChange }: FocalPointPickerProps) => {
  const [position, setPosition] = useState(() => {
    const parts = objectPosition.split(" ");
    return {
      x: parseFloat(parts[0]) || 50,
      y: parseFloat(parts[1]) || 50,
    };
  });
  const [aspectMode, setAspectMode] = useState<AspectMode>("wide");
  const [dragging, setDragging] = useState(false);
  const [imgNatural, setImgNatural] = useState({ w: 1, h: 1 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset position when dialog opens
  useEffect(() => {
    if (open) {
      const parts = objectPosition.split(" ");
      setPosition({
        x: parseFloat(parts[0]) || 50,
        y: parseFloat(parts[1]) || 50,
      });
    }
  }, [open, objectPosition]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImgNatural({ w: img.naturalWidth, h: img.naturalHeight });
  };

  const updatePosition = useCallback((e: React.MouseEvent | MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
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

  // Calculate the crop window inset values for clip-path
  // The crop window shows what object-cover would display at the given focal point
  const computeClipInset = () => {
    const imgAspect = imgNatural.w / imgNatural.h;
    const cropAspect = ASPECT_RATIOS[aspectMode];

    // Crop window size as percentage of the full image
    let cropW: number, cropH: number;
    if (cropAspect > imgAspect) {
      // Crop is wider than image → full width, partial height
      cropW = 100;
      cropH = (imgAspect / cropAspect) * 100;
    } else {
      // Crop is taller than image → full height, partial width
      cropH = 100;
      cropW = (cropAspect / imgAspect) * 100;
    }

    // Position the crop window centered on the focal point, clamped to image bounds
    const halfW = cropW / 2;
    const halfH = cropH / 2;

    const cx = Math.max(halfW, Math.min(100 - halfW, position.x));
    const cy = Math.max(halfH, Math.min(100 - halfH, position.y));

    const top = cy - halfH;
    const right = 100 - (cx + halfW);
    const bottom = 100 - (cy + halfH);
    const left = cx - halfW;

    return { top, right, bottom, left };
  };

  const inset = computeClipInset();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0" dir="rtl">
        <div className="p-6 pb-0">
          <DialogHeader>
            <DialogTitle className="font-heading">מיקום מוקד התמונה</DialogTitle>
            <p className="text-sm text-muted-foreground">גררו על התמונה כדי לבחור את האזור שיוצג</p>
          </DialogHeader>

          {/* Aspect ratio selector */}
          <div className="flex gap-1.5 mt-4 justify-center">
            {(["wide", "square", "tall"] as AspectMode[]).map((mode) => {
              const Icon = ASPECT_ICONS[mode];
              const active = aspectMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => setAspectMode(mode)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {ASPECT_LABELS[mode]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Crop preview area */}
        <div className="px-4 pt-4">
          <div
            ref={containerRef}
            className="relative cursor-crosshair rounded-lg overflow-hidden select-none mx-auto"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Dimmed full image (background layer) */}
            <img
              src={src}
              alt={alt}
              className="w-full h-auto block"
              style={{ filter: "brightness(0.35)" }}
              draggable={false}
              onLoad={handleImageLoad}
            />

            {/* Bright crop window (clipped layer) */}
            <img
              src={src}
              alt={alt}
              className="absolute inset-0 w-full h-full block pointer-events-none"
              style={{
                clipPath: `inset(${inset.top}% ${inset.right}% ${inset.bottom}% ${inset.left}%)`,
              }}
              draggable={false}
            />

            {/* Crop window border */}
            <div
              className="absolute pointer-events-none border-2 border-white/80 rounded-sm shadow-[0_0_0_9999px_transparent]"
              style={{
                top: `${inset.top}%`,
                left: `${inset.left}%`,
                right: `${inset.right}%`,
                bottom: `${inset.bottom}%`,
              }}
            />

            {/* Focal point dot */}
            <div
              className="absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
              style={{ left: `${position.x}%`, top: `${position.y}%` }}
            >
              <div className="absolute inset-0 rounded-full border-2 border-white/90 shadow-md" />
              <div className="absolute inset-[4px] rounded-full bg-primary/80" />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-border bg-card sticky bottom-0">
          <span className="text-xs text-muted-foreground">
            {position.x}% / {position.y}%
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPosition({ x: 50, y: 50 })}>
              איפוס למרכז
            </Button>
            <Button size="sm" onClick={handleSave}>
              שמירה
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FocalPointPicker;
