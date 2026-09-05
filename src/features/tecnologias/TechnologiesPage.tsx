import { TechnologyCard } from "./components/TechnologyCard";
import { Container } from "@shared/ui/Container";
import { PageHeader } from "@shared/ui/PageHeader";
import { content } from "@shared/data/content";

export function TechnologiesPage() {
  const technologies = content.technologies;

  return (
    <>
      <PageHeader
        eyebrow={technologies.eyebrow}
        title={technologies.title}
        description={technologies.description}
      />
      <section
        aria-label="Tecnologías y sus fundamentos"
        className="pb-20 sm:pb-28"
      >
        <Container>
          <h2 className="sr-only">Tecnologías y sus fundamentos</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {technologies.items.map((technology, index) => (
              <TechnologyCard
                key={technology.name}
                technology={technology}
                index={index}
              />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
