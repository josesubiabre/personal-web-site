import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";

// Proyectos y productos. Cada uno puede tener varios links (view project,
// view code, etc.); si un href queda vacío, esa acción se muestra apagada
// y sin click. stack es opcional: línea de tecnologías bajo la descripción.
// Un link con gallery: true abre el visor con las images del proyecto
// (si images está vacío, se muestra apagado hasta que agregues rutas).
type ProjectLink = { label: string; href?: string; gallery?: boolean };

type Proyecto = {
  name: string;
  description: string;
  stack: string;
  images: string[];
  links: ProjectLink[];
};

const PROYECTOS: Proyecto[] = [
  {
    name: "MiVitae",
    description:
      "a personal health wallet for organizing medical history in Chile.",
    stack: "JavaScript · Supabase · Playwright · Node.js · Vercel",
    images: [
      "built/MiVitae/MiVitae_Desktop_Examenes_Mock.png",
      "built/MiVitae/MiVitae_Phone_Mock.png",
      "built/MiVitae/MiVitae_Desktop_Examenes.png",
    ],
    links: [
      { label: "view project", href: "https://www.mivitae.cl/" },
      { label: "view", gallery: true },
    ],
  },
  {
    name: "MorningTechDigest",
    description: "a small automation that reads tech news before i do.",
    stack: "Python · GitHub Actions · AI summaries · WhatsApp",
    images: [
      "built/TechNewsDigest/Product_Tech_News_Digest.png",
      "built/TechNewsDigest/Tech_News_Digest_Phone.png",
    ],
    links: [
      { label: "view project", gallery: true },
      { label: "view code", href: "https://github.com/josesubiabre/morning-tech-digest" },
    ],
  },
  {
    name: "ParaNonna",
    description:
      "an early-stage product and brand exploring everyday objects for older adults.",
    stack: "",
    images: [],
    links: [{ label: "view project", href: "https://paranonna.cl/" }],
  },
];

type Galeria = { title: string; images: string[]; index: number };

export default function Built() {
  const [galeria, setGaleria] = useState<Galeria | null>(null);
  const galeriaRef = useRef<Galeria | null>(null);
  galeriaRef.current = galeria;

  // Navega dentro de la galería abierta (circular)
  const navigate = (dir: number) => {
    setGaleria((prev) =>
      prev
        ? { ...prev, index: (prev.index + dir + prev.images.length) % prev.images.length }
        : prev,
    );
  };

  // Swipe horizontal en la galería (una navegación por gesto)
  const touchStartX = useRef(0);
  const swipeHandled = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setGaleria(null);
      if (galeriaRef.current === null) return;
      if (e.key === "ArrowRight") navigate(1);
      if (e.key === "ArrowLeft") navigate(-1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <section className="relative w-full overflow-hidden">
      <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col justify-center px-4 pb-[10vh] pt-28 sm:px-6 lg:px-8 max-lg:justify-start">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Columna izquierda — título */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center gap-3">
              <h2 className="font-serif text-xl lowercase tracking-tight text-black sm:text-2xl">
                built
              </h2>
              <ArrowDown className="h-5 w-5 text-black" strokeWidth={1.5} />
            </div>
          </motion.div>

          {/* Columna central — lista de proyectos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-10"
          >
            <p className="text-sm leading-relaxed text-gray-700">
              small products, tools, and ventures i’ve built or explored.
            </p>

            <ul className="mt-8 divide-y divide-gray-200 border-b border-gray-200">
              {PROYECTOS.map((proyecto) => (
                <li
                  key={proyecto.name}
                  className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-6"
                >
                  <span className="w-44 shrink-0 text-sm font-medium text-black">
                    {proyecto.name}
                  </span>
                  <span className="flex-1">
                    <span className="block text-sm leading-relaxed text-gray-700">
                      {proyecto.description}
                    </span>
                    {proyecto.stack && (
                      <span className="mt-1 block text-xs text-gray-400">
                        {proyecto.stack}
                      </span>
                    )}
                  </span>
                  <span className="flex shrink-0 items-center gap-5">
                    {proyecto.links.map((link) => {
                      // Los links con gallery abren el visor de imágenes
                      if (link.gallery && proyecto.images.length > 0) {
                        return (
                          <button
                            key={link.label}
                            type="button"
                            onClick={() =>
                              setGaleria({
                                title: proyecto.name,
                                images: proyecto.images,
                                index: 0,
                              })
                            }
                            className="flex items-center gap-1 text-sm text-black transition-colors hover:text-blue-700"
                          >
                            {link.label}
                            <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                          </button>
                        );
                      }
                      return link.href ? (
                        <a
                          key={link.label}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-black transition-colors hover:text-blue-700"
                        >
                          {link.label}
                          <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                        </a>
                      ) : (
                        <span
                          key={link.label}
                          className="flex items-center gap-1 text-sm text-gray-300"
                        >
                          {link.label}
                          <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                        </span>
                      );
                    })}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </main>

      {/* Visor de imágenes del proyecto */}
      <AnimatePresence>
        {galeria && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setGaleria(null)}
            onTouchStart={(e) => {
              touchStartX.current = e.touches[0].clientX;
              swipeHandled.current = false;
            }}
            onTouchMove={(e) => {
              if (swipeHandled.current) return;
              const deltaX = e.touches[0].clientX - touchStartX.current;
              if (Math.abs(deltaX) > 60) {
                swipeHandled.current = true;
                navigate(deltaX < 0 ? 1 : -1); // swipe a la izquierda → siguiente
              }
            }}
            className="fixed inset-0 z-30 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm cursor-zoom-out md:p-10"
          >
            <motion.figure
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="relative m-0 max-h-full max-w-full cursor-default"
            >
              <motion.img
                key={galeria.index}
                src={galeria.images[galeria.index]}
                alt={`${galeria.title} ${galeria.index + 1}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="max-h-[80vh] max-w-full rounded-2xl object-contain shadow-2xl"
              />
              <figcaption className="relative z-20 mt-3 flex items-baseline justify-between gap-4 text-white">
                <span className="text-sm font-medium">
                  {galeria.title}
                  <span className="ml-2 text-xs uppercase tracking-[0.14em] text-white/50">
                    {galeria.index + 1} / {galeria.images.length}
                  </span>
                </span>
                <button
                  onClick={() => setGaleria(null)}
                  className="text-xs uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-white"
                >
                  Close ✕
                </button>
              </figcaption>
            </motion.figure>

            {/* Zonas táctiles en los bordes: anterior / siguiente */}
            {galeria.images.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous image"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(-1);
                  }}
                  className="absolute inset-y-0 left-0 z-10 flex w-[18%] max-w-28 items-center justify-start pl-2 text-white/40 transition-colors hover:text-white active:text-white md:pl-4"
                >
                  <span className="text-4xl leading-none">‹</span>
                </button>
                <button
                  type="button"
                  aria-label="Next image"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(1);
                  }}
                  className="absolute inset-y-0 right-0 z-10 flex w-[18%] max-w-28 items-center justify-end pr-2 text-white/40 transition-colors hover:text-white active:text-white md:pr-4"
                >
                  <span className="text-4xl leading-none">›</span>
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
