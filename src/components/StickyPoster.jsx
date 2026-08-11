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

export default function StickyPoster() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const x1 = useTransform(scrollYProgress, [0, 1], ["5%", "-45%"]);
    const x2 = useTransform(scrollYProgress, [0, 1], ["-40%", "5%"]);
    const swap = useTransform(scrollYProgress, [0.42, 0.58], [0, 1]);
    const posterY = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);
    const opacity1 = useTransform(swap, (v) => 1 - v);
    const scale1 = useTransform(swap, [0, 1], [1, 1.06]);
    const scale2 = useTransform(swap, [0, 1], [1.06, 1]);

    const [a, b] = sessions;

    return (
        <section ref={ref} className="relative h-[220vh]">
            <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
                <div className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-2">
                    <GhostRow x={x1} />
                    <GhostRow x={x2} reverse />
                </div>

                <motion.div
                    style={{ y: posterY }}
                    className="relative aspect-[3/4] w-[min(78vw,22rem)] overflow-hidden rounded-3xl bg-primary"
                >
                    <motion.img
                        src={a.img}
                        alt={a.tag}
                        loading="lazy"
                        style={{ opacity: opacity1, scale: scale1 }}
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <motion.img
                        src={b.img}
                        alt={b.tag}
                        loading="lazy"
                        style={{ opacity: swap, scale: scale2 }}
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.35),transparent_40%,rgba(0,0,0,0.5))]" />
                    <div className="absolute inset-0 flex flex-col justify-between p-6 text-secondary">
                        <div className="flex justify-between">
                            <span className="label-xs">
                                {a.focus}
                                <br />
                                Coached
                            </span>
                            <span className="label-xs text-right">
                                60 MIN
                                <br />
                                Sessions
                            </span>
                        </div>
                        <div className="flex items-end justify-between">
                            <span className="label-xs">
                                {a.season}
                                <br />
                                2026
                            </span>
                            <span className="label-xs text-right">
                                • Small group
                                <br />
                                Open gym
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}