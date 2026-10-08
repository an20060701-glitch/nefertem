import { EditorialNumber } from "@/components/brand/EditorialHeading";
import { EgyptianGlyph } from "@/components/brand/EgyptianGlyph";

type GlyphName = React.ComponentProps<typeof EgyptianGlyph>["name"];

/** "01 THE WEATHER" + the step's question, with its glyph at the margin. */
export function StepHeading({
  index,
  label,
  question,
  glyph,
  id,
}: {
  index: number;
  label: string;
  question: string;
  glyph: GlyphName;
  id: string;
}) {
  return (
    <div className="flex items-start justify-between gap-6">
      <div>
        <EditorialNumber index={index} label={label} className="max-md:[&>span:first-child]:text-[2rem]" />
        <h3
          id={id}
          tabIndex={-1}
          className="mt-2 font-serif-zh text-h1-zh text-ink outline-none max-md:text-[1.375rem] max-md:leading-snug md:mt-4"
        >
          {question}
        </h3>
      </div>
      <EgyptianGlyph name={glyph} size={28} className="mt-2 shrink-0 opacity-70" />
    </div>
  );
}
