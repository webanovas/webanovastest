import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronRight, Sun, Moon } from "lucide-react";

interface ClockPickerProps {
  value: string;
  onChange: (time: string) => void;
  onDone?: () => void;
  hourMin?: number;
  hourMax?: number;
}

const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
const HOURS_OUTER = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const HOURS_INNER = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

export function ClockPicker({ value, onChange, onDone }: ClockPickerProps) {
  const [step, setStep] = useState<"hour" | "minute">("hour");
  const parsed = parseTime(value);
  const [selectedHour, setSelectedHour] = useState<number | null>(parsed.hour);
  const [selectedMinute, setSelectedMinute] = useState<number | null>(parsed.minute);

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

  const RADIUS_OUTER = 92;
  const RADIUS_INNER = 60;
  const CENTER = 120;

  const isInner = selectedHour !== null && HOURS_INNER.includes(selectedHour);
  const activeRing = isInner ? HOURS_INNER : HOURS_OUTER;
  const activeRadius = isInner ? RADIUS_INNER : RADIUS_OUTER;

  // Calculate hand for hours
  const hourIndex = selectedHour !== null ? activeRing.indexOf(selectedHour) : -1;
  const hourAngle = hourIndex >= 0 ? (hourIndex / 12) * 360 : null;

  // Calculate hand for minutes
  const minuteIndex = selectedMinute !== null ? MINUTES.indexOf(selectedMinute) : -1;
  const minuteAngle = minuteIndex >= 0 ? (minuteIndex / 12) * 360 : null;

  const handAngle = step === "hour" ? hourAngle : minuteAngle;
  const handRadius = step === "hour" ? activeRadius : RADIUS_OUTER;

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

      {/* Legend for hours */}
      {step === "hour" && (
        <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1"><Sun className="h-3 w-3 text-amber-500" /> 0–12</span>
          <span className="flex items-center gap-1"><Moon className="h-3 w-3 text-indigo-400" /> 13–23</span>
        </div>
      )}

      {/* Clock face */}
      <div className="relative" style={{ width: CENTER * 2, height: CENTER * 2 }}>
        {/* Background circle */}
        <div className="absolute inset-2 rounded-full bg-muted/50 border border-border" />
        {step === "hour" && (
          <div className="absolute rounded-full bg-muted/30 border border-border/50" style={{
            left: CENTER - RADIUS_INNER - 16,
            top: CENTER - RADIUS_INNER - 16,
            width: (RADIUS_INNER + 16) * 2,
            height: (RADIUS_INNER + 16) * 2,
          }} />
        )}

        {/* Hand */}
        {handAngle !== null && (
          <svg width={CENTER * 2} height={CENTER * 2} className="absolute inset-0 pointer-events-none">
            <motion.line
              x1={CENTER}
              y1={CENTER}
              x2={CENTER + (handRadius * 0.75) * Math.sin((handAngle * Math.PI) / 180)}
              y2={CENTER - (handRadius * 0.75) * Math.cos((handAngle * Math.PI) / 180)}
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              strokeLinecap="round"
              initial={false}
              animate={{
                x2: CENTER + (handRadius * 0.75) * Math.sin((handAngle * Math.PI) / 180),
                y2: CENTER - (handRadius * 0.75) * Math.cos((handAngle * Math.PI) / 180),
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <circle cx={CENTER} cy={CENTER} r={4} fill="hsl(var(--primary))" />
          </svg>
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
            {step === "hour" ? (
              <>
                {/* Outer ring - day hours */}
                {HOURS_OUTER.map((item, i) => {
                  const angle = (i / 12) * 360 - 90;
                  const rad = (angle * Math.PI) / 180;
                  const x = CENTER + RADIUS_OUTER * Math.cos(rad);
                  const y = CENTER + RADIUS_OUTER * Math.sin(rad);
                  const isActive = item === selectedHour;
                  return (
                    <button
                      key={item}
                      onClick={() => handleHourClick(item)}
                      className={cn(
                        "absolute flex items-center justify-center rounded-full transition-all duration-150 text-sm font-medium",
                        "w-8 h-8 -translate-x-1/2 -translate-y-1/2",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg scale-110"
                          : "hover:bg-accent text-foreground hover:scale-105"
                      )}
                      style={{ left: x, top: y }}
                    >
                      {item}
                    </button>
                  );
                })}
                {/* Inner ring - night hours */}
                {HOURS_INNER.map((item, i) => {
                  const angle = (i / 12) * 360 - 90;
                  const rad = (angle * Math.PI) / 180;
                  const x = CENTER + RADIUS_INNER * Math.cos(rad);
                  const y = CENTER + RADIUS_INNER * Math.sin(rad);
                  const isActive = item === selectedHour;
                  return (
                    <button
                      key={`inner-${item}`}
                      onClick={() => handleHourClick(item)}
                      className={cn(
                        "absolute flex items-center justify-center rounded-full transition-all duration-150 font-medium",
                        "w-7 h-7 -translate-x-1/2 -translate-y-1/2 text-xs",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg scale-110"
                          : "hover:bg-accent text-muted-foreground hover:scale-105"
                      )}
                      style={{ left: x, top: y }}
                    >
                      {item}
                    </button>
                  );
                })}
              </>
            ) : (
              /* Minutes - single ring */
              MINUTES.map((item, i) => {
                const angle = (i / 12) * 360 - 90;
                const rad = (angle * Math.PI) / 180;
                const x = CENTER + RADIUS_OUTER * Math.cos(rad);
                const y = CENTER + RADIUS_OUTER * Math.sin(rad);
                const isActive = item === selectedMinute;
                return (
                  <button
                    key={item}
                    onClick={() => handleMinuteClick(item)}
                    className={cn(
                      "absolute flex items-center justify-center rounded-full transition-all duration-150 text-sm font-medium",
                      "w-9 h-9 -translate-x-1/2 -translate-y-1/2",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-lg scale-110"
                        : "hover:bg-accent text-foreground hover:scale-105"
                    )}
                    style={{ left: x, top: y }}
                  >
                    {String(item).padStart(2, "0")}
                  </button>
                );
              })
            )}
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
