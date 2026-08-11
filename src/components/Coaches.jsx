import { coaches } from "../data/content";
import Reveal from "./Reveal";

export default function Coaches() {
  return (
    <section id="coaches" className="border-b border-border bg-secondary py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-ember">
            Coaches
          </span>
          <h2 className="mt-3 max-w-xl font-display text-4xl uppercase leading-[0.95] text-foreground sm:text-5xl">
            Coached by people who compete
          </h2>
          <p className="mt-3 max-w-md text-muted-foreground">
            Our coaches are certified, but more importantly they still lift,
            still race, and still study.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {coaches.map((coach, i) => (
            <Reveal key={coach.name} variant="scale" delay={i * 80} className="group">
              <div className="relative overflow-hidden">
                <img
                  src={coach.img}
                  alt={coach.name}
                  className="h-72 w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                />
                <div className="absolute inset-x-0 bottom-0 h-1 bg-ember scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
              </div>
              <h3 className="mt-4 font-display text-xl uppercase text-foreground">
                {coach.name}
              </h3>
              <p className="font-mono text-[11px] uppercase tracking-widest text-brass">
                {coach.role}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{coach.bio}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}