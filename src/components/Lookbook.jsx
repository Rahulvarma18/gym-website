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
                    <div className="relative h-[64vh] w-[86vw] max-w-sm overflow-hidden rounded-[2rem] border border-steel-dim/50 shadow-2xl sm:h-[66vh]">
                        <SessionFace session={current} opacity={1} />
                        {next && <SessionFace session={next} opacity={fadeT} />}
                    </div>
                </div>
            </div>
        </section>
    );
}

function SessionFace({ session, opacity }) {
    return (
        <div className="absolute inset-0" style={{ opacity }}>
            <img
                src={session.img}
                alt={session.tag}
                className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/10 to-ink/80" />

            <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5">
                <span className="max-w-[55%] font-mono text-[10px] uppercase tracking-widest text-paper/80">
                    {session.focus}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-paper/60">
                    {session.date}
                </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-display text-2xl uppercase text-paper sm:text-3xl">
                    {session.tag}
                </h3>
                <div className="mt-3 flex items-center justify-between border-t border-paper/20 pt-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-paper/60">
                        {session.season}
                    </span>
                    <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-paper/80">
                        <span className="h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_8px_#ff4310]" />
                        {session.equipment}
                    </span>
                </div>
            </div>
        </div>
    );
}