import { Timeline } from "../components/methodology/Timeline";
import { Container } from "../components/ui/Container";
import { PageHeader } from "../components/ui/PageHeader";
import { content } from "../data/content";

export function MethodologyPage() {
  const methodology = content.methodology;

  return (
    <>
      <PageHeader
        eyebrow={methodology.eyebrow}
        title={methodology.title}
        description={methodology.description}
      />
      <section aria-label="Pasos del proceso" className="pb-20 sm:pb-28">
        <Container>
          <h2 className="sr-only">Pasos del proceso</h2>
          <Timeline />
        </Container>
      </section>
    </>
  );
}
