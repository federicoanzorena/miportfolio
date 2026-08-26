import { content } from "../data/content";
import { TeamSection } from "../components/home/TeamSection";
import { DeliverablesPreview } from "../components/home/DeliverablesPreview";
import { Hero } from "../components/home/Hero";
import { ProcessPreview } from "../components/home/ProcessPreview";
import { ValueProps } from "../components/home/ValueProps";
import { CtaSection } from "../components/ui/CtaSection";

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
