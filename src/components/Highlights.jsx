import { programs } from "../data/content";
import Reveal from "./Reveal";

const featured = [
    { ...programs[0], index: "01", period: "STRENGTH BLOCK", badge: "Most Booked" },
    { ...programs[2], index: "02", period: "CIRCUIT BLOCK", badge: "New This Month" },
];

export default function Highlights() {
    return (
        <section className="border-b border-steel-dim/40 bg-ink py-24">
            <div className="mx-auto max-w-6xl px-6">
                <Reveal
                    as="div"
                    className="flex flex-col justify-between gap-6 pb-10 md:flex-row md:items-end"
                >
                    <div>
                        <span className="font-mono text-xs uppercase tracking-[0.3em] text-ember">
                            Our Top Picks
                        </span>
                        <h2 className="mt-3 max-w-xl font-display text-4xl uppercase leading-[0.95] text-paper sm:text-5xl">
                            Top training blocks for peak performance!
                        </h2>
                    </div>
                    <p className="max-w-xs text-sm text-steel md:text-right">
                        Discover the blocks our coaches recommend most, built to power
                        your training all year round.
                    </p>
                </Reveal>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {featured.map((p, i) => (
                        <Reveal key={p.title} variant="scale" delay={i * 120}>
                            <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-steel-dim/40 shadow-2xl sm:aspect-[3/4]">
                                <img
                                    src={p.bgImage}
                                    alt={p.title}
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />

                                <span className="absolute right-5 top-4 text-right font-mono text-xs tracking-widest text-paper/60">
                                    {p.index}/{p.period}
                                </span>

                                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                                    <span className="mb-4 inline-block rounded-full border border-steel-dim/40 bg-concrete/90 px-3.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-brass backdrop-blur-md">
                                        {p.badge}
                                    </span>
                                    <h3 className="font-display text-3xl uppercase leading-[0.95] text-paper sm:text-4xl">
                                        {p.title}
                                    </h3>
                                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-paper/80">
                                        {p.description}
                                    </p>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}