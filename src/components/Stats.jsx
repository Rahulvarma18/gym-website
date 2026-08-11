import { stats } from "../data/content";
import PlateIcon from "./PlateIcon";
import Reveal from "./Reveal";

export default function Stats() {
  return (
    <section className="border-b border-border bg-background py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            The floor, by the numbers
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* The bar: a horizontal sleeve with a plate loaded per stat, sized to
            the number's weight in the story rather than a decorative icon. */}
        <div className="flex flex-col items-center gap-10 sm:flex-row sm:justify-between">
          {stats.map((stat, i) => (
            <Reveal
              key={stat.label}
              variant="scale"
              delay={i * 100}
              className="flex flex-col items-center text-center"
            >
              <PlateIcon
                size={64 + stat.plate}
                color={i % 2 === 0 ? "var(--color-ember)" : "var(--color-brass)"}
              />
              <div className="mt-5 font-display text-3xl uppercase text-foreground sm:text-4xl">
                {stat.value}
                <span className="ml-1 text-lg text-muted-foreground">{stat.unit}</span>
              </div>
              <div className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}