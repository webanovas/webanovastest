/**
 * Real uploaded image URLs from Supabase storage.
 * These replace the AI-generated placeholder images so that even before
 * page_content loads from the DB, visitors see real photos.
 */

const STORAGE = "https://muhfaqvpnyakhfkcfhkc.supabase.co/storage/v1/object/public/site-images";

// Hero carousel (home page)
export const HERO_IMAGES = [
  `${STORAGE}/hero/1772310183922-0.JPEG`,
  `${STORAGE}/hero/1772310413769-1.JPEG`,
  `${STORAGE}/hero/1772310202713-2.JPEG`,
  `${STORAGE}/hero/1772310521651-3.JPEG`,
  `${STORAGE}/hero/1772310521651-3.JPEG`, // image 4 reuses image 3 (no separate upload)
];

// Welcome section (home page)
export const WELCOME_MAIN = `${STORAGE}/welcome/1772310699841.JPEG`;
export const WELCOME_SECONDARY = `${STORAGE}/welcome/1773060325459.jpg`;

// Benefits section (home page)
export const BENEFITS_IMAGE = `${STORAGE}/benefits/1772541519253.jpg`;

// CTA background (home page)
export const CTA_BG_IMAGE = `${STORAGE}/cta/1772627601351.jpg`;

// About page
export const ABOUT_HERO = `${STORAGE}/about/1772635357296.jpg`;
export const SHIRA_IMAGE = `${STORAGE}/about/1772464543722.jpeg`;
export const STUDIO_MAIN = `${STORAGE}/about/1772635066481.jpg`;

// About gallery
export const GALLERY_IMAGES = [
  `${STORAGE}/gallery/1772470250548.jpeg`,
  `${STORAGE}/gallery/1772470589408.jpeg`,
  `${STORAGE}/gallery/1772544573546.jpeg`,
  `${STORAGE}/gallery/1772470072604.jpeg`,
  `${STORAGE}/gallery/1772646934100.jpeg`,
  `${STORAGE}/gallery/1772647110385.jpeg`,
];

// Contact page
export const CONTACT_STUDIO = `${STORAGE}/contact/1773058114111.JPG`;

// Teacher fallback (for new teachers with no image)
export const TEACHER_FALLBACK = `${STORAGE}/teachers/1772311715250.JPEG`;
