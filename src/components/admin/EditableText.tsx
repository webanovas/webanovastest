import { useState, useRef, useEffect } from "react";
import { useAdminMode } from "@/hooks/useAdminMode";
import { Pencil, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditableTextProps {
  value: string;
  onSave: (value: string) => void;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
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

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  if (!isEditMode) {
    return <Tag className={className}>{value || placeholder}</Tag>;
  }

  if (editing) {
    return (
      <div className="relative inline-flex items-center gap-1.5 w-full" onClick={(e) => e.stopPropagation()}>
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") { setDraft(value); setEditing(false); }
            }}
            className={cn(
              "w-full bg-primary/5 border-2 border-primary/40 rounded-lg px-3 py-2 text-inherit focus:outline-none focus:ring-2 focus:ring-primary/40 min-h-[60px] resize-y",
              className
            )}
            rows={3}
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
        <button
          onClick={() => { onSave(draft); setEditing(false); }}
          className="p-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/80 transition-colors flex-shrink-0"
        >
          <Check className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => { setDraft(value); setEditing(false); }}
          className="p-1.5 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors flex-shrink-0"
        >
          <X className="h-3.5 w-3.5" />
        </button>
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
      onClick={(e: React.MouseEvent) => { e.stopPropagation(); setEditing(true); }}
    >
      {value || <span className="text-muted-foreground italic">{placeholder}</span>}
      <span className="absolute -top-2 -left-2 bg-primary text-primary-foreground rounded-full p-1 opacity-0 group-hover/edit:opacity-100 transition-opacity shadow-lg">
        <Pencil className="h-3 w-3" />
      </span>
    </Tag>
  );
};

export default EditableText;
