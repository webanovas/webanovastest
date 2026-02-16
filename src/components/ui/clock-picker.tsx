import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface ClockPickerProps {
  value: string;
  onChange: (time: string) => void;
  onDone?: () => void;
  hourMin?: number;
  hourMax?: number;
}

const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

export function ClockPicker({ value, onChange, onDone, hourMin = 6, hourMax = 20 }: ClockPickerProps) {
  const [step, setStep] = useState<"hour" | "minute">("hour");
  const parsed = parseTime(value);
  const [selectedHour, setSelectedHour] = useState<number | null>(parsed.hour);
  const [selectedMinute, setSelectedMinute] = useState<number | null>(parsed.minute);

  const hours = Array.from({ length: hourMax - hourMin + 1 }, (_, i) => i + hourMin);

  function handleHourClick(h: number) {
    setSelectedHour(h);
    setStep("minute");
  }

  function handleMinuteClick(m: number) {
    setSelectedMinute(m);
    const timeStr = `${String(selectedHour).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
    onChange(timeStr);
    onDone?.();
  }

  const activeValue = step === "hour" ? selectedHour : selectedMinute;
  const items = step === "hour" ? hours : MINUTES;
  const count = items.length;

  // Calculate angle for the clock hand
  const activeIndex = activeValue !== null ? items.indexOf(activeValue) : -1;
  const handAngle = activeIndex >= 0 ? (activeIndex / count) * 360 : null;

  const RADIUS = 90;
  const CENTER = 120;

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      {/* Header */}
      <div className="flex items-center gap-2 w-full">
        {step === "minute" && (
          <button
            onClick={() => setStep("hour")}
            className="text-xs text-primary hover:underline flex items-center gap-0.5"
          >
            <ChevronRight className="h-3 w-3 rotate-180" />
            חזרה
          </button>
        )}
        <span className="text-xs text-muted-foreground font-medium mx-auto">
          {step === "hour" ? "בחר שעה" : "בחר דקות"}
        </span>
      </div>

      {/* Display */}
      <div className="text-2xl font-mono font-bold text-foreground tracking-wider">
        <span className={cn(step === "hour" && "text-primary")}>
          {selectedHour !== null ? String(selectedHour).padStart(2, "0") : "--"}
        </span>
        <span className="text-muted-foreground mx-0.5">:</span>
        <span className={cn(step === "minute" && "text-primary")}>
          {selectedMinute !== null ? String(selectedMinute).padStart(2, "0") : "--"}
        </span>
      </div>

      {/* Clock face */}
      <div className="relative" style={{ width: CENTER * 2, height: CENTER * 2 }}>
        {/* Background circle */}
        <div className="absolute inset-2 rounded-full bg-muted/50 border border-border" />

        {/* Hand */}
        {handAngle !== null && (
          <motion.div
            className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none"
            style={{ width: CENTER * 2, height: CENTER * 2 }}
          >
            <svg width={CENTER * 2} height={CENTER * 2} className="absolute inset-0">
              <motion.line
                x1={CENTER}
                y1={CENTER}
                x2={CENTER + RADIUS * 0.75 * Math.sin((handAngle * Math.PI) / 180)}
                y2={CENTER - RADIUS * 0.75 * Math.cos((handAngle * Math.PI) / 180)}
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                strokeLinecap="round"
                initial={false}
                animate={{
                  x2: CENTER + RADIUS * 0.75 * Math.sin((handAngle * Math.PI) / 180),
                  y2: CENTER - RADIUS * 0.75 * Math.cos((handAngle * Math.PI) / 180),
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
              <circle cx={CENTER} cy={CENTER} r={4} fill="hsl(var(--primary))" />
            </svg>
          </motion.div>
        )}

        {/* Numbers */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            {items.map((item, i) => {
              const angle = (i / count) * 360 - 90;
              const rad = (angle * Math.PI) / 180;
              const x = CENTER + RADIUS * Math.cos(rad);
              const y = CENTER + RADIUS * Math.sin(rad);
              const isActive = item === activeValue;
              const label = step === "hour" ? String(item) : String(item).padStart(2, "0");

              return (
                <button
                  key={item}
                  onClick={() => step === "hour" ? handleHourClick(item) : handleMinuteClick(item)}
                  className={cn(
                    "absolute flex items-center justify-center rounded-full transition-all duration-150 text-sm font-medium",
                    "w-9 h-9 -translate-x-1/2 -translate-y-1/2",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg scale-110"
                      : "hover:bg-accent text-foreground hover:scale-105"
                  )}
                  style={{ left: x, top: y }}
                >
                  {label}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function parseTime(value: string): { hour: number | null; minute: number | null } {
  if (!value) return { hour: null, minute: null };
  const parts = value.split(":");
  if (parts.length !== 2) return { hour: null, minute: null };
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  return { hour: isNaN(h) ? null : h, minute: isNaN(m) ? null : m };
}
