import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

// Curtain-reveal image used for the Programs section.
// As the element scrolls into view, a clip-path "curtain" opens from the
// center outward while the image itself scales down slightly (parallax),
// mirroring motion.dev's Scroll Image Reveal example:
// https://examples.motion.dev/react/scroll-image-reveal
export default function ScrollRevealImage({
    src,
    alt = "",
    className = "",
    imgClassName = "",
}) {
    const ref = useRef(null);

    // Track this element's own position as it travels through the viewport.
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 90%", "start 35%"],
    });

    // 50 -> 0 : curtain fully closed (both edges meet in the middle) -> fully open
    const inset = useTransform(scrollYProgress, [0, 1], [50, 0]);
    const clipPath = useTransform(inset, (v) => `inset(0% ${v}% 0% ${v}%)`);

    // Subtle parallax: image starts slightly zoomed in, settles to 1x as it reveals
    const scale = useTransform(scrollYProgress, [0, 1], [1.25, 1]);

    return (
        <div ref={ref} className={`relative overflow-hidden ${className}`}>
            <motion.div style={{ clipPath }} className="absolute inset-0">
                <motion.img
                    src={src}
                    alt={alt}
                    style={{ scale }}
                    className={`h-full w-full object-cover ${imgClassName}`}
                />
            </motion.div>
        </div>
    );
}