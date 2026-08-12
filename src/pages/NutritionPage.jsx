import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Layout from "../components/Layout";
import { nutritionPlans, nutritionPillars } from "../data/content";

export default function NutritionPage() {
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
                                src="https://images.unsplash.com/photo-1543352632-5a4b24e4d2a6?w=1600&q=80"
                                alt="Fuel the work"
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
                                        01 / NUTRITION
                                        <br />
                                        2026
                                    </span>
                                </div>
                                <h1 className="display-xl max-w-[14ch] text-[10vw] leading-[0.9] text-secondary md:text-[4.5rem]">
                                    Fuel the work.
                                </h1>
                            </div>
                        </motion.div>
                    </section>

                    {/* Intro */}
                    <section className="mx-auto max-w-[1400px] px-5 py-16 md:px-8">
                        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                            <div>
                                <span className="label-xs text-muted-foreground">Diet plans</span>
                                <h2 className="display-xl mt-4 max-w-[20ch] text-[8vw] leading-[0.95] md:text-[3rem]">
                                    Food that matches the work you put in on the floor.
                                </h2>
                            </div>
                            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                                Every membership from Monthly upward includes a personalised diet
                                plan from our coaches — built around your goals, your training
                                split, and what you'll actually eat.
                            </p>
                        </div>
                    </section>

                    {/* Pillars */}
                    <section className="mx-auto max-w-[1400px] px-5 pb-16 md:px-8">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            {nutritionPillars.map((p, i) => (
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

                    {/* Plans grid */}
                    <section className="mx-auto max-w-[1400px] px-5 pb-24 md:px-8">
                        <div className="mb-10 flex items-end justify-between gap-6">
                            <h2 className="display-xl max-w-[16ch] text-[7vw] leading-[0.95] md:text-[2.6rem]">
                                Pick a starting point
                            </h2>
                            <span className="label-xs hidden text-muted-foreground md:block">
                                Adjusted at your first check-in
                            </span>
                        </div>
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                            {nutritionPlans.map((plan, i) => (
                                <motion.article
                                    key={plan.name}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                                    className="overflow-hidden rounded-3xl bg-secondary"
                                >
                                    <div className="relative aspect-[4/3]">
                                        <img
                                            src={plan.img}
                                            alt={plan.name}
                                            loading="lazy"
                                            className="absolute inset-0 h-full w-full object-cover"
                                        />
                                        <span className="label-xs absolute left-4 top-4 rounded-full bg-secondary/90 px-3 py-1.5 backdrop-blur">
                                            {plan.goal}
                                        </span>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-baseline justify-between">
                                            <h3 className="font-display text-2xl uppercase">{plan.name}</h3>
                                        </div>
                                        <p className="label-xs mt-2 text-muted-foreground">
                                            {plan.calories} · {plan.macros}
                                        </p>
                                        <ul className="mt-4 space-y-2">
                                            {plan.meals.map((m) => (
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
                                    Get your plan at your first check-in.
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