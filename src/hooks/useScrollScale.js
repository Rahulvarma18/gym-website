import { useEffect, useRef, useState } from "react";

// Tracks 0→1 scroll progress of a tall "pin" wrapper as it travels through
// the viewport. While the wrapper spans the viewport, an inner element can
// stay visually pinned (via CSS `sticky`) and use this progress to scale
// up smoothly, in lockstep with the scrollbar — the classic "grows as you
// scroll" reveal, driven by rAF-throttled scroll/resize listeners rather
// than a fixed-duration transition, so it never falls out of sync.
export default function useScrollScale() {
    const ref = useRef(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const reduceMotion =
            typeof window !== "undefined" &&
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

        if (reduceMotion) {
            setProgress(1);
            return;
        }

        let ticking = false;

        const calc = () => {
            const rect = el.getBoundingClientRect();
            const vh = window.innerHeight || document.documentElement.clientHeight;
            const total = rect.height - vh;
            let p = total > 0 ? -rect.top / total : rect.top < vh ? 1 : 0;
            if (p < 0) p = 0;
            if (p > 1) p = 1;
            setProgress(p);
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(calc);
                ticking = true;
            }
        };

        calc();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, []);

    return [ref, progress];
}