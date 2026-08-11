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

    return (
        <motion.div style={{ opacity }} className="absolute inset-0">
            <motion.img
                src={session.img}
                alt={session.tag}
                loading="lazy"
                style={{ scale }}
                className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.35),transparent_40%,rgba(0,0,0,0.5))]" />
            <div className="absolute inset-0 flex flex-col justify-between p-6 text-secondary">
                <div className="flex justify-between">
                    <span className="label-xs">
                        {session.focus}
                        <br />
                        Coached
                    </span>
                    <span className="label-xs text-right">
                        {session.date}
                        <br />
                        This week
                    </span>
                </div>
                <div className="flex items-end justify-between">
                    <span className="label-xs">
                        {session.tag}
                        <br />
                        2026
                    </span>
                    <span className="label-xs text-right">
                        {session.equipment}
                        <br />
                        {session.season}
                    </span>
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
                    className="relative aspect-[3/4] w-[min(78vw,22rem)] overflow-hidden rounded-3xl bg-primary"
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