import useReveal from "../hooks/useReveal";

// Wraps any block of content and slides/fades it in the first time it
// crosses into view. `variant="up"` for headings and copy, `variant="scale"`
// for cards/tiles. `delay` (ms) staggers siblings in a grid.
export default function Reveal({
    as: Tag = "div",
    variant = "up",
    delay = 0,
    className = "",
    children,
    ...rest
}) {
    const [ref, visible] = useReveal();

    return (
        <Tag
            ref={ref}
            className={`${variant === "scale" ? "reveal-scale" : "reveal-up"} ${visible ? "is-visible" : ""
                } ${className}`}
            style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
            {...rest}
        >
            {children}
        </Tag>
    );
}