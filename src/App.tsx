import { useEffect, useState } from "react";
import IntroAnimation from "@/components/ui/scroll-morph-hero";
import SobreMi from "@/components/sobre-mi";
import Obras from "@/components/obras";
import Built from "@/components/built";
import Books from "@/components/books";

type Language = "en" | "es";

type Vista = "inicio" | "obras" | "built" | "books" | "sobre-mi";

export default function App() {
  const normalizePath = (path: string) => {
    const cleaned = path.replace(/\/+$|^\/\//g, "");
    return cleaned === "" ? "/main" : `/${cleaned}`;
  };

  const [pathname, setPathname] = useState(normalizePath(window.location.pathname));
  const [lang, setLang] = useState<Language>("en");

  useEffect(() => {
    const onPopState = () => setPathname(normalizePath(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigate = (path: string) => {
    const next = normalizePath(path);
    if (next !== pathname) {
      window.history.pushState(null, "", next);
      setPathname(next);
    }
  };

  // La página principal es /main; /works muestra la galería, /about la biografía,
  // /built los proyectos y /books la galería de libros.
  const vista: Vista =
    pathname === "/about"
      ? "sobre-mi"
      : pathname === "/works"
        ? "obras"
        : pathname === "/built"
          ? "built"
          : pathname === "/books"
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
        <button
          type="button"
          onClick={() => navigate("/main")}
          className="font-serif text-lg lowercase tracking-wide text-gray-900 no-underline"
        >
          josé subiabre
        </button>
        <nav className="flex flex-wrap items-center gap-4 text-[0.72rem] font-medium uppercase tracking-[0.14em] text-gray-500 sm:gap-7">
          <button
            type="button"
            onClick={() => navigate("/works")}
            className="transition-colors hover:text-blue-700"
          >
            {labels.works}
          </button>
          <button
            type="button"
            onClick={() => navigate("/built")}
            className="transition-colors hover:text-blue-700"
          >
            {labels.built}
          </button>
          <button
            type="button"
            onClick={() => navigate("/books")}
            className="transition-colors hover:text-blue-700"
          >
            {labels.books}
          </button>
          <button
            type="button"
            onClick={() => navigate("/about")}
            className="transition-colors hover:text-blue-700"
          >
            {labels.about}
          </button>
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
