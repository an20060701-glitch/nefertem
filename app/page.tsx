import { Manifesto } from "@/components/brand/Manifesto";
import { Hero } from "@/components/hero/Hero";
import { MemberLanding } from "@/components/hero/MemberLanding";

/**
 * The cover. Today's Choice lives on /choice, opened from BEGIN TODAY'S RITUAL; a signed-in
 * member opening the site goes straight there (MemberLanding).
 */
export default function HomePage() {
  return (
    <>
      <MemberLanding />
      <Hero />
      <Manifesto />
    </>
  );
}
