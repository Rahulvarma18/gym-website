import { BlindsImage, Reveal } from "./blinds-reveal";
import { programs } from "../data/content";

export default function Trio() {
    const [tile1, tile2, tile3] = programs;

    return (
        <section className="relative overflow-hidden px-5 py-32 md:px-8 md:py-44">
            <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center">
                <span className="ghost-solid text-[22vw] leading-none">WORKOUT</span>
            </div>
            <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-10 md:grid-cols-3">
                <div className="order-2 self-start md:order-1">
                    <BlindsImage
                        src={tile1.bgImage}
                        alt={tile1.title}
                        className="aspect-[3/4] w-56 md:w-64"
                    />
                    <Reveal delay={0.2}>
                        <p className="mt-6 max-w-[15rem] text-xs leading-relaxed text-muted-foreground">
                            Performance-driven programming for lifters — built for heavy
                            days and deload weeks alike.
                        </p>
                    </Reveal>
                </div>

                <BlindsImage
                    src={tile2.bgImage}
                    alt={tile2.title}
                    slices={11}
                    className="order-1 mx-auto aspect-[3/4] w-full max-w-sm md:order-2"
                />

                <div className="order-3 flex flex-col items-end md:translate-y-20 lg:translate-y-28">
                    <Reveal>
                        <p className="mb-8 max-w-[16rem] text-xs leading-relaxed text-muted-foreground">
                            Train hard, recover harder. Our coaches blend strength,
                            mobility and conditioning so you keep showing up.
                        </p>
                    </Reveal>
                    <BlindsImage
                        src={tile3.bgImage}
                        alt={tile3.title}
                        className="aspect-[3/4] w-52 md:w-60"
                    />
                </div>
            </div>
        </section>
    );
}