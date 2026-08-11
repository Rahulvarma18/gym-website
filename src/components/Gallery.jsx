import { useEffect, useRef, useState } from "react";
import heroAthlete from "../assets/hero-athlete.png";
import Reveal from "./Reveal";

const items = [
    {
        img: heroAthlete,
        label: "Under the bar",
        tag: "Barbell Club",
    },
    {
        img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1000&q=80",
        label: "Chase the number",
        tag: "Powerlifting Team",
    },
    {
        img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1000&q=80",
        label: "Loaded and ready",
        tag: "The Floor",
    },
    {
        img: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=1000&q=80",
        label: "Learn it right",
        tag: "Foundations",
    },
    {
        img: "https://images.unsplash.com/photo-1517964603305-11c0f6f66012?w=1000&q=80",
        label: "Technique first",
        tag: "Weightlifting",
    },
];

export default function Gallery() {
    const wrapRef = useRef(null);
    const trackRef = useRef(null);
    const [offset, setOffset] = useState(0);
    const [enabled, setEnabled] = useState(true);

    useEffect(() => {
        const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const mqNarrow = window.matchMedia("(max-width: 767px)").matches;
        if (mqReduced || mqNarrow) {
            setEnabled(false);
            return;
        }

        let raf = null;
        const onScroll = () => {
            if (raf) return;
            raf = requestAnimationFrame(() => {
                raf = null;
                const wrap = wrapRef.current;
                const track = trackRef.current;
                if (!wrap || !track) return;

                const rect = wrap.getBoundingClientRect();
                const scrollable = rect.height - window.innerHeight;
                const progress = scrollable > 0
                    ? Math.min(Math.max(-rect.top / scrollable, 0), 1)
                    : 0;

                const maxTranslate = Math.max(track.scrollWidth - window.innerWidth, 0);
                setOffset(-progress * maxTranslate);
            });
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        onScroll();
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, []);

    return (
        <section className="border-b border-steel-dim/40 bg-concrete">
            <div className="mx-auto max-w-6xl px-6 pt-24">
                <Reveal>
                    <span className="font-mono text-xs uppercase tracking-[0.3em] text-ember">
                        The Floor
                    </span>
                    <h2 className="mt-3 font-display text-4xl uppercase text-paper sm:text-5xl">
                        Every session, on record.
                    </h2>
                </Reveal>
            </div>

            {enabled ? (
                <div ref={wrapRef} style={{ height: "250vh" }} className="relative mt-10">
                    <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                        <div
                            ref={trackRef}
                            className="flex gap-6 px-6 will-change-transform"
                            style={{ transform: `translateX(${offset}px)` }}
                        >
                            {items.map((item) => (
                                <figure
                                    key={item.tag}
                                    className="relative h-[60vh] w-[70vw] shrink-0 overflow-hidden sm:w-[38vw] lg:w-[26vw]"
                                >
                                    <img
                                        src={item.img}
                                        alt={item.label}
                                        className="h-full w-full object-cover grayscale"
                                    />
                                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-5">
                                        <span className="font-mono text-[10px] uppercase tracking-widest text-brass">
                                            {item.tag}
                                        </span>
                                        <div className="mt-1 font-display text-xl uppercase text-paper">
                                            {item.label}
                                        </div>
                                    </figcaption>
                                </figure>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-8">
                    {items.map((item) => (
                        <figure
                            key={item.tag}
                            className="relative h-[50vh] w-[80vw] shrink-0 snap-start overflow-hidden sm:w-[45vw]"
                        >
                            <img
                                src={item.img}
                                alt={item.label}
                                className="h-full w-full object-cover grayscale"
                            />
                            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-5">
                                <span className="font-mono text-[10px] uppercase tracking-widest text-brass">
                                    {item.tag}
                                </span>
                                <div className="mt-1 font-display text-xl uppercase text-paper">
                                    {item.label}
                                </div>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            )}
        </section>
    );
}