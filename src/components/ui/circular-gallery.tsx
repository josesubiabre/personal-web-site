import React, { useState, useEffect, useRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// Galería circular 3D: las tarjetas se distribuyen en un anillo (rotateY +
// translateZ) que gira con el scroll de la página y auto-rota suave cuando
// no se está scrolleando.

// Define the type for a single gallery item
export interface GalleryItem {
  common: string;
  binomial: string;
  photo: {
    url: string;
    text: string;
    pos?: string;
    by?: string;
  };
}

// Define the props for the CircularGallery component
interface CircularGalleryProps extends HTMLAttributes<HTMLDivElement> {
  items: GalleryItem[];
  /** Controls how far the items are from the center. */
  radius?: number;
  /** Controls the speed of auto-rotation when not scrolling. */
  autoRotateSpeed?: number;
  /** Called when a card is clicked. */
  onItemClick?: (item: GalleryItem, index: number) => void;
}

const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  (
    { items, className, radius = 600, autoRotateSpeed = 0.02, onItemClick, ...props },
    ref,
  ) => {
    const [rotation, setRotation] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    // La rotación total = rotación por scroll + offset manual (arrastre táctil
    // y auto-rotación), así el scroll vertical no "resetea" lo arrastrado
    const scrollRotationRef = useRef(0);
    const offsetRef = useRef(0);
    const dragRef = useRef({ dragging: false, lastX: 0, moved: 0 });

    // Effect to handle scroll-based rotation
    useEffect(() => {
      const handleScroll = () => {
        setIsScrolling(true);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }

        const scrollableHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress =
          scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
        const scrollRotation = scrollProgress * 360;
        scrollRotationRef.current = scrollRotation;
        setRotation(scrollRotation + offsetRef.current);

        scrollTimeoutRef.current = setTimeout(() => {
          setIsScrolling(false);
        }, 150);
      };

      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        window.removeEventListener("scroll", handleScroll);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      };
    }, []);

    // Effect for auto-rotation when not scrolling
    useEffect(() => {
      const autoRotate = () => {
        if (!isScrolling && !dragRef.current.dragging) {
          offsetRef.current += autoRotateSpeed;
          setRotation(scrollRotationRef.current + offsetRef.current);
        }
        animationFrameRef.current = requestAnimationFrame(autoRotate);
      };

      animationFrameRef.current = requestAnimationFrame(autoRotate);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }, [isScrolling, autoRotateSpeed]);

    const anglePerItem = 360 / items.length;

    return (
      <div
        ref={ref}
        role="region"
        aria-label="Circular 3D Gallery"
        className={cn(
          "relative w-full h-full flex items-center justify-center",
          className,
        )}
        style={{ perspective: "2000px", touchAction: "pan-y" }}
        onTouchStart={(e) => {
          dragRef.current = {
            dragging: true,
            lastX: e.touches[0].clientX,
            moved: 0,
          };
        }}
        onTouchMove={(e) => {
          const d = dragRef.current;
          if (!d.dragging) return;
          const x = e.touches[0].clientX;
          const delta = x - d.lastX;
          d.lastX = x;
          d.moved += Math.abs(delta);
          offsetRef.current += delta * 0.35;
          setRotation(scrollRotationRef.current + offsetRef.current);
        }}
        onTouchEnd={() => {
          dragRef.current.dragging = false;
        }}
        {...props}
      >
        <div
          className="relative w-full h-full"
          style={{
            transform: `rotateY(${rotation}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          {items.map((item, i) => {
            const itemAngle = i * anglePerItem;
            const totalRotation = rotation % 360;
            const relativeAngle = (itemAngle + totalRotation + 360) % 360;
            const normalizedAngle = Math.abs(
              relativeAngle > 180 ? 360 - relativeAngle : relativeAngle,
            );
            const opacity = Math.max(0.3, 1 - normalizedAngle / 180);

            return (
              <div
                key={item.photo.url}
                role="group"
                aria-label={item.common}
                onClick={
                  onItemClick
                    ? () => {
                        // Un arrastre no cuenta como click sobre la tarjeta
                        if (dragRef.current.moved > 10) return;
                        onItemClick(item, i);
                      }
                    : undefined
                }
                className={cn(
                  "absolute w-[300px] h-[400px]",
                  onItemClick && "cursor-pointer",
                )}
                style={{
                  transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                  left: "50%",
                  top: "50%",
                  marginLeft: "-150px",
                  marginTop: "-200px",
                  opacity: opacity,
                  transition: "opacity 0.3s linear",
                }}
              >
                <div className="relative w-full h-full rounded-lg shadow-2xl overflow-hidden group border border-border bg-card/70 dark:bg-card/30 backdrop-blur-lg">
                  <img
                    src={item.photo.url}
                    alt={item.photo.text}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ objectPosition: item.photo.pos || "center" }}
                  />
                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                    <h2 className="text-xl font-bold">{item.common}</h2>
                    <em className="text-sm italic opacity-80">{item.binomial}</em>
                    {item.photo.by && (
                      <p className="text-xs mt-2 opacity-70">
                        Photo by: {item.photo.by}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  },
);

CircularGallery.displayName = "CircularGallery";

export { CircularGallery };
