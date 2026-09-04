import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import IntroAnimation from "@/components/ui/scroll-morph-hero";
import SobreMi from "@/components/sobre-mi";
import Obras from "@/components/obras";
import Built from "@/components/built";
import Books from "@/components/books";

type Language = "en" | "es";

type Vista = "inicio" | "obras" | "built" | "books" | "sobre-mi";

export default function App() {
  const [hash, setHash] = useState(window.location.hash);
  const [lang, setLang] = useState<Language>("en");

  // Modo noche: clase .dark en <html>, recordado entre visitas
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      return localStorage.getItem("theme") === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // almacenamiento bloqueado (p. ej. modo privado estricto): el tema
      // igual funciona, solo no se recuerda
    }
  }, [theme]);

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  // La página principal (sin hash o #inicio) es el hero animado;
  // #obras muestra la galería carrusel, #built los proyectos,
  // #books la galería de libros y #sobre-mi la biografía
  const vista: Vista =
    hash === "#sobre-mi"
      ? "sobre-mi"
      : hash === "#obras"
        ? "obras"
        : hash === "#built"
          ? "built"
          : hash === "#books"
            ? "books"
            : "inicio";

  const labels = {
    works: lang === "en" ? "Works" : "Trabajos",
    built: lang === "en" ? "Built" : "Proyectos",
    books: lang === "en" ? "Books" : "Libros",
    about: lang === "en" ? "About" : "Sobre mí",
  };

  return (
    <div
      className={
        vista === "inicio"
          ? "relative h-dvh w-full overflow-hidden"
          : "relative min-h-dvh w-full bg-[#FAFAFA] dark:bg-[#101010]"
      }
    >
      {/* Cabecera superpuesta; en #books la página scrollea 500vh con la
          galería sticky, así que el header va fijo para no perder el menú */}
      <header
        className={`${
          vista === "books" ? "fixed" : "absolute"
        } inset-x-0 top-0 z-20 flex flex-col items-center gap-2 px-6 py-5 md:flex-row md:items-baseline md:justify-between md:px-10 md:py-6`}
      >
        <a
          href="#inicio"
          className="font-serif text-lg lowercase tracking-wide text-gray-900 no-underline dark:text-gray-100"
        >
          josé subiabre
        </a>
        <nav className="flex flex-col items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.14em] text-gray-500 md:flex-row md:gap-7 dark:text-gray-400">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-7">
            <a href="#obras" className="transition-colors hover:text-blue-700 dark:hover:text-blue-400">
              {labels.works}
            </a>
            <a href="#built" className="transition-colors hover:text-blue-700 dark:hover:text-blue-400">
              {labels.built}
            </a>
            <a href="#books" className="transition-colors hover:text-blue-700 dark:hover:text-blue-400">
              {labels.books}
            </a>
            <a href="#sobre-mi" className="transition-colors hover:text-blue-700 dark:hover:text-blue-400">
              {labels.about}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLang(lang === "en" ? "es" : "en")}
              className="flex items-center rounded-full border border-gray-200 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-gray-600 transition-colors hover:text-blue-700 dark:border-gray-700 dark:text-gray-300 dark:hover:text-blue-400"
              aria-label={lang === "en" ? "Cambiar a español" : "Switch to English"}
            >
              <span className={lang === "en" ? "text-gray-900 dark:text-gray-100" : "text-gray-400 dark:text-gray-500"}>EN</span>
              <span className="mx-1 text-gray-400 dark:text-gray-600">|</span>
              <span className={lang === "es" ? "text-gray-900 dark:text-gray-100" : "text-gray-400 dark:text-gray-500"}>ES</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex items-center rounded-full border border-gray-200 p-1.5 text-gray-600 transition-colors hover:text-blue-700 dark:border-gray-700 dark:text-gray-300 dark:hover:text-blue-400"
              aria-label={
                theme === "dark"
                  ? lang === "en" ? "Switch to light mode" : "Cambiar a modo día"
                  : lang === "en" ? "Switch to dark mode" : "Cambiar a modo noche"
              }
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" strokeWidth={1.5} />
              ) : (
                <Moon className="h-4 w-4" strokeWidth={1.5} />
              )}
            </button>
          </div>
        </nav>
      </header>

      {vista === "sobre-mi" ? (
        <SobreMi lang={lang} />
      ) : vista === "built" ? (
        <Built lang={lang} />
      ) : vista === "books" ? (
        <Books lang={lang} />
      ) : vista === "inicio" ? (
        <IntroAnimation lang={lang} />
      ) : (
        <Obras lang={lang} />
      )}
    </div>
  );
}
