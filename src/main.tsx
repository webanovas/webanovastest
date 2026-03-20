import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Global: fade-in images on load
const markLoaded = (img: HTMLImageElement) => {
  img.setAttribute("data-loaded", "true");
};

// Handle images already in DOM or added later
const observer = new MutationObserver((mutations) => {
  for (const m of mutations) {
    for (const node of m.addedNodes) {
      if (node instanceof HTMLImageElement) {
        if (node.complete) markLoaded(node);
        else node.addEventListener("load", () => markLoaded(node), { once: true });
      }
      if (node instanceof HTMLElement) {
        node.querySelectorAll?.("img").forEach((img) => {
          if (img.complete) markLoaded(img);
          else img.addEventListener("load", () => markLoaded(img), { once: true });
        });
      }
    }
  }
});
observer.observe(document.documentElement, { childList: true, subtree: true });

// Handle images already present
document.querySelectorAll("img").forEach((img) => {
  if (img.complete) markLoaded(img);
  else img.addEventListener("load", () => markLoaded(img), { once: true });
});

createRoot(document.getElementById("root")!).render(<App />);
