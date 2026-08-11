import { programs } from "../data/content";
import Reveal from "./Reveal";
import ProgramPanel from "./ProgramPanel";

export default function Programs() {
  return (
    <section id="programs" className="border-b border-steel-dim/40 bg-ink py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal
          as="div"
          className="flex flex-col justify-between gap-6 border-b border-steel-dim/40 pb-8 md:flex-row md:items-end"
        >
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-ember">
              Programs
            </span>
            <h2 className="mt-3 font-display text-4xl uppercase text-paper sm:text-5xl">
              Training programs
            </h2>
            <p className="mt-2 text-steel">Built for real results, not just running the mill.</p>
          </div>
        </Reveal>
      </div>

      {/* Full-bleed scroll-scrubbed stack — each panel scales up in sync
          with scroll while pinned, then releases into the next. */}
      <div className="mt-4">
        {programs.map((program, i) => (
          <ProgramPanel key={program.title} program={program} index={i} />
        ))}
      </div>
    </section>
  );
}