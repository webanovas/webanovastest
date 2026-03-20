import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Global: fade-in images on load
const markLoaded = (img: HTMLImageElement) => {
  img.setAttribute("data-fade-state", "loaded");
};

const markPending = (img: HTMLImageElement) => {
  img.setAttribute("data-fade-state", "pending");
};

const prepareImageFade = (img: HTMLImageElement) => {
  if (img.complete && img.naturalWidth > 0) {
    markLoaded(img);
    return;
  }

  markPending(img);
  const onDone = () => markLoaded(img);
  img.addEventListener("load", onDone, { once: true });
  img.addEventListener("error", onDone, { once: true });
};

// Handle images already present
document.querySelectorAll("img").forEach(prepareImageFade);

// Lightweight global listener for future image load/error events
document.addEventListener(
  "load",
  (event) => {
    const target = event.target;
    if (target instanceof HTMLImageElement) {
      markLoaded(target);
    }
  },
  true,
);

document.addEventListener(
  "error",
  (event) => {
    const target = event.target;
    if (target instanceof HTMLImageElement) {
      markLoaded(target);
    }
  },
  true,
);

createRoot(document.getElementById("root")!).render(<App />);
