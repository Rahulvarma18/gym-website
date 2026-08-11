import { motion } from "motion/react";

const cards = [
    {
        src: "https://images.unsplash.com/photo-1543352632-5a4b24e4d2a6?w=1400&q=80",
        index: "01 / NUTRITION",
        year: "2026",
        title: "Fuel the work.",
        tag: "Diet plans",
    },
    {
        src: "https://images.unsplash.com/photo-1701826510656-8dbcec14a4b5?w=1400&q=80",
        index: "02 / RECOVERY",
        year: "2026",
        title: "Move to heal.",
        tag: "Mobility block",
    },
];

export default function WideCards() {
    return (
        <section className="mx-auto grid max-w-[1400px] grid-cols-1 gap-5 px-5 pb-24 md:grid-cols-2 md:px-8">
            {cards.map((c, i) => (
                <motion.article
                    key={c.index}
                    initial={{ opacity: 0, y: 80, scale: 0.97 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 1, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    className="group relative aspect-[16/11] overflow-hidden rounded-3xl"
                >
                    <img
                        src={c.src}
                        alt={c.title}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.45),rgba(0,0,0,0.1)_45%,rgba(0,0,0,0.75))]" />
                    <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
                        <div className="flex items-start justify-between">
                            <span className="label-xs rounded-full bg-secondary/85 px-4 py-2 backdrop-blur">
                                {c.tag}
                            </span>
                            <span className="label-xs text-right text-secondary/80">
                                {c.index}
                                <br />
                                {c.year}
                            </span>
                        </div>
                        <h3 className="display-xl max-w-[10ch] text-[2.4rem] text-secondary md:text-[3.2rem]">
                            {c.title}
                        </h3>
                    </div>
                </motion.article>
            ))}
        </section>
    );
}