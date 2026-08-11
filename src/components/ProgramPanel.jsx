import useScrollScale from "../hooks/useScrollScale";

// One "pinned" program panel. The outer wrapper is tall (180vh) so the
// inner `sticky` frame holds its position on screen for a stretch of
// scroll — during that stretch the image scales from a small centered
// box up to full width, exactly tracking scroll position (progress 0→1),
// then releases and the next panel takes over.
export default function ProgramPanel({ program, index }) {
    const [wrapperRef, progress] = useScrollScale();

    // Ease the raw linear scroll progress slightly so the growth feels a
    // touch quicker at the start and settles near the end.
    const eased = 1 - Math.pow(1 - progress, 2);

    const scale = 0.58 + eased * 0.42; // 0.58 -> 1
    const opacity = Math.min(1, 0.25 + progress / 0.35);
    const radius = 40 - eased * 40; // 40px -> 0 (flush, full-bleed at full size)
    const overlayStrength = 0.55 + eased * 0.35;

    return (
        <div ref={wrapperRef} className="relative" style={{ height: "170vh" }}>
            <div className="sticky top-[9vh] flex h-[82vh] w-full items-center justify-center">
                <div
                    className="group relative h-full w-full overflow-hidden shadow-2xl will-change-transform"
                    style={{
                        transform: `scale(${scale})`,
                        opacity,
                        borderRadius: `${radius}px`,
                    }}
                >
                    {/* Image */}
                    <div
                        className="h-full w-full bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${program.bgImage})` }}
                    />

                    {/* Gradient overlay, deepens as the panel reaches full size */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background: `linear-gradient(to top, rgba(16,14,11,${overlayStrength + 0.35}) 0%, rgba(16,14,11,${overlayStrength}) 38%, rgba(16,14,11,0.15) 75%)`,
                        }}
                    />

                    {/* Giant index number, top-right */}
                    <span className="absolute right-6 top-4 font-display text-[5rem] leading-none text-paper/10 sm:text-[7rem]">
                        {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* Content */}
                    <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
                        <div className="flex items-center justify-between">
                            <span className="inline-block rounded-full border border-steel-dim/40 bg-concrete/90 px-3.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-brass backdrop-blur-md">
                                {program.tag}
                            </span>
                            <span className="rounded-full border border-steel-dim/40 bg-ink/80 px-3 py-1 font-mono text-xs tracking-wider text-steel">
                                {program.plate} lb
                            </span>
                        </div>

                        <h3 className="mt-4 font-display text-3xl uppercase tracking-wide text-paper drop-shadow sm:text-4xl">
                            {program.title}
                        </h3>

                        <p className="mt-3 max-w-xl text-sm leading-relaxed text-paper/85 sm:text-base">
                            {program.description}
                        </p>

                        <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-steel-dim/40 pt-4">
                            {program.details.map((d) => (
                                <li
                                    key={d}
                                    className="flex items-center gap-2.5 font-mono text-xs text-paper/90"
                                >
                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ember shadow-[0_0_8px_#ff4310]" />
                                    {d}
                                </li>
                            ))}
                        </ul>

                        <a
                            href="#pricing"
                            className="mt-6 inline-flex items-center gap-3 rounded-xl border border-steel-dim/40 bg-concrete/90 px-5 py-3 font-mono text-xs uppercase tracking-widest text-paper backdrop-blur-md transition-all duration-300 hover:border-ember hover:bg-ember hover:text-ink"
                        >
                            <span>Select Plan</span>
                            <span className="font-bold transition-transform group-hover:translate-x-1">
                                →
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}