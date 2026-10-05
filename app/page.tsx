import { existsSync } from "node:fs";
import path from "node:path";
import { Manifesto } from "@/components/brand/Manifesto";
import { Hero } from "@/components/hero/Hero";
import { REFERENCE_IMAGE_PATH } from "@/components/hero/ReferenceImage";
import { TodaysChoice } from "@/components/recommendation/TodaysChoice";

/** Use the official illustration when it has been added to /public/images. */
function hasReferenceImage() {
  return existsSync(path.join(process.cwd(), "public", REFERENCE_IMAGE_PATH));
}

export default function HomePage() {
  return (
    <>
      <Hero hasReferenceImage={hasReferenceImage()} />
      <TodaysChoice />
      <Manifesto />
    </>
  );
}
