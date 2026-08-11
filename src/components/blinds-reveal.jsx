import { motion } from "motion/react";

const variants = {
    hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export function Reveal({ children, delay = 0, className }) {
    return (
        <motion.div
            className={className}
            variants={variants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    );
}

/** Horizontal-blinds image reveal. */
export function BlindsImage({ src, alt, className, slices = 9 }) {
    return (
        <motion.div
            className={`relative overflow-hidden rounded-2xl ${className ?? ""}`}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.35 }}
        >
            <motion.img
                src={src}
                alt={alt}
                loading="lazy"
                className="h-full w-full object-cover"
                variants={{ hidden: { scale: 1.12 }, show: { scale: 1 } }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="pointer-events-none absolute inset-0 flex flex-col">
                {Array.from({ length: slices }).map((_, i) => (
                    <motion.span
                        key={i}
                        className="block flex-1 bg-background"
                        variants={{ hidden: { scaleX: 1 }, show: { scaleX: 0 } }}
                        style={{ transformOrigin: i % 2 === 0 ? "left" : "right" }}
                        transition={{
                            duration: 0.75,
                            delay: i * 0.055,
                            ease: [0.76, 0, 0.24, 1],
                        }}
                    />
                ))}
            </div>
        </motion.div>
    );
}