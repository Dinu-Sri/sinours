/**
 * Inline, render-blocking script placed in <head>.
 * Reads the saved theme (or the system preference) and sets the `dark`
 * class on <html> BEFORE first paint — preventing a flash of the wrong theme.
 *
 * Mirrors the keys used by <ThemeToggle />: localStorage.theme = "light" | "dark".
 */
export function ThemeScript() {
  const script = `(() => {
  try {
    var stored = localStorage.getItem("theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var dark = stored ? stored === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
  } catch (e) {}
})();`;

  return (
    <script
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
