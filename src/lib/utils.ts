import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

type OptimizeImageOptions = {
  width?: number;
  quality?: number;
};

const OBJECT_PUBLIC_SEGMENT = "/storage/v1/object/public/";
const RENDER_PUBLIC_SEGMENT = "/storage/v1/render/image/public/";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function optimizeStorageImage(url: string, options: OptimizeImageOptions = {}) {
  if (!url) return url;

  try {
    const parsed = new URL(url);
    const isObjectPublic = parsed.pathname.includes(OBJECT_PUBLIC_SEGMENT);
    const isRenderPublic = parsed.pathname.includes(RENDER_PUBLIC_SEGMENT);

    if (!isObjectPublic && !isRenderPublic) return url;

    if (isObjectPublic) {
      parsed.pathname = parsed.pathname.replace(OBJECT_PUBLIC_SEGMENT, RENDER_PUBLIC_SEGMENT);
    }

    if (options.width) parsed.searchParams.set("width", String(options.width));
    parsed.searchParams.set("quality", String(options.quality ?? 76));

    return parsed.toString();
  } catch {
    return url;
  }
}
