import { Manifesto } from "@/components/brand/Manifesto";
import { Hero } from "@/components/hero/Hero";

/** The cover. Today's Choice lives on /choice, opened from BEGIN TODAY'S RITUAL. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Manifesto />
    </>
  );
}
