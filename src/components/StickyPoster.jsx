import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { sessions } from "../data/content";

const GHOST = "STRONGER FOR YOUR NEXT SESSION \u00A0—\u00A0 ";

function GhostRow({ x, reverse }) {
    return (
        <div className="overflow-hidden">
            <motion.div
                style={{ x }}
                className={`flex whitespace-nowrap ${reverse ? "flex-row-reverse" : ""}`}
            >
                {Array.from({ length: 3 }).map((_, i) => (
                    <span key={i} className="ghost-outline text-[13vw] leading-[1.05]">
                        {GHOST}
                    </span>
                ))}
            </motion.div>
        </div>
    );
}

// One session frame in the crossfade stack. Each frame owns its own
// scroll-driven opacity/scale so we can cycle through any number of
// sessions instead of hard-coding a two-image swap.
function PosterFrame({ session, scrollYProgress, index, total }) {
    const step = 1 / total;
    const left = (index - 0.5) * step;
    const center = (index + 0.5) * step;
    const right = (index + 1.5) * step;

    const opacity = useTransform(scrollYProgress, [left, center, right], [0, 1, 0]);
    const scale = useTransform(scrollYProgress, [left, center, right], [1.06, 1, 1.06]);

    const isGaining = session.tag === "Leg Day" || session.tag === "Push Day";

    return (
        <motion.div style={{ opacity }} className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden">
            {/* Background image with scale */}
            <motion.div
                style={{ scale }}
                className="absolute inset-0"
            >
                <img
                    src={isGaining ? "/musclegain.png" : "/fatloss.png"}
                    alt={session.tag}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                />
            </motion.div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/60 to-primary/80" />

            {/* Content - no scale to prevent blur */}
            <div
                className="relative z-10 flex flex-col items-center justify-center gap-8 px-6 text-center"
            >
                <div>
                    <h2 className="font-display text-5xl font-bold uppercase tracking-tight text-secondary sm:text-6xl">
                        {isGaining ? "Muscle" : "Fat"}
                    </h2>
                    <p className="mt-3 font-mono text-xs uppercase tracking-[0.4em] text-secondary/70">
                        {isGaining ? "Gaining" : "Losing"}
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-widest text-secondary/60">
                            {session.date}
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-secondary/80">
                            {session.focus}
                        </p>
                    </div>

                    <div className="border-t border-secondary/20 pt-4">
                        <span className="inline-block rounded-full border border-ember px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ember">
                            {session.equipment}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// Small progress dot that widens and brightens as its session becomes
// the active frame, so the poster reads as a cycling schedule (1/4 ... 4/4)
// rather than a static image.
function ProgressDot({ scrollYProgress, index, total }) {
    const step = 1 / total;
    const center = (index + 0.5) * step;

    const opacity = useTransform(
        scrollYProgress,
        [center - step, center, center + step],
        [0.35, 1, 0.35]
    );
    const scaleX = useTransform(
        scrollYProgress,
        [center - step, center, center + step],
        [1, 2.6, 1]
    );

    return (
        <motion.span
            style={{ opacity, scaleX }}
            className="h-1 w-1 origin-center rounded-full bg-secondary"
        />
    );
}

export default function StickyPoster() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const x1 = useTransform(scrollYProgress, [0, 1], ["5%", "-45%"]);
    const x2 = useTransform(scrollYProgress, [0, 1], ["-40%", "5%"]);
    const posterY = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);

    return (
        <section ref={ref} className="relative h-[320vh]">
            <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
                <div className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-2">
                    <GhostRow x={x1} />
                    <GhostRow x={x2} reverse />
                </div>

                <motion.div
                    style={{ y: posterY }}
                    className="relative aspect-[3/4] w-[min(88vw,28rem)] overflow-hidden rounded-3xl border-4 border-foreground/40 bg-primary"
                >
                    {sessions.map((session, i) => (
                        <PosterFrame
                            key={session.tag}
                            session={session}
                            scrollYProgress={scrollYProgress}
                            index={i}
                            total={sessions.length}
                        />
                    ))}
                </motion.div>

                <div className="mt-6 flex items-center gap-2">
                    {sessions.map((session, i) => (
                        <ProgressDot
                            key={session.tag}
                            scrollYProgress={scrollYProgress}
                            index={i}
                            total={sessions.length}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}