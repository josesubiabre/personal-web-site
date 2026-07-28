import { useEffect, useState, type RefObject } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";

// Galería circular movida por scroll: las tarjetas orbitan una rueda cuyo
// centro está en el borde inferior del viewport; al hacer scroll la rueda
// gira hasta dejar el último item al frente. La ficha del item activo se
// muestra al centro del arco.
export type GalleryItem = {
  common: string; // línea principal (título)
  binomial: string; // línea secundaria (autor / nombre científico)
  photo: {
    url: string;
    text: string; // alt de la imagen
    pos?: string; // object-position opcional
    by?: string; // crédito opcional
  };
};

type CircularGalleryProps = {
  items: GalleryItem[];
  // Contenedor alto (ej. 500vh) cuyo progreso de scroll mueve la rueda.
  // Sin ref, usa el scroll de la página completa.
  scrollRef?: RefObject<HTMLElement | null>;
};

// Radio de la rueda, ancho de tarjeta y cuánto baja el centro de la rueda
// respecto del borde inferior del viewport, según el ancho de la ventana
function medidas(width: number): {
  radius: number;
  cardW: number;
  offset: number;
} {
  if (width < 640) return { radius: 300, cardW: 132, offset: 140 };
  if (width < 1024) return { radius: 440, cardW: 176, offset: 200 };
  return { radius: 560, cardW: 208, offset: 260 };
}

export function CircularGallery({ items, scrollRef }: CircularGalleryProps) {
  const step = 360 / items.length;

  const { scrollYProgress } = useScroll(
    scrollRef
      ? { target: scrollRef, offset: ["start start", "end end"] }
      : undefined,
  );

  // Gira justo lo necesario para que cada item pase por el frente una vez
  const rotation = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -step * (items.length - 1)],
  );

  const [active, setActive] = useState(0);
  useMotionValueEvent(rotation, "change", (r) => {
    const i = Math.round(-r / step);
    setActive(Math.min(items.length - 1, Math.max(0, i)));
  });

  const [{ radius, cardW, offset }, setMedidas] = useState(() =>
    medidas(typeof window === "undefined" ? 1280 : window.innerWidth),
  );
  useEffect(() => {
    const onResize = () => setMedidas(medidas(window.innerWidth));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const cardH = Math.round(cardW * 1.5); // proporción retrato 2:3
  const item = items[active];

  // Borde superior de la tarjeta frontal medido desde el borde inferior del
  // viewport: la ficha se ancla justo encima para no tapar la portada
  const fichaBottom = radius + cardH / 2 - offset + 16;

  return (
    <div className="relative h-full w-full">
      {/* Ficha del item al frente */}
      <div
        className="pointer-events-none absolute inset-x-0 z-10 flex flex-col items-center px-6 text-center"
        style={{ bottom: fichaBottom }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <h3 className="font-serif text-2xl tracking-tight text-black sm:text-3xl">
              {item.common}
            </h3>
            <p className="mt-1 text-sm text-gray-500">{item.binomial}</p>
            {item.photo.by && (
              <p className="mt-1 text-xs text-gray-400">photo: {item.photo.by}</p>
            )}
          </motion.div>
        </AnimatePresence>
        <p className="mt-3 text-[0.65rem] uppercase tracking-[0.2em] text-gray-400">
          {active + 1} / {items.length}
        </p>
      </div>

      {/* Rueda: un punto centrado bajo el borde inferior del viewport; cada
          tarjeta orbita alrededor con orientación tangencial */}
      <motion.div
        style={{ rotate: rotation, top: `calc(100% + ${offset}px)` }}
        className="absolute left-1/2 h-0 w-0"
      >
        {items.map((it, i) => (
          <div
            key={it.photo.url}
            className="absolute transition-transform duration-300"
            style={{
              width: cardW,
              height: cardH,
              left: -cardW / 2,
              top: -cardH / 2,
              transform: `rotate(${i * step}deg) translateY(-${radius}px) scale(${
                i === active ? 1.06 : 0.94
              })`,
            }}
          >
            <figure
              className={`h-full w-full overflow-hidden rounded-lg shadow-xl transition-opacity duration-300 ${
                i === active ? "opacity-100" : "opacity-80"
              }`}
            >
              <img
                src={it.photo.url}
                alt={it.photo.text}
                loading="lazy"
                draggable={false}
                className="h-full w-full select-none object-cover"
                style={it.photo.pos ? { objectPosition: it.photo.pos } : undefined}
              />
            </figure>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
