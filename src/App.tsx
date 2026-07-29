import { useEffect, useState } from "react";
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
          : "relative min-h-dvh w-full bg-[#FAFAFA]"
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
          className="font-serif text-lg lowercase tracking-wide text-gray-900 no-underline"
        >
          josé subiabre
        </a>
        <nav className="flex flex-wrap items-center gap-4 text-[0.72rem] font-medium uppercase tracking-[0.14em] text-gray-500 sm:gap-7">
          <a href="#obras" className="transition-colors hover:text-blue-700">
            {labels.works}
          </a>
          <a href="#built" className="transition-colors hover:text-blue-700">
            {labels.built}
          </a>
          <a href="#books" className="transition-colors hover:text-blue-700">
            {labels.books}
          </a>
          <a href="#sobre-mi" className="transition-colors hover:text-blue-700">
            {labels.about}
          </a>
          <button
            type="button"
            onClick={() => setLang(lang === "en" ? "es" : "en")}
            className="flex items-center rounded-full border border-gray-200 px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-gray-600 transition-colors hover:text-blue-700"
            aria-label={lang === "en" ? "Cambiar a español" : "Switch to English"}
          >
            <span className={lang === "en" ? "text-gray-900" : "text-gray-400"}>EN</span>
            <span className="mx-1 text-gray-400">|</span>
            <span className={lang === "es" ? "text-gray-900" : "text-gray-400"}>ES</span>
          </button>
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
