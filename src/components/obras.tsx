import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gallery4, type Gallery4Item } from "@/components/ui/gallery4";

// Galería de obras — aún sin contenido.
// Para añadir una tarjeta: pon la imagen en public/photos/ y agrega aquí:
//   { id: "mi-obra", title: "Mi obra", description: "Texto de la tarjeta",
//     href: "photos/Mi_Obra.jpg", image: "photos/Mi_Obra.jpg" },
const items: Gallery4Item[] = [
  {
    id: "tokyo-afterglow",
    title: "tokyo afterglow",
    description: "JOTD · an AI music project",
    href: "works/tokyo_afterglow.png",
    image: "works/tokyo_afterglow.png",
    music: "https://open.spotify.com/album/0EvRNQW89ciMf4Av9i9brh",
  },
  {
    id: "perdidos",
    title: "perdidos",
    description: "JOTD · an AI music project",
    href: "works/perdidos.png",
    image: "works/perdidos.png",
    music: "https://open.spotify.com/album/4FmkRi1IEvt3G0PX7i2oaA",
  },
  {
    id: "la-parva-japan",
    title: "la parva",
    description: "edited photograph",
    href: "works/La_Parva/La_Parva_Japan.jpg",
    image: "works/La_Parva/La_Parva_Japan.jpg",
    extraImages: [
      "works/La_Parva/La_Parva_Japan_Enmarcado.png",
      "works/La_Parva/La_Parva_Front.jpeg",
    ],
  },
  {
    id: "flores-recicladas",
    title: "flores recicladas",
    description: "digital collage",
    href: "works/Flores_Recicladas.jpg",
    image: "works/Flores_Recicladas.jpg",
  },
  {
    id: "la-reina-de-babilonia",
    title: "la reina de babilonia",
    description: "digital collage",
    href: "works/La_Reina_De_Babilonia.jpg?v=3",
    image: "works/La_Reina_De_Babilonia.jpg?v=3",
  },
];

// Convierte un enlace normal de Spotify o Suno al formato embebible del
// reproductor. Solo acepta URLs cuyo dominio sea exactamente el esperado,
// para que un link mal pegado no cargue un iframe de otro sitio.
function toEmbed(url: string): { src: string; height: number } | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (parsed.hostname === "open.spotify.com")
    return {
      src: `https://open.spotify.com/embed${parsed.pathname}`,
      height: 80,
    };
  if (parsed.hostname === "suno.com" && parsed.pathname.startsWith("/song/"))
    return {
      src: `https://suno.com/embed/${parsed.pathname.slice("/song/".length)}`,
      height: 240,
    };
  return null;
}

export default function Obras({ lang }: { lang: "en" | "es" }) {
  const [selected, setSelected] = useState<Gallery4Item | null>(null);
  const musicEmbed = selected?.music ? toEmbed(selected.music) : null;
  const copy = {
    title: lang === "en" ? "works" : "obras",
    description:
      lang === "en"
        ? "images, sound, places, and visual experiments."
        : "imágenes, sonido, lugares y experimentos visuales.",
    close: lang === "en" ? "Close ✕" : "Cerrar ✕",
    prev: lang === "en" ? "Previous work" : "Obra anterior",
    next: lang === "en" ? "Next work" : "Siguiente obra",
  };

  // Navega a la obra anterior (-1) o siguiente (+1), en forma circular
  const navigate = (dir: number) => {
    setSelected((prev) => {
      if (!prev) return prev;
      const index = items.findIndex((item) => item.id === prev.id);
      return items[(index + dir + items.length) % items.length];
    });
  };

  // Swipe horizontal en la vista expandida (una navegación por gesto)
  const touchStartX = useRef(0);
  const swipeHandled = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
      if (e.key === "ArrowRight") navigate(1);
      if (e.key === "ArrowLeft") navigate(-1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <main className="pt-14">
      <Gallery4
        title={copy.title}
        description={copy.description}
        items={items}
        onItemClick={setSelected}
      />

      {items.length === 0 && (
        <p className="px-6 pb-32 text-center text-sm text-gray-400 md:px-10">
          coming soon
        </p>
      )}

      {/* Vista expandida */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSelected(null)}
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
            className="fixed inset-0 z-30 flex overflow-y-auto bg-black/70 p-4 backdrop-blur-sm cursor-zoom-out md:p-10"
          >
            <motion.figure
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="relative m-auto max-w-full cursor-default"
            >
              <motion.img
                key={selected.id}
                src={selected.image}
                alt={selected.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="max-h-[80vh] max-w-full rounded-2xl object-contain shadow-2xl"
              />
              {musicEmbed && (
                <iframe
                  src={musicEmbed.src}
                  title={`Player: ${selected.title}`}
                  width="100%"
                  height={musicEmbed.height}
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="relative z-20 mt-3 rounded-xl border-0"
                />
              )}

              <figcaption className="relative z-20 mt-3 flex items-baseline justify-between gap-4 text-white">
                <span className="flex flex-col">
                  <span className="text-sm font-medium">{selected.title}</span>
                  {selected.description && (
                    <span className="text-xs text-white/60">
                      {selected.description}
                    </span>
                  )}
                </span>
                <button
                  onClick={() => setSelected(null)}
                  className="text-xs uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-white"
                >
                  {copy.close}
                </button>
              </figcaption>

              {selected.extraImages?.map((src) => (
                <motion.img
                  key={src}
                  src={src}
                  alt={selected.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="mt-6 max-h-[80vh] w-full rounded-2xl bg-white object-contain p-3 shadow-2xl md:p-4"
                />
              ))}
            </motion.figure>

            {/* Zonas táctiles en los bordes: anterior / siguiente */}
            <button
              type="button"
              aria-label={copy.prev}
              onClick={(e) => {
                e.stopPropagation();
                navigate(-1);
              }}
              className="fixed inset-y-0 left-0 z-10 flex w-[18%] max-w-28 items-center justify-start pl-2 text-white/40 transition-colors hover:text-white active:text-white md:pl-4"
            >
              <span className="text-4xl leading-none">‹</span>
            </button>
            <button
              type="button"
              aria-label={copy.next}
              onClick={(e) => {
                e.stopPropagation();
                navigate(1);
              }}
              className="fixed inset-y-0 right-0 z-10 flex w-[18%] max-w-28 items-center justify-end pr-2 text-white/40 transition-colors hover:text-white active:text-white md:pr-4"
            >
              <span className="text-4xl leading-none">›</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
