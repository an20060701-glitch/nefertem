import { EditorialNumber } from "@/components/brand/EditorialHeading";
import { Reveal } from "@/components/ui/Reveal";

const STEPS = [
  { label: "THE WEATHER", zh: "今天的天氣如何？", note: "TAIPEI · 26°C · RAINY" },
  { label: "THE OCCASION", zh: "你今天會去哪裡？", note: "INDOOR 涼爽的室內 ／ OUTDOOR 戶外活動" },
  {
    label: "THE IMPRESSION",
    zh: "今天，你想留下什麼樣的氣味？",
    note: "MYSTERIOUS · FRESH · WARM · CALM · MATURE · SEDUCTIVE · BOLD",
  },
];

/**
 * Today's Choice entry: the three questions of the ritual laid out as an
 * editorial contents page. The interactive flow arrives in Phase 2.
 */
export function ChoicePreview() {
  return (
    <section
      id="todays-choice"
      aria-labelledby="choice-title"
      className="page-x scroll-mt-24 border-t border-line py-24 desk:py-40"
    >
      <div className="grid gap-16 desk:grid-cols-12 desk:gap-6">
        <Reveal className="desk:col-span-4">
          <p className="label text-muted">TODAY&apos;S CHOICE</p>
          <h2 id="choice-title" className="mt-5 font-serif-zh text-h1-zh text-ink">
            三個問題，
            <br />
            找到今天的你。
          </h2>
          <p className="mt-6 max-w-[22em] text-muted">
            天氣、場合與你想留下的印象，會決定今天最適合你的香氣。
          </p>
        </Reveal>

        <ol className="desk:col-span-7 desk:col-start-6">
          {STEPS.map((step, i) => (
            <Reveal
              as="li"
              key={step.label}
              className="border-t border-line py-10 first:border-t-0 first:pt-0 desk:py-14"
            >
              <EditorialNumber index={i + 1} label={step.label} />
              <p className="mt-6 font-serif-zh text-h2 text-ink">{step.zh}</p>
              <p className="label mt-4 text-faint">{step.note}</p>
            </Reveal>
          ))}
        </ol>
      </div>

      <Reveal className="mt-16 flex items-center gap-6 desk:mt-24">
        <span aria-hidden className="h-px flex-1 bg-line" />
        <span className="label text-gold-text">儀式即將開啟 · OPENING SOON</span>
        <span aria-hidden className="h-px flex-1 bg-line" />
      </Reveal>
    </section>
  );
}
