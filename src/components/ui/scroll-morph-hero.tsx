"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence, useTransform, useSpring, useMotionValue } from "framer-motion";
import { IMAGES, titleFromSrc } from "@/lib/obras-data";

// --- Types ---
export type AnimationPhase = "scatter" | "line" | "circle" | "bottom-strip";

interface FlipCardProps {
    src: string;
    index: number;
    total: number;
    phase: AnimationPhase;
    target: { x: number; y: number; rotation: number; scale: number; opacity: number };
    onSelect: () => void;
}

// --- FlipCard Component ---
const IMG_WIDTH = 60;
const IMG_HEIGHT = 85;

function FlipCard({
    src,
    index,
    total,
    phase,
    target,
    onSelect,
    lang,
}: FlipCardProps & { lang: "en" | "es" }) {
    return (
        <motion.div
            onClick={onSelect}
            // Smoothly animate to the coordinates defined by the parent
            animate={{
                x: target.x,
                y: target.y,
                rotate: target.rotation,
                scale: target.scale,
                opacity: target.opacity,
            }}
            transition={{
                type: "spring",
                stiffness: 40,
                damping: 15,
            }}

            // Initial style
            style={{
                position: "absolute",
                width: IMG_WIDTH,
                height: IMG_HEIGHT,
                transformStyle: "preserve-3d", // Essential for the 3D hover effect
                perspective: "1000px",
            }}
            className="cursor-pointer group"
        >
            <motion.div
                className="relative h-full w-full"
                style={{ transformStyle: "preserve-3d" }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                whileHover={{ rotateY: 180 }}
            >
                {/* Front Face */}
                <div
                    className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-lg bg-gray-200"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    <img
                        src={src}
                        alt={`work-${index}`}
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
                </div>

                {/* Back Face */}
                <div
                    className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-lg bg-[#312F2D] flex flex-col items-center justify-center p-4"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                    <div className="text-center">
                        <p className="text-[8px] font-bold text-[#B8B8B8] uppercase tracking-widest mb-1">{lang === "en" ? "View" : "Ver"}</p>
                        <p className="text-xs font-medium text-[#F7F5F2]">{lang === "en" ? "Work" : "Obra"}</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

// --- Main Hero Component ---
const MAX_SCROLL = 3000; // Virtual scroll range

const TOTAL_IMAGES = IMAGES.length;

// Helper for linear interpolation
const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

export default function IntroAnimation({ lang }: { lang: "en" | "es" }) {
    const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter");
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    // --- Selected Image (expanded view) ---
    const [selected, setSelected] = useState<number | null>(null);
    const selectedRef = useRef<number | null>(null);
    selectedRef.current = selected;

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSelected(null);
            if (selectedRef.current === null) return;
            if (e.key === "ArrowRight") setSelected((selectedRef.current + 1) % TOTAL_IMAGES);
            if (e.key === "ArrowLeft") setSelected((selectedRef.current - 1 + TOTAL_IMAGES) % TOTAL_IMAGES);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // --- Container Size ---
    useEffect(() => {
        if (!containerRef.current) return;

        const handleResize = (entries: ResizeObserverEntry[]) => {
            for (const entry of entries) {
                setContainerSize({
                    width: entry.contentRect.width,
                    height: entry.contentRect.height,
                });
            }
        };

        const observer = new ResizeObserver(handleResize);
        observer.observe(containerRef.current);

        // Initial set
        setContainerSize({
            width: containerRef.current.offsetWidth,
            height: containerRef.current.offsetHeight,
        });

        return () => observer.disconnect();
    }, []);

    // --- Virtual Scroll Logic ---
    const virtualScroll = useMotionValue(0);
    const scrollRef = useRef(0); // Keep track of scroll value without re-renders

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Acumulador y cooldown para navegar entre fotos en la vista expandida
        let wheelAcc = 0;
        let lastNavTime = 0;

        const handleWheel = (e: WheelEvent) => {
            // Prevent default to stop browser overscroll/bounce
            e.preventDefault();

            // While an image is expanded, horizontal scroll navigates between photos
            if (selectedRef.current !== null) {
                const now = performance.now();
                if (now - lastNavTime < 400) return; // ignora la inercia del trackpad
                wheelAcc += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
                if (Math.abs(wheelAcc) > 100) {
                    const dir = wheelAcc > 0 ? 1 : -1;
                    wheelAcc = 0;
                    lastNavTime = now;
                    setSelected((selectedRef.current + dir + TOTAL_IMAGES) % TOTAL_IMAGES);
                }
                return;
            }
            wheelAcc = 0;

            const newScroll = Math.min(Math.max(scrollRef.current + e.deltaY, 0), MAX_SCROLL);
            scrollRef.current = newScroll;
            virtualScroll.set(newScroll);
        };

        // Touch support
        let touchStartY = 0;
        let touchStartX = 0;
        let swipeHandled = false;
        const handleTouchStart = (e: TouchEvent) => {
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
            swipeHandled = false;
        };
        const handleTouchMove = (e: TouchEvent) => {
            // While an image is expanded, a horizontal swipe navigates between photos
            if (selectedRef.current !== null) {
                e.preventDefault();
                if (swipeHandled) return;
                const deltaX = e.touches[0].clientX - touchStartX;
                if (Math.abs(deltaX) > 60) {
                    swipeHandled = true; // una navegación por gesto
                    const dir = deltaX < 0 ? 1 : -1; // swipe a la izquierda → siguiente
                    setSelected((selectedRef.current + dir + TOTAL_IMAGES) % TOTAL_IMAGES);
                }
                return;
            }

            const touchY = e.touches[0].clientY;
            const deltaY = touchStartY - touchY;
            touchStartY = touchY;

            const newScroll = Math.min(Math.max(scrollRef.current + deltaY, 0), MAX_SCROLL);
            scrollRef.current = newScroll;
            virtualScroll.set(newScroll);
        };

        // Attach listeners to container instead of window for portability
        container.addEventListener("wheel", handleWheel, { passive: false });
        container.addEventListener("touchstart", handleTouchStart, { passive: false });
        container.addEventListener("touchmove", handleTouchMove, { passive: false });

        return () => {
            container.removeEventListener("wheel", handleWheel);
            container.removeEventListener("touchstart", handleTouchStart);
            container.removeEventListener("touchmove", handleTouchMove);
        };
    }, [virtualScroll]);

    // 1. Morph Progress: 0 (Circle) -> 1 (Bottom Arc)
    // Happens between scroll 0 and 600
    const morphProgress = useTransform(virtualScroll, [0, 600], [0, 1]);
    const smoothMorph = useSpring(morphProgress, { stiffness: 40, damping: 20 });

    // 2. Scroll Rotation (Shuffling): Starts after morph (e.g., > 600)
    // Rotates the bottom arc as user continues scrolling
    const scrollRotate = useTransform(virtualScroll, [600, 3000], [0, 360]);
    const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 40, damping: 20 });

    // --- Mouse Parallax ---
    const mouseX = useMotionValue(0);
    const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const relativeX = e.clientX - rect.left;

            // Normalize -1 to 1
            const normalizedX = (relativeX / rect.width) * 2 - 1;
            // Move +/- 100px
            mouseX.set(normalizedX * 100);
        };
        container.addEventListener("mousemove", handleMouseMove);
        return () => container.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX]);

    // --- Intro Sequence ---
    useEffect(() => {
        const timer1 = setTimeout(() => setIntroPhase("line"), 500);
        const timer2 = setTimeout(() => setIntroPhase("circle"), 2500);
        return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }, []);

    // --- Random Scatter Positions ---
    const scatterPositions = useMemo(() => {
        return IMAGES.map(() => ({
            x: (Math.random() - 0.5) * 1500,
            y: (Math.random() - 0.5) * 1000,
            rotation: (Math.random() - 0.5) * 180,
            scale: 0.6,
            opacity: 0,
        }));
    }, []);

    // --- Render Loop (Manual Calculation for Morph) ---
    const [morphValue, setMorphValue] = useState(0);
    const [rotateValue, setRotateValue] = useState(0);
    const [parallaxValue, setParallaxValue] = useState(0);

    useEffect(() => {
        const unsubscribeMorph = smoothMorph.on("change", setMorphValue);
        const unsubscribeRotate = smoothScrollRotate.on("change", setRotateValue);
        const unsubscribeParallax = smoothMouseX.on("change", setParallaxValue);
        return () => {
            unsubscribeMorph();
            unsubscribeRotate();
            unsubscribeParallax();
        };
    }, [smoothMorph, smoothScrollRotate, smoothMouseX]);

    // --- Content Opacity ---
    // Fade in content when arc is formed (morphValue > 0.8)
    const contentOpacity = useTransform(smoothMorph, [0.8, 1], [0, 1]);
    const contentY = useTransform(smoothMorph, [0.8, 1], [20, 0]);

    return (
        <div ref={containerRef} className="relative w-full h-full bg-[#FAFAFA] overflow-hidden">
            {/* Container */}
            <div className="flex h-full w-full flex-col items-center justify-center perspective-1000">

                {/* Intro Text (Fades out) */}
                <div className="absolute z-0 flex flex-col items-center justify-center text-center pointer-events-none top-1/2 -translate-y-1/2">
                    <motion.h1
                        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                        animate={introPhase === "circle" && morphValue < 0.5 ? { opacity: 1 - morphValue * 2, y: 0, filter: "blur(0px)" } : { opacity: 0, filter: "blur(10px)" }}
                        transition={{ duration: 1 }}
                        className="px-6 text-lg font-medium tracking-tight text-gray-800 sm:text-2xl md:text-3xl"
                    >
                        <span className="block">
                            {lang === "en" ? "photography · art · music" : "fotografía · arte · música"}
                        </span>
                        <span className="block">vibecode</span>
                    </motion.h1>
                </div>

                {/* Arc Active Content (Fades in) */}
                <motion.div
                    style={{ opacity: contentOpacity, y: contentY }}
                    className="absolute top-36 z-10 flex flex-col items-center justify-center text-center pointer-events-none px-4 md:top-[10%]"
                >
                    <h2 className="text-3xl md:text-5xl font-semibold text-gray-900 tracking-tight mb-4">
                        {lang === "en" ? "Explore the work" : "Explora la obra"}
                    </h2>
                    <p className="text-sm md:text-base text-gray-600 max-w-lg leading-relaxed">
                        {lang === "en" ? "A selection of personal works." : "Una selección de obras personales."}{" "}
                        <br className="hidden md:block" />
                        {lang === "en" ? "Scroll to browse the selection." : "Haz scroll para recorrer la selección."}
                    </p>
                </motion.div>

                {/* Main Container */}
                <div className="relative flex items-center justify-center w-full h-full">
                    {IMAGES.slice(0, TOTAL_IMAGES).map((src, i) => {
                        let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

                        // 1. Intro Phases (Scatter -> Line)
                        if (introPhase === "scatter") {
                            target = scatterPositions[i];
                        } else if (introPhase === "line") {
                            const lineSpacing = 70; // Adjusted for smaller images (60px width + 10px gap)
                            const lineTotalWidth = TOTAL_IMAGES * lineSpacing;
                            const lineX = i * lineSpacing - lineTotalWidth / 2;
                            target = { x: lineX, y: 0, rotation: 0, scale: 1, opacity: 1 };
                        } else {
                            // 2. Circle Phase & Morph Logic

                            // Responsive Calculations
                            const isMobile = containerSize.width < 768;
                            const minDimension = Math.min(containerSize.width, containerSize.height);

                            // A. Calculate Circle Position
                            // En móvil el círculo es proporcionalmente más grande y las
                            // tarjetas más chicas para que el hueco central respire
                            const circleRadius = Math.min(minDimension * (isMobile ? 0.42 : 0.35), 350);

                            const circleAngle = (i / TOTAL_IMAGES) * 360;
                            const circleRad = (circleAngle * Math.PI) / 180;
                            const circlePos = {
                                x: Math.cos(circleRad) * circleRadius,
                                y: Math.sin(circleRad) * circleRadius,
                                rotation: circleAngle + 90,
                            };

                            // B. Calculate Bottom Arc Position
                            // "Rainbow" Arch: Convex up. Center is highest point.

                            // Radius:
                            const baseRadius = Math.min(containerSize.width, containerSize.height * 1.5);
                            const arcRadius = baseRadius * (isMobile ? 1.4 : 1.1);

                            // Position:
                            const arcApexY = containerSize.height * (isMobile ? 0.35 : 0.25);
                            const arcCenterY = arcApexY + arcRadius;

                            // Spread angle:
                            const spreadAngle = isMobile ? 100 : 130;
                            const startAngle = -90 - (spreadAngle / 2);
                            const step = spreadAngle / (TOTAL_IMAGES - 1);

                            // Let's interpret rotateValue (0 to 360) as a progress 0 to 1
                            const scrollProgress = Math.min(Math.max(rotateValue / 360, 0), 1);

                            // Calculate bounded rotation:
                            // Map scroll to: 0 -> -spreadAngle (shifts items left)
                            const maxRotation = spreadAngle * 0.8; // Don't go all the way, keep last item visible
                            const boundedRotation = -scrollProgress * maxRotation;

                            const currentArcAngle = startAngle + (i * step) + boundedRotation;
                            const arcRad = (currentArcAngle * Math.PI) / 180;

                            const arcPos = {
                                x: Math.cos(arcRad) * arcRadius + parallaxValue,
                                y: Math.sin(arcRad) * arcRadius + arcCenterY,
                                rotation: currentArcAngle + 90,
                                scale: isMobile ? 1.4 : 1.8, // Increased scale for active state
                            };

                            // C. Interpolate (Morph)
                            target = {
                                x: lerp(circlePos.x, arcPos.x, morphValue),
                                y: lerp(circlePos.y, arcPos.y, morphValue),
                                rotation: lerp(circlePos.rotation, arcPos.rotation, morphValue),
                                scale: lerp(isMobile ? 0.7 : 1, arcPos.scale, morphValue),
                                opacity: 1,
                            };
                        }

                        return (
                            <FlipCard
                                key={i}
                                src={src}
                                index={i}
                                total={TOTAL_IMAGES}
                                phase={introPhase} // Pass intro phase for initial animations
                                target={target}
                                onSelect={() => setSelected(i)}
                                lang={lang}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Expanded Image Overlay */}
            <AnimatePresence>
                {selected !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        onClick={() => setSelected(null)}
                        className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 md:p-10 cursor-zoom-out"
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
                                key={selected}
                                src={IMAGES[selected]}
                                alt={titleFromSrc(IMAGES[selected])}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                                className="max-h-[80vh] max-w-full rounded-2xl object-contain shadow-2xl"
                            />
                            <figcaption className="relative z-20 mt-3 flex items-baseline justify-between gap-4 text-white">
                                <span className="text-sm font-medium">
                                    {titleFromSrc(IMAGES[selected])}
                                    <span className="ml-2 text-xs uppercase tracking-[0.14em] text-white/50">
                                        {selected + 1} / {TOTAL_IMAGES}
                                    </span>
                                </span>
                                <button
                                    onClick={() => setSelected(null)}
                                    className="text-xs uppercase tracking-[0.14em] text-white/70 transition-colors hover:text-white"
                                >
                                    {lang === "en" ? "Close ✕" : "Cerrar ✕"}
                                </button>
                            </figcaption>
                        </motion.figure>

                        {/* Zonas táctiles en los bordes: anterior / siguiente */}
                        <button
                            type="button"
                            aria-label={lang === "en" ? "Previous photo" : "Foto anterior"}
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelected((selected - 1 + TOTAL_IMAGES) % TOTAL_IMAGES);
                            }}
                            className="absolute inset-y-0 left-0 z-10 flex w-[18%] max-w-28 items-center justify-start pl-2 text-white/40 transition-colors hover:text-white active:text-white md:pl-4"
                        >
                            <span className="text-4xl leading-none">‹</span>
                        </button>
                        <button
                            type="button"
                            aria-label={lang === "en" ? "Next photo" : "Foto siguiente"}
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelected((selected + 1) % TOTAL_IMAGES);
                            }}
                            className="absolute inset-y-0 right-0 z-10 flex w-[18%] max-w-28 items-center justify-end pr-2 text-white/40 transition-colors hover:text-white active:text-white md:pr-4"
                        >
                            <span className="text-4xl leading-none">›</span>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
