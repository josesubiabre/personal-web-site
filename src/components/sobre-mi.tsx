import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";

type Language = "en" | "es";

const PARRAFOS = {
  en: [
    <>
      i was born in santiago, chile. if there is one word that defines me, it is{" "}
      <strong>builder</strong>.
    </>,
    <>
      over the years, i’ve worn different hats and explored different ways of making:
      architecture (and its many branches), music, art, and more recently,
      technology. after studying architecture in chile, i later completed an mba
      at ie business school, where my work moved closer to products, technology,
      and entrepreneurship.
    </>,
    "i love building things, trying new tools, and finding new ways to express ideas. sometimes that becomes a piece of art, sometimes a song, sometimes a product. analog or digital, the impulse is usually the same: to make something new.",
  ],
  es: [
    <>
      nací en santiago, chile. si hay una palabra que me define, es{" "}
      <strong>constructor</strong>.
    </>,
    <>
      a lo largo de los años he usado distintos sombreros y he explorado distintas
      formas de crear: arquitectura (y sus muchas ramas), música, arte y, más
      recientemente, tecnología. después de estudiar arquitectura en chile, luego
      completé un mba en ie business school, donde mi trabajo se acercó más a los
      productos, la tecnología y el emprendimiento.
    </>,
    "me encanta construir cosas, probar nuevas herramientas y encontrar nuevas formas de expresar ideas. a veces eso se convierte en una obra de arte, a veces en una canción y a veces en un producto. ya sea analógico o digital, el impulso suele ser el mismo: crear algo nuevo.",
  ],
};

// Archivo de menciones, citas y entrevistas
const ELSEWHERE = {
  en: [
    {
      source: "BBVA",
      description:
        "cited in a BBVA article on agrovoltaics, solar energy, and cultivating under solar panels.",
      label: "read article",
      href: "https://www.bbva.com/es/sostenibilidad/cosechar-bajo-paneles-solares-los-cultivos-agrovoltaicos-empiezan-a-ver-la-luz/",
    },
    {
      source: "Atacama Agrovoltaic Thesis",
      description:
        "my final architecture thesis exploring how solar infrastructure could enable agriculture in the Atacama Desert.",
      label: "view thesis",
      href: "https://repositorio.uc.cl/handle/11534/26961",
    },
    {
      source: "City Tour",
      description:
        "featured on City Tour before presenting my architecture thesis (segment starts at 12:30).",
      label: "watch video",
      href: "https://www.facebook.com/watch/?v=314418786034435&t=750",
    },
    {
      source: "LinkedIn",
      description: "my professional profile and work history.",
      label: "view profile",
      href: "https://www.linkedin.com/in/josesubiabre/?locale=en",
    },
  ],
  es: [
    {
      source: "BBVA",
      description:
        "citado en un artículo de BBVA sobre agrovoltaica, energía solar y cultivo bajo paneles solares.",
      label: "leer artículo",
      href: "https://www.bbva.com/es/sostenibilidad/cosechar-bajo-paneles-solares-los-cultivos-agrovoltaicos-empiezan-a-ver-la-luz/",
    },
    {
      source: "Tesis Agrovoltaica de Atacama",
      description:
        "mi tesis final de arquitectura sobre cómo la infraestructura solar podría permitir la agricultura en el desierto de Atacama.",
      label: "ver tesis",
      href: "https://repositorio.uc.cl/handle/11534/26961",
    },
    {
      source: "City Tour",
      description:
        "aparecí en City Tour antes de presentar mi tesis de arquitectura (el segmento empieza a las 12:30).",
      label: "ver video",
      href: "https://www.facebook.com/watch/?v=314418786034435&t=750",
    },
    {
      source: "LinkedIn",
      description: "mi perfil profesional y mi trayectoria laboral.",
      label: "ver perfil",
      href: "https://www.linkedin.com/in/josesubiabre/?locale=en",
    },
  ],
};

// posicion controla qué parte de la foto se ve dentro del marco:
//   horizontal: "left" | "center" | "right" | porcentaje ("30%")
//   vertical:   "top"  | "center" | "bottom" | porcentaje ("20%")
// "50% 50%" es el centro exacto. Si se omite, queda centrada.
const FOTOS = [
  { src: "perfil/perfil.jpg", alt: "Portrait of José Subiabre", posicion: "center center" },
  { src: "perfil/Tambo_Ranco.jpg", alt: "Tambo at Lake Ranco", posicion: "center center" },
  { src: "perfil/Tambo_Sleepy.jpg", alt: "Tambo sleeping", posicion: "center center" },
];

function PolaroidPhoto({
  foto,
  isActive,
}: {
  foto: { src: string; alt: string; posicion?: string };
  isActive: boolean;
}) {
  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={foto.src}
          initial={{ opacity: 0, rotate: 0, scale: 0.95 }}
          animate={{ opacity: 1, rotate: 3, scale: 1 }}
          exit={{ opacity: 0, rotate: 0, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative"
        >
          <div className="bg-white p-2 pb-10 shadow-lg">
            <div className="relative h-[280px] w-[220px] overflow-hidden bg-gray-100">
              <img
                src={foto.src}
                alt={foto.alt}
                className="h-full w-full object-cover"
                style={{ objectPosition: foto.posicion ?? "center" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PaginationDots({
  total,
  current,
  onSelect,
}: {
  total: number;
  current: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          className={`h-2 w-2 rounded-full transition-colors duration-200 ${
            index === current ? "bg-black" : "bg-gray-300"
          }`}
          aria-label={`Go to photo ${index + 1}`}
        />
      ))}
    </div>
  );
}

export default function SobreMi({ lang }: { lang: Language }) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const copy = {
    about: lang === "en" ? "about" : "sobre mí",
    elsewhere: lang === "en" ? "elsewhere" : "en otros lugares",
    quote: lang === "en" ? "“go big, because we all go home” – naval ravikant" : "“go big, because we all go home” – naval ravikant",
    archive: lang === "en"
      ? "a small archive of places where my work has been mentioned, cited, or documented."
      : "un pequeño archivo de lugares donde se ha mencionado, citado o documentado mi trabajo.",
    nextPhoto: lang === "en" ? "Next photo" : "Siguiente foto",
    goToPhoto: (index: number) => (lang === "en" ? `Go to photo ${index + 1}` : `Ir a la foto ${index + 1}`),
  };

  return (
    <section className="relative w-full overflow-hidden">
      <main className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col justify-center px-4 pb-[10vh] pt-36 sm:px-6 md:pt-28 lg:px-8">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-16">
          {/* Columna izquierda — título */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center gap-3">
              <h2 className="font-serif text-xl lowercase tracking-tight text-black sm:text-2xl">
                {copy.about}
              </h2>
              <ArrowDown className="h-5 w-5 text-black" strokeWidth={1.5} />
            </div>
          </motion.div>

          {/* Columna central — biografía */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="space-y-6">
              <p className="text-sm italic leading-relaxed text-black">
                {copy.quote}
              </p>

              {PARRAFOS[lang].map((texto, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  className="text-justify text-sm leading-relaxed text-gray-700"
                >
                  {texto}
                </motion.p>
              ))}
            </div>
          </motion.div>

          {/* Columna derecha — carrusel de polaroids */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative mt-6 lg:col-span-5 lg:mt-0"
          >
            <div className="flex flex-col items-center lg:items-end">
              <button
                type="button"
                onClick={() =>
                  setCurrentPhotoIndex((currentPhotoIndex + 1) % FOTOS.length)
                }
                className="relative h-[340px] w-[240px] cursor-pointer"
                aria-label={copy.nextPhoto}
              >
                {FOTOS.map((foto, index) => (
                  <div
                    key={foto.src}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <PolaroidPhoto
                      foto={foto}
                      isActive={index === currentPhotoIndex}
                    />
                  </div>
                ))}
              </button>

              <div className="mt-6 lg:mr-[88px]">
                <PaginationDots
                  total={FOTOS.length}
                  current={currentPhotoIndex}
                  onSelect={setCurrentPhotoIndex}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sección elsewhere — menciones y archivo */}
        <div className="mt-28 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center gap-3">
              <h2 className="font-serif text-xl lowercase tracking-tight text-black sm:text-2xl">
                {copy.elsewhere}
              </h2>
              <ArrowDown className="h-5 w-5 text-black" strokeWidth={1.5} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:col-span-10"
          >
            <p className="text-sm leading-relaxed text-gray-700">
              {copy.archive}
            </p>

            <ul className="mt-8 divide-y divide-gray-200 border-b border-gray-200">
              {ELSEWHERE[lang].map((item) => (
                <li
                  key={item.source}
                  className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-6"
                >
                  <span className="w-44 shrink-0 text-sm font-medium text-black">
                    {item.source}
                  </span>
                  <span className="flex-1 text-sm leading-relaxed text-gray-700">
                    {item.description}
                  </span>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex shrink-0 items-center gap-1 text-sm text-black transition-colors hover:text-blue-700"
                  >
                    {item.label}
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </main>
    </section>
  );
}
