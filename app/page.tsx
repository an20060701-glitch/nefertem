import { Manifesto } from "@/components/brand/Manifesto";
import { Hero } from "@/components/hero/Hero";
import { TodaysChoice } from "@/components/recommendation/TodaysChoice";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TodaysChoice />
      <Manifesto />
    </>
  );
}
