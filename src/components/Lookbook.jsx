import { sessions } from "../data/content";
import useScrollScale from "../hooks/useScrollScale";
import Reveal from "./Reveal";

export default function Lookbook() {
    const [wrapperRef, progress] = useScrollScale();

    const segCount = sessions.length;
    const scaled = progress * segCount;
    const index = Math.min(segCount - 1, Math.floor(scaled));
    const localT = scaled - index;

    const current = sessions[index];
    const hasNext = index < segCount - 1;
    const next = hasNext ? sessions[index + 1] : null;

    // Cross-fade to the next card in the back 35% of each segment.
    const fadeStart = 0.65;
    const fadeT = localT < fadeStart ? 0 : (localT - fadeStart) / (1 - fadeStart);

    // Giant backdrop text slides sideways as you scroll through the pin.
    const textShift = (progress - 0.5) * 60;

    return (
        <section className="relative overflow-hidden border-b border-steel-dim/40 bg-ink">
            <div className="mx-auto max-w-6xl px-6 pt-24 text-center">
                <Reveal as="div">
                    <span className="font-mono text-xs uppercase tracking-[0.3em] text-ember">
                        Your Weekly Split
                    </span>
                    <h2 className="mt-3 font-display text-4xl uppercase text-paper sm:text-5xl">
                        Structured for every session
                    </h2>
                </Reveal>
            </div>

            <div ref={wrapperRef} className="relative" style={{ height: `${segCount * 100}vh` }}>
                <div className="sticky top-0 flex h-screen w-full items-center justify-center">
                    {/* Giant sliding watermark text */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-center font-display uppercase leading-none text-steel-dim/10"
                        style={{
                            fontSize: "clamp(4rem, 13vw, 9rem)",
                            transform: `translateX(${textShift}%)`,
                        }}
                    >
                        Every Rep Every Set Every Session
                    </div>

                    {/* Pinned card */}
                    <div className="relative h-[70vh] w-[92vw] max-w-2xl overflow-hidden rounded-[2rem] border-4 border-foreground/30 shadow-2xl sm:h-[72vh]">
                        <SessionFace session={current} opacity={1} />
                        {next && <SessionFace session={next} opacity={fadeT} />}
                    </div>
                </div>
            </div>
        </section>
    );
}

function SessionFace({ session, opacity }) {
    const isGaining = session.tag === "Leg Day" || session.tag === "Push Day";

    return (
        <div className="absolute inset-0 flex items-center justify-center" style={{ opacity }}>
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink/80 to-ink/95" />

            {/* Content */}
            <div className="relative z-10 flex w-full flex-col items-center justify-center gap-12 p-8 text-center">
                <div>
                    <h3 className="font-display text-5xl uppercase tracking-tight text-paper sm:text-6xl md:text-7xl">
                        {isGaining ? "Muscle" : "Fat"}
                    </h3>
                    <p className="mt-2 font-mono text-xs uppercase tracking-[0.3em] text-paper/60">
                        {isGaining ? "Gaining" : "Losing"}
                    </p>
                </div>

                <div className="flex flex-col gap-6 sm:gap-8">
                    <div className="max-w-xs">
                        <p className="font-mono text-xs uppercase tracking-widest text-paper/70">
                            {session.date}
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-paper/80">
                            {session.focus}
                        </p>
                    </div>

                    <div className="border-t border-paper/20 pt-6">
                        <span className="inline-block rounded-full border border-ember px-4 py-2 font-mono text-xs uppercase tracking-widest text-ember">
                            {session.equipment}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}