import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { CircularGallery, type GalleryItem } from "@/components/ui/circular-gallery";

// Libros que marcaron mi forma de pensar. Para agregar uno: pon la portada
// en public/books/ y añade aquí una entrada con título, autor, género y
// reseña (resumen de la descripción de Goodreads) en ambos idiomas.
type Textos = { en: string; es: string };

type Libro = GalleryItem & { genero: Textos; resena: Textos };

const LIBROS: Libro[] = [
  {
    common: "siddhartha",
    binomial: "hermann hesse",
    genero: { en: "fiction · philosophy", es: "ficción · filosofía" },
    resena: {
      en: "A young Brahmin leaves his family for a contemplative life, then, restless, discards it for one of the flesh. Near despair, Siddhartha comes to a river where he hears a unique sound — the true beginning of his life: suffering, rejection, peace and, finally, wisdom.",
      es: "Un joven brahmán abandona a su familia por una vida contemplativa y luego, inquieto, la deja por una vida carnal. Al borde de la desesperación, Siddhartha llega a un río donde escucha un sonido único — el verdadero comienzo de su vida: sufrimiento, rechazo, paz y, finalmente, sabiduría.",
    },
    photo: {
      url: "books/Hesse_Hermann_Siddhartha.jpg",
      text: "Siddhartha book cover",
    },
  },
  {
    common: "on the road",
    binomial: "jack kerouac",
    genero: { en: "fiction · beat generation", es: "ficción · generación beat" },
    resena: {
      en: "The novel that defined the Beat Generation, based on Kerouac's own travels: Sal Paradise and Dean Moriarty crisscross America in a restless search for jazz, freedom and meaning — a feverish celebration of the road, friendship and the hunger to live everything at once.",
      es: "La novela que definió a la Generación Beat, basada en los viajes del propio Kerouac: Sal Paradise y Dean Moriarty cruzan Estados Unidos de punta a punta en una búsqueda inquieta de jazz, libertad y sentido — una celebración febril de la carretera, la amistad y el hambre de vivirlo todo a la vez.",
    },
    photo: {
      url: "books/Keroauc_Jack_On_the_road.jpg",
      text: "On the Road book cover",
    },
  },
  {
    common: "the lessons of history",
    binomial: "will & ariel durant",
    genero: { en: "history", es: "historia" },
    resena: {
      en: "The celebrated collection of essays distilling four decades of work on The Story of Civilization into timeless observations on human nature, war, religion, economics and government — five thousand years of history in a hundred pages.",
      es: "La célebre colección de ensayos que destila cuatro décadas de trabajo en The Story of Civilization en observaciones atemporales sobre la naturaleza humana, la guerra, la religión, la economía y el gobierno — cinco mil años de historia en cien páginas.",
    },
    photo: {
      url: "books/Durant_Will_Ariel_The_Lessons_of_history.jpg",
      text: "The Lessons of History book cover",
    },
  },
  {
    common: "poor charlie's almanack",
    binomial: "charlie munger & peter d. kaufman",
    genero: { en: "business · philosophy", es: "negocios · filosofía" },
    resena: {
      en: "The essential talks, speeches and wit of Charlie Munger, Warren Buffett's longtime partner — a masterclass in multidisciplinary thinking, mental models, inverting problems and the pursuit of worldly wisdom.",
      es: "Las charlas, discursos e ingenio esenciales de Charlie Munger, socio de toda la vida de Warren Buffett — una clase magistral de pensamiento multidisciplinario, modelos mentales, inversión de problemas y búsqueda de la sabiduría mundana.",
    },
    photo: {
      url: "books/Kaufman_Peter_D_Charlie_Munger_Poor_Charlies_Almanack.jpg",
      text: "Poor Charlie's Almanack book cover",
    },
  },
  {
    common: "the almanack of naval ravikant",
    binomial: "eric jorgenson",
    genero: { en: "philosophy · wealth", es: "filosofía · riqueza" },
    resena: {
      en: "A curated collection of Naval Ravikant's wisdom from the last decade, in his own words: how to build wealth without luck, and how to cultivate happiness as a skill — a guide to walking your own path toward a wealthier, happier life.",
      es: "Una colección curada de la sabiduría de Naval Ravikant de la última década, en sus propias palabras: cómo construir riqueza sin depender de la suerte y cómo cultivar la felicidad como una habilidad — una guía para recorrer tu propio camino hacia una vida más rica y feliz.",
    },
    photo: {
      url: "books/Jorgenson_Erik_The_Almanack_of_Naval_v2.jpg",
      text: "The Almanack of Naval Ravikant book cover",
    },
  },
  {
    common: "the sovereign individual",
    binomial: "james dale davidson & william rees-mogg",
    genero: { en: "economics · future", es: "economía · futuro" },
    resena: {
      en: "Written in 1997, an eerily prescient map of the greatest economic and political transition in centuries — the shift from an industrial to an information-based society — and how it transforms money, politics and personal sovereignty.",
      es: "Escrito en 1997, un mapa inquietantemente profético de la mayor transición económica y política en siglos — el paso de una sociedad industrial a una basada en la información — y de cómo transforma el dinero, la política y la soberanía personal.",
    },
    photo: {
      url: "books/Davidson_James_Dale_Rees-Mogg_Lord_Williams_The_Sovereign_individual.jpg",
      text: "The Sovereign Individual book cover",
    },
  },
  {
    common: "build",
    binomial: "tony fadell",
    genero: { en: "business · memoir", es: "negocios · memorias" },
    resena: {
      en: "The creator of the iPod and iPhone and founder of Nest shares an unorthodox guide to making things worth making — decades of hard-won lessons about products, teams, leadership and building a life of purpose.",
      es: "El creador del iPod y el iPhone y fundador de Nest comparte una guía poco ortodoxa para hacer cosas que valga la pena hacer — décadas de lecciones duramente aprendidas sobre productos, equipos, liderazgo y una vida con propósito.",
    },
    photo: {
      url: "books/Fadell_Tony_Build.jpg",
      text: "Build book cover",
    },
  },
  {
    common: "shoe dog",
    binomial: "phil knight",
    genero: { en: "business · memoir", es: "negocios · memorias" },
    resena: {
      en: "The candid memoir of Nike's founder: starting with fifty dollars borrowed from his father and a crazy idea — importing running shoes from Japan — Knight tells the messy, perilous and chaotic story behind one of the world's most iconic brands.",
      es: "Las memorias sinceras del fundador de Nike: partiendo con cincuenta dólares prestados por su padre y una idea loca — importar zapatillas de running desde Japón — Knight cuenta la historia desordenada, arriesgada y caótica detrás de una de las marcas más icónicas del mundo.",
    },
    photo: {
      url: "books/Knight_Phil_Shoe_Dog.png",
      text: "Shoe Dog book cover",
    },
  },
  {
    common: "discipline is destiny",
    binomial: "ryan holiday",
    genero: { en: "philosophy · stoicism", es: "filosofía · estoicismo" },
    resena: {
      en: "Drawing on figures from Marcus Aurelius to Lou Gehrig, Holiday explores self-discipline — temperance, the second of the four Stoic virtues — and shows how the greatest freedom is won through command over oneself.",
      es: "Recurriendo a figuras que van de Marco Aurelio a Lou Gehrig, Holiday explora la autodisciplina — la templanza, la segunda de las cuatro virtudes estoicas — y muestra cómo la mayor libertad se conquista con el dominio de uno mismo.",
    },
    photo: {
      url: "books/Holiday_Ryan_Discipline_is_destiny.jpg",
      text: "Discipline Is Destiny book cover",
    },
  },
  {
    common: "breath",
    binomial: "james nestor",
    genero: { en: "science · health", es: "ciencia · salud" },
    resena: {
      en: "There is nothing more essential to health than breathing — yet humans have lost the ability to do it correctly. Nestor travels the world to figure out what went wrong, testing ancient practices against modern science, with transformative results.",
      es: "No hay nada más esencial para la salud que respirar — y sin embargo los humanos hemos perdido la capacidad de hacerlo correctamente. Nestor recorre el mundo para descubrir qué salió mal, poniendo a prueba prácticas ancestrales frente a la ciencia moderna, con resultados transformadores.",
    },
    photo: {
      url: "books/Breathe_James_Deep.jpg",
      text: "Breath book cover",
    },
  },
];

export default function Books({ lang }: { lang: "en" | "es" }) {
  const [selected, setSelected] = useState<Libro | null>(null);
  const copy = {
    title: lang === "en" ? "books" : "libros",
    description:
      lang === "en"
        ? "some of the books that had a significant impact in my thinking and life."
        : "algunos de los libros que tuvieron un impacto significativo en mi forma de pensar y en mi vida.",
    by: lang === "en" ? "by" : "por",
    close: lang === "en" ? "Close ✕" : "Cerrar ✕",
  };

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

  // Radio del anillo 3D: la distancia entre tarjetas vecinas es
  // 2·r·sin(180°/N), así que con más libros hace falta más radio para que
  // las portadas (300px) no queden pegadas; en móvil se compensa con la
  // escala del contenedor para que igual quepa en pantalla
  const radioSegunAncho = () => (window.innerWidth < 640 ? 620 : 600);
  const [radius, setRadius] = useState(() =>
    typeof window !== "undefined" ? radioSegunAncho() : 600,
  );
  useEffect(() => {
    const onResize = () => setRadius(radioSegunAncho());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="w-full" style={{ height: "500vh" }}>
      <div className="sticky top-0 flex h-dvh w-full flex-col items-center overflow-hidden">
        {/* Título y descripción */}
        <div className="absolute inset-x-0 top-36 z-10 md:top-28">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <h2 className="font-serif text-xl lowercase tracking-tight text-black sm:text-2xl dark:text-white">
                {copy.title}
              </h2>
              <ArrowDown className="h-5 w-5 text-black dark:text-white" strokeWidth={1.5} />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 max-w-md text-sm leading-relaxed text-gray-700 dark:text-gray-300"
            >
              {copy.description}
            </motion.p>
          </div>
        </div>

        <div className="h-full w-full">
          {/* Bajamos y encogemos un poco el anillo para despejar el título;
              en móvil baja más porque el subtítulo ocupa más alto */}
          <CircularGallery
            items={LIBROS}
            radius={radius}
            className="translate-y-[16%] scale-[0.58] sm:translate-y-[9%] sm:scale-[0.88]"
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
              className="relative m-auto flex max-w-2xl cursor-default flex-col gap-6 rounded-2xl bg-white p-6 shadow-2xl sm:flex-row sm:gap-8 sm:p-8 dark:bg-neutral-900"
            >
              <img
                src={selected.photo.url}
                alt={selected.photo.text}
                className="mx-auto h-64 w-auto shrink-0 self-start rounded-md object-contain shadow-lg sm:mx-0 sm:h-72"
              />
              <div className="flex flex-col">
                <h3 className="font-serif text-2xl tracking-tight text-black sm:text-3xl dark:text-white">
                  {selected.common}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {copy.by} {selected.binomial} · {selected.genero[lang]}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  {selected.resena[lang]}
                </p>
                <button
                  onClick={() => setSelected(null)}
                  className="mt-6 self-start text-xs uppercase tracking-[0.14em] text-gray-400 transition-colors hover:text-black dark:text-gray-500 dark:hover:text-white"
                >
                  {copy.close}
                </button>
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
