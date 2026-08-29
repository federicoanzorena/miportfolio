import { Link } from "react-router-dom";
import { content } from "../../data/content";
import { Container } from "../ui/Container";
import { Logo } from "../ui/Logo";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-surface/30">
      <Container className="py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="focus-ring inline-flex items-center gap-2.5 rounded-lg"
              aria-label={`${content.brand.name} — Inicio`}
            >
              <Logo />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              {content.footer.description}
            </p>
          </div>

          <nav aria-label="Enlaces del pie de página">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-subtle">
              {content.footer.exploreTitle}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {content.footer.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="focus-ring rounded text-sm text-muted transition-colors hover:text-zinc-100"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-subtle">
              {content.footer.techTitle}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {content.footer.techItems.map((tech) => (
                <li key={tech} className="text-sm text-muted">
                  {tech}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 sm:flex-row">
          <p className="text-xs text-subtle">
            © {year} {content.brand.name}. {content.footer.legal}
          </p>
          <p className="flex items-center gap-4 text-xs text-subtle">
            <Link
              to="/privacidad"
              className="focus-ring rounded text-subtle transition-colors hover:text-zinc-100"
            >
              Privacidad
            </Link>
            <span>{content.footer.credit}</span>
          </p>
        </div>
      </Container>
    </footer>
  );
}
