import { CheckCircle, Loader2, UserPlus } from "lucide-react";
import { useState } from "react";
import { Container } from "../components/ui/Container";
import { PageHeader } from "../components/ui/PageHeader";
import { Reveal } from "../components/ui/Reveal";
import { content } from "../data/content";
import { registrarInteres } from "../utils/agendaApi";

export function SumatePage() {
  const sumate = content.sumate;

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!nombre.trim() || !email.trim() || !email.includes("@")) {
      setError(sumate.invalidForm);
      return;
    }

    setError(null);
    setEnviando(true);

    registrarInteres({
      nombre: nombre.trim(),
      email: email.trim(),
    })
      .then(() => {
        setExito(true);
      })
      .catch(() => {
        setError(sumate.error);
      })
      .finally(() => {
        setEnviando(false);
      });
  };

  const handleReset = () => {
    setNombre("");
    setEmail("");
    setExito(false);
  };

  return (
    <>
      <PageHeader
        eyebrow={sumate.eyebrow}
        title={sumate.title}
        description={sumate.description}
      />

      <section aria-label="Formulario de registro" className="pb-20 sm:pb-28">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-lg rounded-3xl border border-line bg-surface/70 p-6 sm:p-8">
              {exito ? (
                <div className="py-8 text-center">
                  <CheckCircle
                    aria-hidden
                    className="mx-auto size-10 text-emerald-400"
                  />
                  <h2 className="mt-4 text-lg font-semibold tracking-tight text-zinc-100">
                    {sumate.successTitle}
                  </h2>
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
                    {sumate.successDescription}
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="focus-ring mt-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium text-zinc-100 transition-colors hover:border-zinc-600"
                  >
                    <UserPlus aria-hidden className="size-4" />
                    {sumate.submitAnother}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="sumate-nombre"
                      className="mb-1.5 block text-sm font-medium text-zinc-200"
                    >
                      {sumate.nombreLabel}
                    </label>
                    <input
                      id="sumate-nombre"
                      type="text"
                      value={nombre}
                      onChange={(event) => setNombre(event.target.value)}
                      placeholder={sumate.nombrePlaceholder}
                      autoComplete="name"
                      className="focus-ring w-full rounded-xl border border-line bg-base/60 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-subtle"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="sumate-email"
                      className="mb-1.5 block text-sm font-medium text-zinc-200"
                    >
                      {sumate.emailLabel}
                    </label>
                    <input
                      id="sumate-email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder={sumate.emailPlaceholder}
                      autoComplete="email"
                      className="focus-ring w-full rounded-xl border border-line bg-base/60 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-subtle"
                    />
                  </div>

                  {error ? (
                    <p role="alert" className="text-sm text-rose-400">
                      {error}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={enviando}
                    className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-zinc-50 px-6 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {enviando ? (
                      <Loader2 aria-hidden className="size-4 animate-spin" />
                    ) : (
                      <UserPlus aria-hidden className="size-4" />
                    )}
                    {sumate.submit}
                  </button>
                </form>
              )}
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
