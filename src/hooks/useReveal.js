import { useEffect, useRef, useState } from "react";

// Fires once when the element enters the viewport, then disconnects —
// drives the slide-up / fade-in reveal used across the page.
export default function useReveal(options) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        if (typeof IntersectionObserver === "undefined") {
            setVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.2, rootMargin: "0px 0px -10% 0px", ...options }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [options]);

    return [ref, visible];
}