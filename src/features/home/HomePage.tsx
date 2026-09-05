import { content } from "@shared/data/content";
import { TeamSection } from "./components/TeamSection";
import { DeliverablesPreview } from "./components/DeliverablesPreview";
import { Hero } from "./components/Hero";
import { ProcessPreview } from "./components/ProcessPreview";
import { ValueProps } from "./components/ValueProps";
import { CtaSection } from "@shared/ui/CtaSection";

export function HomePage() {
  return (
    <>
      <Hero />
      <ValueProps />
      <ProcessPreview />
      <DeliverablesPreview />
      <TeamSection />
      <CtaSection cta={content.home.cta} primaryTo="/modificar" />
    </>
  );
}
