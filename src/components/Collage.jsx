import { programs } from "../data/content";
import Reveal from "./Reveal";

export default function Collage() {
    const [left, center, right] = programs;

    return (
        <section className="relative overflow-hidden border-b border-steel-dim/40 bg-ink py-28">
            {/* Giant faded watermark word */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-center font-display uppercase leading-none text-steel-dim/10"
                style={{ fontSize: "clamp(6rem, 18vw, 15rem)" }}
            >
                Strength
            </div>

            <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-6 px-6 md:grid-cols-[0.85fr_1.15fr_0.85fr]">
                {/* Left small photo + caption below */}
                <Reveal variant="scale" className="flex flex-col gap-4 md:-translate-y-10">
                    <div className="aspect-[4/5] w-full max-w-[220px] overflow-hidden rounded-3xl border border-steel-dim/40 shadow-xl">
                        <img
                            src={left.bgImage}
                            alt={left.title}
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <p className="max-w-[220px] text-sm leading-relaxed text-steel">
                        Structured strength programming for men and women — built for
                        every level, every rep.
                    </p>
                </Reveal>

                {/* Center large photo */}
                <Reveal variant="scale" delay={100}>
                    <div className="aspect-[4/5] w-full overflow-hidden rounded-3xl border border-steel-dim/40 shadow-2xl">
                        <img
                            src={center.bgImage}
                            alt={center.title}
                            className="h-full w-full object-cover"
                        />
                    </div>
                </Reveal>

                {/* Right small photo + caption above */}
                <Reveal
                    variant="scale"
                    delay={200}
                    className="flex flex-col-reverse gap-4 md:translate-y-10"
                >
                    <div className="ml-auto aspect-[4/5] w-full max-w-[220px] overflow-hidden rounded-3xl border border-steel-dim/40 shadow-xl">
                        <img
                            src={right.bgImage}
                            alt={right.title}
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <p className="ml-auto max-w-[220px] text-right text-sm leading-relaxed text-steel">
                        Stay consistent without burning out — our coaches build the
                        split so you don't have to guess.
                    </p>
                </Reveal>
            </div>
        </section>
    );
}