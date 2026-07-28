import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { CircularGallery, type GalleryItem } from "@/components/ui/circular-gallery";

// Libros que marcaron mi forma de pensar. Para agregar uno: pon la portada
// en public/books/ y añade aquí una entrada con título, autor, género y
// reseña (resumen de la descripción de Goodreads).
type Libro = GalleryItem & { genero: string; resena: string };

const LIBROS: Libro[] = [
  {
    common: "siddhartha",
    binomial: "hermann hesse",
    genero: "fiction · philosophy",
    resena:
      "A young Brahmin leaves his family for a contemplative life, then, restless, discards it for one of the flesh. Near despair, Siddhartha comes to a river where he hears a unique sound — the true beginning of his life: suffering, rejection, peace and, finally, wisdom.",
    photo: {
      url: "books/Hesse_Hermann_Siddhartha.jpg",
      text: "Siddhartha book cover",
    },
  },
  {
    common: "big sur",
    binomial: "jack kerouac",
    genero: "fiction · beat generation",
    resena:
      "Kerouac's alter ego Jack Duluoz, worn down by fame and drink, retreats to a cabin on the California coast seeking peace — and finds instead a raw confrontation with himself, told in the wild, honest prose that defined the Beat Generation.",
    photo: {
      url: "books/Keroauc_Jack_Big_Sur.jpg",
      text: "Big Sur book cover",
    },
  },
  {
    common: "the lessons of history",
    binomial: "will & ariel durant",
    genero: "history",
    resena:
      "The celebrated collection of essays distilling four decades of work on The Story of Civilization into timeless observations on human nature, war, religion, economics and government — five thousand years of history in a hundred pages.",
    photo: {
      url: "books/Durant_Will_Ariel_The_Lessons_of_history.jpg",
      text: "The Lessons of History book cover",
    },
  },
  {
    common: "poor charlie's almanack",
    binomial: "charlie munger & peter d. kaufman",
    genero: "business · philosophy",
    resena:
      "The essential talks, speeches and wit of Charlie Munger, Warren Buffett's longtime partner — a masterclass in multidisciplinary thinking, mental models, inverting problems and the pursuit of worldly wisdom.",
    photo: {
      url: "books/Kaufman_Peter_D_Charlie_Munger_Poor_Charlies_Almanack.jpg",
      text: "Poor Charlie's Almanack book cover",
    },
  },
  {
    common: "the almanack of naval ravikant",
    binomial: "eric jorgenson",
    genero: "philosophy · wealth",
    resena:
      "A curated collection of Naval Ravikant's wisdom from the last decade, in his own words: how to build wealth without luck, and how to cultivate happiness as a skill — a guide to walking your own path toward a wealthier, happier life.",
    photo: {
      url: "books/Jorgenson_Erik_The_Almanack_of_Naval_v2.jpg",
      text: "The Almanack of Naval Ravikant book cover",
    },
  },
  {
    common: "the sovereign individual",
    binomial: "james dale davidson & william rees-mogg",
    genero: "economics · future",
    resena:
      "Written in 1997, an eerily prescient map of the greatest economic and political transition in centuries — the shift from an industrial to an information-based society — and how it transforms money, politics and personal sovereignty.",
    photo: {
      url: "books/Davidson_James_Dale_Rees-Mogg_Lord_Williams_The_Sovereign_individual.jpg",
      text: "The Sovereign Individual book cover",
    },
  },
  {
    common: "build",
    binomial: "tony fadell",
    genero: "business · memoir",
    resena:
      "The creator of the iPod and iPhone and founder of Nest shares an unorthodox guide to making things worth making — decades of hard-won lessons about products, teams, leadership and building a life of purpose.",
    photo: {
      url: "books/Fadell_Tony_Build.jpg",
      text: "Build book cover",
    },
  },
  {
    common: "shoe dog",
    binomial: "phil knight",
    genero: "business · memoir",
    resena:
      "The candid memoir of Nike's founder: starting with fifty dollars borrowed from his father and a crazy idea — importing running shoes from Japan — Knight tells the messy, perilous and chaotic story behind one of the world's most iconic brands.",
    photo: {
      url: "books/Knight_Phil_Shoe_Dog.png",
      text: "Shoe Dog book cover",
    },
  },
  {
    common: "discipline is destiny",
    binomial: "ryan holiday",
    genero: "philosophy · stoicism",
    resena:
      "Drawing on figures from Marcus Aurelius to Lou Gehrig, Holiday explores self-discipline — temperance, the second of the four Stoic virtues — and shows how the greatest freedom is won through command over oneself.",
    photo: {
      url: "books/Holiday_Ryan_Discipline_is_destiny.jpg",
      text: "Discipline Is Destiny book cover",
    },
  },
  {
    common: "breath",
    binomial: "james nestor",
    genero: "science · health",
    resena:
      "There is nothing more essential to health than breathing — yet humans have lost the ability to do it correctly. Nestor travels the world to figure out what went wrong, testing ancient practices against modern science, with transformative results.",
    photo: {
      url: "books/Breathe_James_Deep.jpg",
      text: "Breath book cover",
    },
  },
  {
    common: "deep",
    binomial: "james nestor",
    genero: "science · adventure",
    resena:
      "A plunge into freediving and renegade ocean science: record-setting divers and researchers reveal the hidden abilities of the human body — and what the deepest places on Earth tell us about ourselves.",
    photo: {
      url: "books/Nestor_James_Deep.jpg",
      text: "Deep book cover",
    },
  },
];

export default function Books() {
  const [selected, setSelected] = useState<Libro | null>(null);

  // Al entrar desde otra vista, partir con el primer libro al frente
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Radio del anillo 3D según el ancho de pantalla
  const [radius, setRadius] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 640 ? 450 : 600,
  );
  useEffect(() => {
    const onResize = () => setRadius(window.innerWidth < 640 ? 450 : 600);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="w-full" style={{ height: "500vh" }}>
      <div className="sticky top-0 flex h-dvh w-full flex-col items-center overflow-hidden">
        {/* Título y descripción */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute top-24 z-10 flex flex-col items-center px-6 text-center md:top-28"
        >
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-xl lowercase tracking-tight text-black sm:text-2xl">
              books
            </h2>
            <ArrowDown className="h-5 w-5 text-black" strokeWidth={1.5} />
          </div>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-700">
            some of the books that had a significant impact in my thinking and
            life.
          </p>
        </motion.div>

        <div className="h-full w-full">
          {/* Bajamos y encogemos un poco el anillo para despejar el título */}
          <CircularGallery
            items={LIBROS}
            radius={radius}
            className="translate-y-[9%] scale-[0.72] sm:scale-[0.88]"
            onItemClick={(_, i) => setSelected(LIBROS[i])}
          />
        </div>
      </div>

      {/* Modal: portada + reseña */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-30 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm cursor-zoom-out md:p-10"
          >
            <motion.article
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ type: "spring", stiffness: 220, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="relative m-auto flex max-w-2xl cursor-default flex-col gap-6 rounded-2xl bg-white p-6 shadow-2xl sm:flex-row sm:gap-8 sm:p-8"
            >
              <img
                src={selected.photo.url}
                alt={selected.photo.text}
                className="mx-auto h-64 w-auto shrink-0 self-start rounded-md object-contain shadow-lg sm:mx-0 sm:h-72"
              />
              <div className="flex flex-col">
                <h3 className="font-serif text-2xl tracking-tight text-black sm:text-3xl">
                  {selected.common}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  by {selected.binomial} · {selected.genero}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-gray-700">
                  {selected.resena}
                </p>
                <button
                  onClick={() => setSelected(null)}
                  className="mt-6 self-start text-xs uppercase tracking-[0.14em] text-gray-400 transition-colors hover:text-black"
                >
                  Close ✕
                </button>
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
