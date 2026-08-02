import { ArrowLeft } from "lucide-react";
import { AnimatedButton } from "../components/ui/AnimatedButton";
import { Container } from "../components/ui/Container";
import { content } from "../data/content";

export function NotFoundPage() {
  const notFound = content.notFound;

  return (
    <section className="grid min-h-[70vh] place-items-center pb-24 pt-28 sm:pt-36">
      <Container className="text-center">
        <p className="font-mono text-sm font-semibold tracking-widest text-accent-400">
          {notFound.eyebrow}
        </p>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
          {notFound.title}
        </h1>
        <p className="mx-auto mt-5 max-w-md text-pretty text-base leading-relaxed text-muted">
          {notFound.description}
        </p>
        <div className="mt-9">
          <AnimatedButton
            to="/"
            variant="secondary"
            icon={ArrowLeft}
            iconPosition="left"
          >
            {notFound.cta}
          </AnimatedButton>
        </div>
      </Container>
    </section>
  );
}
