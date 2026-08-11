import { motion } from "motion/react";

const links = ["Classes", "Coaches", "Pricing", "Contact"];

export default function Footer({ onOpenAuth }) {
  function handleSubmit(e) {
    e.preventDefault();
    onOpenAuth?.("signup");
  }

  return (
    <footer id="join" className="mx-auto max-w-[1400px] overflow-hidden px-5 pb-10 md:px-8">
      <div className="rounded-[2.5rem] bg-primary px-6 py-14 text-primary-foreground md:px-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="label-xs text-primary-foreground/60">Membership</span>
            <h2 className="display-xl mt-4 max-w-[14ch] text-[10vw] leading-[0.9] md:text-[3.6rem]">
              Your first week is on us.
            </h2>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-md items-center gap-2 rounded-full bg-primary-foreground/10 p-2"
          >
            <input
              type="email"
              required
              placeholder="Email address"
              aria-label="Email address"
              className="w-full bg-transparent px-4 text-sm outline-none placeholder:text-primary-foreground/50"
            />
            <button className="label-xs shrink-0 rounded-full bg-primary-foreground px-6 py-3 text-primary transition-transform hover:scale-[1.04]">
              Claim pass
            </button>
          </form>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-primary-foreground/15 pt-8">
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              className="label-xs text-primary-foreground/60 hover:text-primary-foreground"
            >
              {l}
            </a>
          ))}
          <span className="label-xs text-primary-foreground/40">© 2026 Ironworks</span>
        </div>

        <div className="mt-10 overflow-hidden">
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="display-xl text-center text-[19vw] leading-[0.8] text-primary-foreground/15"
          >
            IRONWORKS
          </motion.p>
        </div>
      </div>
    </footer>
  );
}