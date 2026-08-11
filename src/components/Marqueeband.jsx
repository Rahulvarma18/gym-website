const items = [

    "COACHED SESSIONS",
    "RECOVERY SUITE",
    "NO CONTRACT",
    "STRENGTH LAB",
];

export default function MarqueeBand() {
    return (
        <div className="border-y border-border py-5">
            <div className="overflow-hidden">
                <div className="marquee-track">
                    {Array.from({ length: 2 }).map((_, dup) => (
                        <div key={dup} className="flex shrink-0">
                            {items.map((t) => (
                                <span key={t} className="label-xs flex items-center px-8 text-foreground/70">
                                    {t}
                                    <span className="ml-8 inline-block size-1 rounded-full bg-foreground/40" />
                                </span>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}