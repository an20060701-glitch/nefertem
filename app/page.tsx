import { Manifesto } from "@/components/brand/Manifesto";
import { Hero } from "@/components/hero/Hero";

/**
 * The cover. Today's Choice lives on /choice, opened from BEGIN TODAY'S RITUAL; a signed-in
 * member opening the site goes straight there (MemberLanding, in the layout).
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Manifesto />
    </>
  );
}
