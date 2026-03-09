import { useState, useRef, useEffect, useCallback, useId } from "react";
import { useAdminMode } from "@/hooks/useAdminMode";
import { Pencil, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditableTextProps {
  value: string;
  onSave: (value: string) => void;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  className?: string;
  multiline?: boolean;
  placeholder?: string;
}

const EditableText = ({
  value,
  onSave,
  as: Tag = "span",
  className,
  multiline = false,
  placeholder = "הוסף טקסט...",
}: EditableTextProps) => {
  const { isEditMode } = useAdminMode();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const editingRef = useRef(false);

  // Keep ref in sync so we can restore after remount
  useEffect(() => {
    editingRef.current = editing;
  }, [editing]);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      if (!multiline) {
        inputRef.current.select();
      } else {
        const el = inputRef.current as HTMLTextAreaElement;
        el.selectionStart = el.selectionEnd = el.value.length;
      }
    }
  }, [editing, multiline]);

  // Auto-resize textarea
  const autoResize = useCallback((el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, []);

  useEffect(() => {
    if (editing && multiline && inputRef.current) {
      autoResize(inputRef.current as HTMLTextAreaElement);
    }
  }, [editing, multiline, draft, autoResize]);

  if (!isEditMode) {
    if (!value) return null;
    return <Tag className={className}>{value}</Tag>;
  }

  if (editing) {
    return (
      <div
        className="relative w-full"
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              autoResize(e.target);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") { setDraft(value); setEditing(false); }
            }}
            onBlur={(e) => {
              // Don't close if clicking save/cancel buttons
              if (e.relatedTarget?.closest('[data-edit-actions]')) return;
            }}
            className={cn(
              "w-full bg-primary/5 border-2 border-primary/40 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40 resize-y min-h-[120px]",
              "text-base leading-relaxed font-body text-foreground"
            )}
            dir="rtl"
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { onSave(draft); setEditing(false); }
              if (e.key === "Escape") { setDraft(value); setEditing(false); }
            }}
            className={cn(
              "w-full bg-primary/5 border-2 border-primary/40 rounded-lg px-3 py-1.5 text-inherit focus:outline-none focus:ring-2 focus:ring-primary/40",
              className
            )}
          />
        )}
        <div className="flex gap-1.5 justify-end mt-2" data-edit-actions>
          <button
            onClick={() => { onSave(draft); setEditing(false); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/80 transition-colors text-sm font-medium"
          >
            <Check className="h-3.5 w-3.5" />
            שמירה
          </button>
          <button
            onClick={() => { setDraft(value); setEditing(false); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors text-sm"
          >
            <X className="h-3.5 w-3.5" />
            ביטול
          </button>
        </div>
      </div>
    );
  }

  return (
    <Tag
      className={cn(
        className,
        "cursor-pointer relative group/edit rounded-md transition-all duration-200",
        "hover:outline hover:outline-2 hover:outline-primary/40 hover:outline-offset-4",
        "hover:bg-primary/5"
      )}
      onClick={(e: React.MouseEvent) => { e.stopPropagation(); e.preventDefault(); setEditing(true); }}
      onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
      onPointerDown={(e: React.PointerEvent) => e.stopPropagation()}
    >
      {value || <span className="text-muted-foreground italic">{placeholder}</span>}
      <span className="absolute -top-2 -left-2 bg-primary text-primary-foreground rounded-full p-1 opacity-0 group-hover/edit:opacity-100 transition-opacity shadow-lg">
        <Pencil className="h-3 w-3" />
      </span>
    </Tag>
  );
};

export default EditableText;
