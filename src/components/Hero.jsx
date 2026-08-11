import { motion } from "motion/react";
import { coaches } from "../data/content";

const heroCutout = "/hero-image.png";

const line1 = ["EARN", "YOUR", "STRENGTH"];
const line2 = ["EVERY", "SINGLE", "REP!"];

function Word({ word, i, ghost }) {
  return (
    <span className="mr-[0.22em] inline-block overflow-hidden align-bottom">
      <motion.span
        className={`inline-block ${ghost ? "text-foreground/35" : ""}`}
        initial={{ y: "110%" }}
        animate={{ y: 0 }}
        transition={{ duration: 1, delay: 0.8 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
      >
        {word}
      </motion.span>
    </span>
  );
}

export default function Hero() {
  return (
    <>
      {/* Full-screen Hero Section */}
      <section id="home" className="relative w-full h-screen overflow-hidden bg-[#cdcdcd]">
        {/* Hero Image - blinds reveal (like the Trio tiles) covering the whole section, then shrinks down to sit below the text */}
        <motion.div
          initial={{ top: "0vh", height: "100vh" }}
          animate={{ top: "34vh", height: "66vh" }}
          transition={{ duration: 1.1, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-0 z-0 flex items-end justify-center overflow-hidden"
        >
          <motion.img
            src={heroCutout}
            alt="Athlete in training"
            initial={{ scale: 1.12 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="h-full w-auto object-cover object-top"
          />
          <div className="pointer-events-none absolute inset-0 flex flex-col">
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.span
                key={i}
                className="block flex-1 bg-[#cdcdcd]"
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                style={{ transformOrigin: i % 2 === 0 ? "left" : "right" }}
                transition={{ duration: 0.75, delay: i * 0.055, ease: [0.76, 0, 0.24, 1] }}
              />
            ))}
          </div>
        </motion.div>

        {/* Text Content - pinned to the top the whole time; the image settles in beneath it */}
        <div className="absolute inset-x-0 top-0 z-10 flex flex-col items-center w-full pt-[9vh] md:pt-[7vh] px-5 md:px-8">
          {/* Headline */}
          <div className="display-xl text-center text-[13vw] leading-[0.88] md:text-[5rem] mb-8">
            <span className="block">
              {line1.map((w, i) => (
                <Word key={w} word={w} i={i} />
              ))}
            </span>
            <span className="block">
              {line2.map((w, i) => (
                <Word key={w} word={w} i={i + 3} ghost={i === 1} />
              ))}
            </span>
          </div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.4 }}
            className="flex items-center justify-center gap-3"
          >
            <a
              href="#pricing"
              className="label-xs rounded-full bg-primary px-7 py-3.5 text-primary-foreground transition-transform hover:scale-[1.04]"
            >
              Start Training
            </a>
            <a
              href="#classes"
              className="label-xs rounded-full bg-secondary px-7 py-3.5 transition-transform hover:scale-[1.04]"
            >
              Explore Classes
            </a>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.6, repeat: Infinity, repeatType: "reverse" }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-foreground/60">Scroll to explore</span>
            <svg className="w-5 h-5 text-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </motion.div>
        {/* Coaches Callout - lives inside the hero now instead of a separate section */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 2.6 }}
          className="absolute bottom-8 left-5 z-20 hidden max-w-[13rem] flex-col items-start md:left-8 lg:flex"
        >
          <div className="flex -space-x-3 mb-5">
            {coaches.map((c) => (
              <img
                key={c.name}
                src={c.img}
                alt=""
                loading="lazy"
                className="size-9 rounded-full border-2 border-background object-cover"
              />
            ))}
          </div>
          <p className="text-xs leading-relaxed text-foreground/70">
            Coaching built around your body. Strength, conditioning and recovery in one membership — open 24/7.
          </p>
        </motion.div>
      </section>
    </>
  );
}