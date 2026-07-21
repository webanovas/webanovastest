import { Megaphone } from "lucide-react";
import { useAdminMode } from "@/hooks/useAdminMode";
import { usePageContent } from "@/hooks/usePageContent";
import EditableText from "@/components/admin/EditableText";

/**
 * Site-wide announcement bar.
 * - Public: only renders when there is non-empty content.
 * - Admin edit mode: always renders, so Shira can write / clear the message.
 *   Clearing the text (empty) hides the banner from visitors automatically.
 */
const AnnouncementBanner = () => {
  const { isEditMode } = useAdminMode();
  const { getText, saveText } = usePageContent("global");
  const message = getText("announcement", "");
  const hasMessage = message.trim().length > 0;

  if (!hasMessage && !isEditMode) return null;

  return (
    <div
      dir="rtl"
      className="w-full bg-[hsl(170,25%,78%)]/60 border-b border-[hsl(170,25%,60%)]/30"
    >
      <div className="container mx-auto px-4 py-2.5 flex items-center gap-3 justify-center text-yoga-dark">
        <Megaphone className="h-4 w-4 shrink-0 opacity-80" />
        {isEditMode ? (
          <div className="flex-1 max-w-3xl">
            <EditableText
              value={message}
              onSave={(v) => saveText("announcement", v)}
              as="p"
              multiline
              placeholder="כתבי כאן הודעה לגולשים (השאירי ריק כדי להסתיר)"
              persistKey="global:announcement"
              className="text-sm md:text-base font-medium text-center leading-relaxed"
            />
          </div>
        ) : (
          <p className="text-sm md:text-base font-medium text-center leading-relaxed">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default AnnouncementBanner;
