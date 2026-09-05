import { FeatureCard } from "./components/FeatureCard";
import { Container } from "@shared/ui/Container";
import { PageHeader } from "@shared/ui/PageHeader";
import { content } from "@shared/data/content";

export function DeliverablesPage() {
  const deliverables = content.deliverables;

  return (
    <>
      <PageHeader
        eyebrow={deliverables.eyebrow}
        title={deliverables.title}
        description={deliverables.description}
      />
      <section aria-label="Entregables del proyecto" className="pb-20 sm:pb-28">
        <Container>
          <h2 className="sr-only">Entregables del proyecto</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {deliverables.items.map((item, index) => (
              <FeatureCard key={item.title} item={item} index={index} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
