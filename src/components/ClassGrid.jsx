import { motion } from "motion/react";
import { ArrowRight, Heart } from "lucide-react";
import { sessions } from "../data/content";

export default function ClassGrid() {
    return (
        <section id="classes" className="mx-auto max-w-[1400px] px-5 py-24 md:px-8">
            <div className="mb-12 flex items-start justify-between gap-6">
                <span className="label-xs text-muted-foreground">New block</span>
                <h2 className="display-xl max-w-[18ch] text-center text-[9vw] leading-[0.9] md:text-[4rem]">
                    Fresh sessions for <span className="text-foreground/35">every</span> body
                </h2>
                <a href="#coaches" className="label-xs text-muted-foreground">
                    All coaches
                </a>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {sessions.map((c, i) => (
                    <motion.article
                        key={c.tag}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.75, delay: (i % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                        className="group relative aspect-[3/4] overflow-hidden rounded-3xl bg-muted"
                    >
                        <img
                            src={c.img}
                            alt={c.tag}
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-[1.07]"
                        />
                        <div className="absolute inset-x-3 top-3 flex items-center justify-between">
                            <span className="label-xs rounded-full bg-secondary/85 px-3 py-1.5 backdrop-blur">
                                {c.season}
                            </span>
                            <button
                                aria-label={`Save ${c.tag}`}
                                className="flex size-7 items-center justify-center rounded-full bg-secondary/85 backdrop-blur transition-transform hover:scale-110"
                            >
                                <Heart className="size-3.5" />
                            </button>
                        </div>
                        <div className="absolute inset-x-3 bottom-3 transition-transform duration-500 group-hover:-translate-y-1">
                            <div className="flex items-center justify-between gap-3 rounded-2xl bg-secondary/90 px-4 py-3 backdrop-blur">
                                <span className="text-xs">
                                    <span className="block font-medium">{c.tag}</span>
                                    <span className="label-xs text-muted-foreground">
                                        {c.date} · {c.focus}
                                    </span>
                                </span>
                                <ArrowRight className="size-4 shrink-0" />
                            </div>
                        </div>
                    </motion.article>
                ))}
            </div>
        </section>
    );
}