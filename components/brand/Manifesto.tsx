import { LotusGlyph } from "./LotusGlyph";
import { Reveal } from "@/components/ui/Reveal";

/** The design statement, set on midnight indigo — the blue lotus at night. */
export function Manifesto() {
  return (
    <section
      aria-label="NEFERTEM 理念"
      className="page-x relative overflow-hidden bg-surface-inverse py-28 text-inverse desk:py-48"
    >
      <div className="mx-auto max-w-5xl text-center">
        <Reveal>
          <LotusGlyph size={40} strokeWidth={1} className="mx-auto text-gold-light" />
        </Reveal>
        <Reveal className="mt-12">
          <p className="font-display text-display font-light leading-[1.02]">
            SCENT IS NOT
            <br />
            AN ACCESSORY.
          </p>
        </Reveal>
        <Reveal className="mt-8" delay={0.1}>
          <p className="font-display text-h2 font-light italic text-gold-light">
            It is memory. It is mood.
            <br />
            It is who you choose to be today.
          </p>
        </Reveal>
        <Reveal className="mt-14" delay={0.2}>
          <p className="mx-auto max-w-[24em] font-serif-zh text-lead text-inverse/80">
            香氣不是裝飾，而是一種記憶、一種情緒，
            <br className="hidden md:block" />
            也是今天的你想成為什麼樣子的選擇。
          </p>
        </Reveal>
      </div>
    </section>
  );
}
