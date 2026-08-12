import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Layout from "../components/Layout";
import { mobilityRoutines, recoveryPillars } from "../data/content";

export default function RecoveryPage() {
    return (
        <Layout>
            {({ onOpenAuth }) => (
                <>
                    {/* Hero banner */}
                    <section className="mx-auto max-w-[1400px] px-5 pt-6 md:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                            className="relative aspect-[16/9] overflow-hidden rounded-3xl md:aspect-[21/9]"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1701826510656-8dbcec14a4b5?w=1600&q=80"
                                alt="Move to heal"
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.5),rgba(0,0,0,0.15)_45%,rgba(0,0,0,0.75))]" />
                            <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-10">
                                <div className="flex items-start justify-between">
                                    <Link
                                        to="/"
                                        className="label-xs flex items-center gap-2 rounded-full bg-secondary/85 px-4 py-2 backdrop-blur transition-transform hover:scale-[1.04]"
                                    >
                                        <ArrowLeft className="size-3.5" />
                                        Back home
                                    </Link>
                                    <span className="label-xs text-right text-secondary/80">
                                        02 / RECOVERY
                                        <br />
                                        2026
                                    </span>
                                </div>
                                <h1 className="display-xl max-w-[14ch] text-[10vw] leading-[0.9] text-secondary md:text-[4.5rem]">
                                    Move to heal.
                                </h1>
                            </div>
                        </motion.div>
                    </section>

                    {/* Intro */}
                    <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-8">
                        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                            <div>
                                <span className="label-xs text-muted-foreground">Mobility block</span>
                                <h2 className="display-xl mt-4 max-w-[20ch] text-[8vw] leading-[0.95] md:text-[3rem]">
                                    Recovery that's programmed in, not bolted on.
                                </h2>
                            </div>
                            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                                Short, coach-led mobility blocks built around whatever you
                                trained that day — so you walk out looser than you walked in,
                                not just tired.
                            </p>
                        </div>
                    </section>

                    {/* Pillars */}
                    <section className="mx-auto max-w-[1400px] px-5 pb-16 md:px-8">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            {recoveryPillars.map((p, i) => (
                                <motion.div
                                    key={p.title}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                                    className="rounded-3xl bg-muted p-6"
                                >
                                    <span className="label-xs text-muted-foreground">0{i + 1}</span>
                                    <h3 className="mt-3 font-display text-xl uppercase">{p.title}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                        {p.description}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* Routines grid */}
                    <section className="mx-auto max-w-[1400px] px-5 pb-24 md:px-8">
                        <div className="mb-10 flex items-end justify-between gap-6">
                            <h2 className="display-xl max-w-[16ch] text-[7vw] leading-[0.95] md:text-[2.6rem]">
                                Pick a routine
                            </h2>
                            <span className="label-xs hidden text-muted-foreground md:block">
                                Run before, after, or between sessions
                            </span>
                        </div>
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                            {mobilityRoutines.map((routine, i) => (
                                <motion.article
                                    key={routine.name}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                                    className="overflow-hidden rounded-3xl bg-secondary"
                                >
                                    <div className="relative aspect-[4/3]">
                                        <img
                                            src={routine.img}
                                            alt={routine.name}
                                            loading="lazy"
                                            className="absolute inset-0 h-full w-full object-cover"
                                        />
                                        <span className="label-xs absolute left-4 top-4 rounded-full bg-secondary/90 px-3 py-1.5 backdrop-blur">
                                            {routine.duration}
                                        </span>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-baseline justify-between">
                                            <h3 className="font-display text-2xl uppercase">{routine.name}</h3>
                                        </div>
                                        <p className="label-xs mt-2 text-muted-foreground">{routine.focus}</p>
                                        <ul className="mt-4 space-y-2">
                                            {routine.moves.map((m) => (
                                                <li key={m} className="flex items-start gap-2 text-sm text-foreground/80">
                                                    <span className="mt-2 size-1 shrink-0 rounded-full bg-ember" />
                                                    {m}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    </section>

                    {/* CTA */}
                    <section className="mx-auto max-w-[1400px] px-5 pb-24 md:px-8">
                        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-primary p-8 text-primary-foreground md:flex-row md:items-center md:p-12">
                            <div>
                                <span className="label-xs text-primary-foreground/60">Ready to start?</span>
                                <h3 className="display-xl mt-3 max-w-[16ch] text-[7vw] leading-[0.95] md:text-[2.4rem]">
                                    Book your first mobility block.
                                </h3>
                            </div>
                            <button
                                onClick={() => onOpenAuth?.("signup")}
                                className="label-xs flex shrink-0 items-center gap-2 rounded-full bg-primary-foreground px-6 py-4 text-primary transition-transform hover:scale-[1.04]"
                            >
                                Join Jayram Fitness
                                <ArrowRight className="size-4" />
                            </button>
                        </div>
                    </section>
                </>
            )}
        </Layout>
    );
}