// Dark mode theme, persisted in localStorage and applied via a class on <html>.
const THEME_KEY = "aiess_theme";

export function getStoredTheme() {
  if (typeof window === "undefined") return "light";
  try {
    return window.localStorage.getItem(THEME_KEY) || "light";
  } catch {
    return "light";
  }
}

export function applyTheme(theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function setStoredTheme(theme) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(THEME_KEY, theme);
  applyTheme(theme);
}

// Inlined into <head> so the correct theme is applied before first paint,
// avoiding a light->dark flash on reload.
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t==="dark")document.documentElement.classList.add("dark");}catch(e){}})();`;
