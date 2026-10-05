import { NefertemLogo } from "./NefertemLogo";

export function SiteFooter() {
  return (
    <footer className="page-x border-t border-line py-14 desk:py-20">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <NefertemLogo withTagline withGlyph size="md" />
        <p className="label text-faint">© {new Date().getFullYear()} NEFERTEM · FOLLOW THE SCENT</p>
      </div>
    </footer>
  );
}
