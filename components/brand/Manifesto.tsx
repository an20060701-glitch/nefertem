import { EgyptianGlyph } from "./EgyptianGlyph";
import { LotusGlyph } from "./LotusGlyph";
import { SunDisc } from "./SunDisc";
import { Reveal } from "@/components/ui/Reveal";

/** The design statement, set on midnight indigo — the blue lotus at night. */
export function Manifesto() {
  return (
    <section
      aria-label="Nefertem 理念"
      className="page-x relative overflow-hidden bg-surface-inverse py-28 text-inverse desk:py-48"
    >
      <EgyptianGlyph
        name="ankh"
        size={30}
        className="absolute left-[8%] top-[18%] text-gold-light opacity-45 desk:left-[14%]"
      />
      <EgyptianGlyph
        name="eye"
        size={34}
        className="absolute right-[8%] top-[24%] text-gold-light opacity-40 desk:right-[14%]"
      />
      <EgyptianGlyph
        name="stalk"
        size={30}
        className="absolute bottom-[14%] left-[12%] text-gold-light opacity-40 desk:left-[20%]"
      />
      <div className="mx-auto max-w-5xl text-center">
        <Reveal>
          <div className="relative mx-auto flex h-36 w-36 items-center justify-center">
            <SunDisc id="manifesto-sun" className="absolute inset-0 opacity-85" />
            <LotusGlyph size={52} strokeWidth={1} className="relative text-surface-inverse" />
          </div>
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
