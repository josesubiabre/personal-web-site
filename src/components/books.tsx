import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { CircularGallery, type GalleryItem } from "@/components/ui/circular-gallery";

// Libros que marcaron mi forma de pensar. Para agregar uno: pon la portada
// en public/books/ y añade aquí { common: título, binomial: autor, photo.url }.
const LIBROS: GalleryItem[] = [
  {
    common: "siddhartha",
    binomial: "hermann hesse",
    photo: {
      url: "books/Hesse_Hermann_Siddhartha.jpg",
      text: "Siddhartha book cover",
    },
  },
  {
    common: "big sur",
    binomial: "jack kerouac",
    photo: {
      url: "books/Keroauc_Jack_Big_Sur.jpg",
      text: "Big Sur book cover",
    },
  },
  {
    common: "the lessons of history",
    binomial: "will & ariel durant",
    photo: {
      url: "books/Durant_Will_Ariel_The_Lessons_of_history.jpg",
      text: "The Lessons of History book cover",
    },
  },
  {
    common: "poor charlie's almanack",
    binomial: "charlie munger",
    photo: {
      url: "books/Poor_Charlies_Almanack.jpg",
      text: "Poor Charlie's Almanack book cover",
    },
  },
  {
    common: "the almanack of naval ravikant",
    binomial: "eric jorgenson",
    photo: {
      url: "books/Jorgenson_Erik_The_Almanack_of_Naval_v2.jpg",
      text: "The Almanack of Naval Ravikant book cover",
    },
  },
  {
    common: "build",
    binomial: "tony fadell",
    photo: {
      url: "books/Fadell_Tony_Build.jpg",
      text: "Build book cover",
    },
  },
  {
    common: "discipline is destiny",
    binomial: "ryan holiday",
    photo: {
      url: "books/Holiday_Ryan_Discipline_is_destiny.jpg",
      text: "Discipline Is Destiny book cover",
    },
  },
  {
    common: "breath",
    binomial: "james nestor",
    photo: {
      url: "books/Breathe_James_Deep.jpg",
      text: "Breath book cover",
    },
  },
  {
    common: "deep",
    binomial: "james nestor",
    photo: {
      url: "books/Nestor_James_Deep.jpg",
      text: "Deep book cover",
    },
  },
];

export default function Books() {
  // El alto del contenedor da el recorrido de scroll que gira la galería
  const scrollRef = useRef<HTMLDivElement>(null);

  // Al entrar desde otra vista, partir con el primer libro al frente
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div ref={scrollRef} className="w-full" style={{ height: "500vh" }}>
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
          <CircularGallery items={LIBROS} scrollRef={scrollRef} />
        </div>
      </div>
    </div>
  );
}
