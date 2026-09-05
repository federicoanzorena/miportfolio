import { CheckCircle, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { Container } from "@shared/ui/Container";
import { PageHeader } from "@shared/ui/PageHeader";
import { Reveal } from "@shared/ui/Reveal";
import { content } from "@shared/data/content";
import { registrarModificacion } from "@shared/api/agendaApi";

const PENDIENTES_KEY = "binfinito-modificar-pendientes";

interface FormData {
  nombre: string;
  email: string;
  url_sitio: string;
  que_cambiar: string;
  prioridades: string[];
  presupuesto: string;
  plazos: string;
  detalles_tecnicos: string;
  website: string;
}

function guardarPendiente(datos: FormData): void {
  try {
    const raw = localStorage.getItem(PENDIENTES_KEY);
    const pendientes: (FormData & { fecha: string })[] = raw
      ? JSON.parse(raw)
      : [];
    pendientes.push({ ...datos, fecha: new Date().toISOString() });
    localStorage.setItem(PENDIENTES_KEY, JSON.stringify(pendientes));
  } catch {
    // storage no disponible
  }
}

export function ModificarPage() {
  const mod = content.modificar;

  const [form, setForm] = useState<FormData>({
    nombre: "",
    email: "",
    url_sitio: "",
    que_cambiar: "",
    prioridades: [],
    presupuesto: "",
    plazos: "",
    detalles_tecnicos: "",
    website: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);
  const [errores, setErrores] = useState<{
    nombre?: string;
    email?: string;
    url?: string;
    queCambiar?: string;
  }>({});

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrores((prev) => {
      const siguientes = { ...prev };
      if (key === "nombre") siguientes.nombre = undefined;
      if (key === "email") siguientes.email = undefined;
      if (key === "url_sitio") siguientes.url = undefined;
      if (key === "que_cambiar") siguientes.queCambiar = undefined;
      return siguientes;
    });
  };

  const togglePrioridad = (item: string) => {
    setForm((prev) => ({
      ...prev,
      prioridades: prev.prioridades.includes(item)
        ? prev.prioridades.filter((p) => p !== item)
        : [...prev.prioridades, item],
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const nuevosErrores: {
      nombre?: string;
      email?: string;
      url?: string;
      queCambiar?: string;
    } = {};

    const nombreValido = form.nombre.trim().length > 0;
    const emailValido = form.email.trim().length > 0 && form.email.includes("@");
    const urlValido = /^https?:\/\/\S+$/i.test(form.url_sitio.trim());
    const queCambiarValido = form.que_cambiar.trim().length > 0;

    if (!nombreValido) nuevosErrores.nombre = mod.errorNombre;
    if (!emailValido) nuevosErrores.email = mod.errorEmail;
    if (!urlValido) nuevosErrores.url = mod.errorUrl;
    if (!queCambiarValido) nuevosErrores.queCambiar = mod.errorQueCambiar;

    setErrores(nuevosErrores);

    if (
      !nombreValido ||
      !emailValido ||
      !urlValido ||
      !queCambiarValido
    ) {
      return;
    }

    setError(null);
    setEnviando(true);

    registrarModificacion({
      nombre: form.nombre.trim(),
      email: form.email.trim(),
      url_sitio: form.url_sitio.trim(),
      que_cambiar: form.que_cambiar.trim(),
      prioridades: form.prioridades.join(", "),
      presupuesto: form.presupuesto,
      plazos: form.plazos,
      detalles_tecnicos: form.detalles_tecnicos.trim(),
      website: form.website,
    })
      .then(() => {
        setExito(true);
      })
      .catch(() => {
        guardarPendiente(form);
        setError(mod.error);
      })
      .finally(() => {
        setEnviando(false);
      });
  };

  const handleReset = () => {
    setForm({
      nombre: "",
      email: "",
      url_sitio: "",
      que_cambiar: "",
    prioridades: [],
    presupuesto: "",
    plazos: "",
    detalles_tecnicos: "",
    website: "",
  });
  setExito(false);
  };

  const inputClass =
    "focus-ring w-full rounded-xl border border-line bg-base/60 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-subtle";
  const labelClass = "mb-1.5 block text-sm font-medium text-zinc-200";

  return (
    <>
      <PageHeader
        eyebrow={mod.eyebrow}
        title={mod.title}
        description={mod.description}
      />

      <section aria-label="Formulario de modificación" className="pb-20 sm:pb-28">
        <Container>
          <Reveal>
            <div className="mx-auto max-w-2xl rounded-3xl border border-line bg-surface/70 p-6 sm:p-8">
              {exito ? (
                <div className="py-8 text-center">
                  <CheckCircle
                    aria-hidden
                    className="mx-auto size-10 text-emerald-400"
                  />
                  <h2 className="mt-4 text-lg font-semibold tracking-tight text-zinc-100">
                    {mod.successTitle}
                  </h2>
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
                    {mod.successDescription}
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="focus-ring mt-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium text-zinc-100 transition-colors hover:border-zinc-600"
                  >
                    <Send aria-hidden className="size-4" />
                    {mod.submitAnother}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="mod-nombre" className={labelClass}>
                        {mod.nombreLabel}
                      </label>
                      <input
                        id="mod-nombre"
                        type="text"
                        value={form.nombre}
                        onChange={(e) => update("nombre", e.target.value)}
                        placeholder={mod.nombrePlaceholder}
                        autoComplete="name"
                        className={inputClass}
                      />
                      {errores.nombre ? (
                        <p role="alert" className="mt-1.5 text-xs text-rose-400">
                          {errores.nombre}
                        </p>
                      ) : null}
                    </div>
                    <div>
                      <label htmlFor="mod-email" className={labelClass}>
                        {mod.emailLabel}
                      </label>
                      <input
                        id="mod-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        placeholder={mod.emailPlaceholder}
                        autoComplete="email"
                        className={inputClass}
                      />
                      {errores.email ? (
                        <p role="alert" className="mt-1.5 text-xs text-rose-400">
                          {errores.email}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="mod-url" className={labelClass}>
                      {mod.urlLabel}
                    </label>
                    <input
                      id="mod-url"
                      type="url"
                      value={form.url_sitio}
                      onChange={(e) => update("url_sitio", e.target.value)}
                      placeholder={mod.urlPlaceholder}
                      className={inputClass}
                    />
                    {errores.url ? (
                      <p role="alert" className="mt-1.5 text-xs text-rose-400">
                        {errores.url}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label htmlFor="mod-que-cambiar" className={labelClass}>
                      {mod.queCambiarLabel}
                    </label>
                    <textarea
                      id="mod-que-cambiar"
                      rows={4}
                      value={form.que_cambiar}
                      onChange={(e) => update("que_cambiar", e.target.value)}
                      placeholder={mod.queCambiarPlaceholder}
                      className={inputClass + " resize-none"}
                    />
                    {errores.queCambiar ? (
                      <p role="alert" className="mt-1.5 text-xs text-rose-400">
                        {errores.queCambiar}
                      </p>
                    ) : null}
                  </div>

                  <fieldset>
                    <legend className={labelClass}>{mod.prioridadesLabel}</legend>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {mod.prioridades.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => togglePrioridad(item)}
                          className={
                            "focus-ring rounded-full border px-4 py-2 text-sm font-medium transition-colors " +
                            (form.prioridades.includes(item)
                              ? "border-accent-500 bg-accent-500/15 text-accent-300"
                              : "border-line bg-base/40 text-zinc-300 hover:border-zinc-500")
                          }
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="mod-presupuesto" className={labelClass}>
                        {mod.presupuestoLabel}
                      </label>
                      <select
                        id="mod-presupuesto"
                        value={form.presupuesto}
                        onChange={(e) => update("presupuesto", e.target.value)}
                        className={inputClass}
                      >
                        <option value="">Seleccionar…</option>
                        {mod.presupuesto.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="mod-plazos" className={labelClass}>
                        {mod.plazosLabel}
                      </label>
                      <select
                        id="mod-plazos"
                        value={form.plazos}
                        onChange={(e) => update("plazos", e.target.value)}
                        className={inputClass}
                      >
                        <option value="">Seleccionar…</option>
                        {mod.plazos.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="mod-detalles" className={labelClass}>
                      {mod.detallesLabel}
                    </label>
                    <textarea
                      id="mod-detalles"
                      rows={3}
                      value={form.detalles_tecnicos}
                      onChange={(e) =>
                        update("detalles_tecnicos", e.target.value)
                      }
                      placeholder={mod.detallesPlaceholder}
                      className={inputClass + " resize-none"}
                    />
                  </div>

                  {/* Honeypot */}
                  <div aria-hidden="true" className="sr-only">
                    <label htmlFor="mod-website">Website</label>
                    <input
                      id="mod-website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.website}
                      onChange={(e) => update("website", e.target.value)}
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
                      <Send aria-hidden className="size-4" />
                    )}
                    {mod.submit}
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
