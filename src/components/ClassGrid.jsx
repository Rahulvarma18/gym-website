import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { sessions } from "../data/content";

export default function ClassGrid() {
    return (
        <section id="classes" className="mx-auto max-w-[1400px] px-5 py-24 md:px-8">
            <div className="mb-12 flex justify-center">
                <h2 className="display-xl max-w-[18ch] text-center text-[9vw] leading-[0.9] md:text-[4rem]">
                    Fresh sessions for <span className="text-foreground/35">every</span> body
                </h2>
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
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.05)_42%,rgba(0,0,0,0.88))]" />

                        <span className="label-xs absolute left-3 top-3 rounded-full bg-secondary/85 px-3 py-1.5 backdrop-blur">
                            {c.season}
                        </span>

                        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-2 text-secondary">
                            <div>
                                <h3 className="font-display text-xl uppercase leading-none">
                                    {c.tag}
                                </h3>
                                <p className="label-xs mt-2 text-secondary/70">
                                    {c.date} · {c.focus}
                                </p>
                            </div>
                            {/* <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-secondary backdrop-blur transition-all duration-500 group-hover:rotate-45 group-hover:bg-secondary group-hover:text-primary">
                                <ArrowUpRight className="size-4" />
                            </span> */}
                        </div>
                    </motion.article>
                ))}
            </div>
        </section>
    );
}