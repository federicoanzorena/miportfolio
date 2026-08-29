import { Container } from "../components/ui/Container";
import { PageHeader } from "../components/ui/PageHeader";
import { Reveal } from "../components/ui/Reveal";
import { content } from "../data/content";

export function PrivacyPage() {
  const privacy = content.privacy;

  return (
    <>
      <PageHeader
        eyebrow={privacy.eyebrow}
        title={privacy.title}
        description={privacy.description}
      />
      <section aria-label="Contenido de la política de privacidad" className="pb-24 sm:pb-32">
        <Container>
          <div className="mx-auto max-w-2xl space-y-10">
            {privacy.sections.map((section) => (
              <Reveal key={section.title}>
                <article>
                  <h2 className="text-xl font-semibold tracking-tight text-zinc-100">
                    {section.title}
                  </h2>
                  {section.body.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="mt-3 text-base leading-relaxed text-muted"
                    >
                      {paragraph}
                    </p>
                  ))}
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
