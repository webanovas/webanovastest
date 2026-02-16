import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function usePageContent(page: string) {
  const queryClient = useQueryClient();

  const { data: contentMap = {} } = useQuery({
    queryKey: ["page_content", page],
    queryFn: async () => {
      const { data } = await supabase
        .from("page_content")
        .select("*")
        .eq("page", page);
      const map: Record<string, string> = {};
      data?.forEach((row) => {
        map[row.section] = row.content;
      });
      return map;
    },
  });

  const getText = (section: string, fallback: string) => {
    return contentMap[section] || fallback;
  };

  const saveText = async (section: string, value: string) => {
    // Upsert: try update first, then insert if not found
    const { data: existing } = await supabase
      .from("page_content")
      .select("id")
      .eq("page", page)
      .eq("section", section)
      .maybeSingle();

    let error;
    if (existing) {
      ({ error } = await supabase
        .from("page_content")
        .update({ content: value, updated_at: new Date().toISOString() })
        .eq("id", existing.id));
    } else {
      ({ error } = await supabase
        .from("page_content")
        .insert({ page, section, content: value }));
    }

    if (error) {
      console.error("Save content error:", error);
      toast.error("שגיאה בשמירה: " + error.message);
    } else {
      toast.success("נשמר");
      queryClient.invalidateQueries({ queryKey: ["page_content", page] });
    }
  };

  return { getText, saveText };
}
