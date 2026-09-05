import {
  ClipboardList,
  KeyRound,
  Loader2,
  LogOut,
  Mail,
  RefreshCw,
  UserPlus,
  Wrench,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SolicitudesPanel } from "@features/solicitudes";
import { Container } from "@shared/ui/Container";
import { PageHeader } from "@shared/ui/PageHeader";
import { Reveal } from "@shared/ui/Reveal";
import { content } from "@shared/data/content";
import type { SolicitudModificar, SolicitudSumate } from "@shared/types/panel";
import {
  listarModificar,
  listarSumate,
  loginPanel,
  logoutPanel,
  panelEstado,
} from "@shared/api/agendaApi";

type Pestana = "sumate" | "modificar" | "solicitudes";

export function PanelPage() {
  const panel = content.panel;

  const [clave, setClave] = useState("");
  const [autenticado, setAutenticado] = useState<boolean | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [ingresando, setIngresando] = useState(false);

  const [pestana, setPestana] = useState<Pestana>("sumate");
  const [sumate, setSumate] = useState<SolicitudSumate[]>([]);
  const [modificar, setModificar] = useState<SolicitudModificar[]>([]);
  const [cargando, setCargando] = useState(false);
  const [cargaError, setCargaError] = useState(false);

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    setCargaError(false);
    try {
      const [s, m] = await Promise.all([listarSumate(), listarModificar()]);
      setSumate(s);
      setModificar(m);
    } catch {
      setCargaError(true);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    panelEstado()
      .then(() => {
        setAutenticado(true);
        cargarDatos();
      })
      .catch(() => setAutenticado(false));
  }, [cargarDatos]);

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    if (!clave.trim() || ingresando) return;

    setIngresando(true);
    setLoginError(null);
    loginPanel(clave.trim())
      .then(() => {
        setAutenticado(true);
        setClave("");
        cargarDatos();
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "";
        setLoginError(msg === "Panel deshabilitado" ? panel.disabledError : panel.loginError);
      })
      .finally(() => setIngresando(false));
  };

  const handleLogout = () => {
    void logoutPanel()
      .then(() => setAutenticado(false))
      .catch(() => setAutenticado(false));
  };

  if (autenticado === null) {
    return (
      <div className="grid min-h-[60vh] place-items-center pb-20 sm:pb-28">
        <span className="size-8 animate-spin rounded-full border-2 border-line border-t-accent-500" />
      </div>
    );
  }

  if (!autenticado) {
    return (
      <>
        <PageHeader
          eyebrow={panel.eyebrow}
          title={panel.title}
          description={panel.description}
        />
        <section aria-label="Login del panel" className="pb-20 sm:pb-28">
          <Container>
            <Reveal>
              <div className="mx-auto max-w-md rounded-3xl border border-line bg-surface/70 p-6 sm:p-8">
                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label
                      htmlFor="panel-clave"
                      className="mb-1.5 block text-sm font-medium text-zinc-200"
                    >
                      {panel.claveLabel}
                    </label>
                    <input
                      id="panel-clave"
                      type="password"
                      value={clave}
                      onChange={(e) => setClave(e.target.value)}
                      placeholder={panel.clavePlaceholder}
                      autoComplete="current-password"
                      className="focus-ring w-full rounded-xl border border-line bg-base/60 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-subtle"
                    />
                  </div>
                  {loginError ? (
                    <p role="alert" className="text-sm text-rose-400">
                      {loginError}
                    </p>
                  ) : null}
                  <button
                    type="submit"
                    disabled={ingresando || clave.trim() === ""}
                    className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-zinc-50 px-6 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {ingresando ? (
                      <Loader2 aria-hidden className="size-4 animate-spin" />
                    ) : (
                      <KeyRound aria-hidden className="size-4" />
                    )}
                    {panel.login}
                  </button>
                </form>
                <Link
                  to="/"
                  className="focus-ring mt-6 inline-block text-sm text-muted transition-colors hover:text-zinc-100"
                >
                  {panel.backHome}
                </Link>
              </div>
            </Reveal>
          </Container>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow={panel.eyebrow}
        title={panel.title}
        description={panel.description}
      />
      <section aria-label="Panel de solicitudes" className="pb-20 sm:pb-28">
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div
                role="tablist"
                aria-label="Solicitudes"
                className="inline-flex rounded-full border border-line bg-surface p-1"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={pestana === "sumate"}
                  onClick={() => setPestana("sumate")}
                  className={
                    "focus-ring inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors " +
                    (pestana === "sumate"
                      ? "bg-zinc-50 text-zinc-900"
                      : "text-muted hover:text-zinc-100")
                  }
                >
                  <UserPlus aria-hidden className="size-4" />
                  {panel.tabSumate}
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={pestana === "modificar"}
                  onClick={() => setPestana("modificar")}
                  className={
                    "focus-ring inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors " +
                    (pestana === "modificar"
                      ? "bg-zinc-50 text-zinc-900"
                      : "text-muted hover:text-zinc-100")
                  }
                >
                  <Wrench aria-hidden className="size-4" />
                  {panel.tabModificar}
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={pestana === "solicitudes"}
                  onClick={() => setPestana("solicitudes")}
                  className={
                    "focus-ring inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors " +
                    (pestana === "solicitudes"
                      ? "bg-zinc-50 text-zinc-900"
                      : "text-muted hover:text-zinc-100")
                  }
                >
                  <ClipboardList aria-hidden className="size-4" />
                  Rastreador
                </button>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="focus-ring inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium text-zinc-100 transition-colors hover:border-zinc-600"
              >
                <LogOut aria-hidden className="size-4" />
                {panel.logout}
              </button>
            </div>

            {cargando ? (
              <div className="flex items-center justify-center py-16 text-muted">
                <Loader2 aria-hidden className="mr-2 size-5 animate-spin" />
                {panel.loading}
              </div>
            ) : cargaError ? (
              <div className="rounded-3xl border border-line bg-surface/70 p-10 text-center">
                <p className="text-sm text-rose-400">{panel.error}</p>
                <button
                  type="button"
                  onClick={cargarDatos}
                  className="focus-ring mt-4 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium text-zinc-100 transition-colors hover:border-zinc-600"
                >
                  <RefreshCw aria-hidden className="size-4" />
                  {panel.retry}
                </button>
              </div>
            ) : pestana === "solicitudes" ? (
              <SolicitudesPanel />
            ) : pestana === "sumate" ? (
              sumate.length === 0 ? (
                <div className="rounded-3xl border border-line bg-surface/70 p-10 text-center text-sm text-muted">
                  {panel.emptySumate}
                </div>
              ) : (
                <ul className="space-y-3">
                  {sumate.map((s) => (
                    <li
                      key={s.id}
                      className="rounded-2xl border border-line bg-surface/70 p-5"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium text-zinc-100">{s.nombre}</p>
                          <a
                            href={`mailto:${s.email}`}
                            className="mt-1 inline-flex items-center gap-1.5 text-sm text-accent-400 transition-colors hover:text-accent-300"
                          >
                            <Mail aria-hidden className="size-3.5" />
                            {s.email}
                          </a>
                          <p className="mt-2 text-xs text-subtle">#{s.id}</p>
                        </div>
                        <span className="shrink-0 text-xs text-subtle">
                          {s.fecha}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )
            ) : modificar.length === 0 ? (
              <div className="rounded-3xl border border-line bg-surface/70 p-10 text-center text-sm text-muted">
                {panel.emptyModificar}
              </div>
            ) : (
              <ul className="space-y-3">
                {modificar.map((m) => (
                  <li
                    key={m.id}
                    className="rounded-2xl border border-line bg-surface/70 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-zinc-100">{m.nombre}</p>
                        <a
                          href={`mailto:${m.email}`}
                          className="mt-1 inline-flex items-center gap-1.5 text-sm text-accent-400 transition-colors hover:text-accent-300"
                        >
                          <Mail aria-hidden className="size-3.5" />
                          {m.email}
                        </a>
                        <a
                          href={m.url_sitio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-block break-all text-sm text-accent-400 transition-colors hover:text-accent-300"
                        >
                          {m.url_sitio}
                        </a>
                      </div>
                      <span className="shrink-0 text-xs text-subtle">
                        {m.fecha}
                      </span>
                    </div>
                    <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-subtle">
                          {content.modificar.queCambiarLabel}
                        </dt>
                        <dd className="mt-1 text-sm text-zinc-300">
                          {m.que_cambiar}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-subtle">
                          {content.modificar.prioridadesLabel}
                        </dt>
                        <dd className="mt-1 text-sm text-zinc-300">
                          {m.prioridades}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-subtle">
                          {content.modificar.presupuestoLabel}
                        </dt>
                        <dd className="mt-1 text-sm text-zinc-300">
                          {m.presupuesto || "—"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-subtle">
                          {content.modificar.plazosLabel}
                        </dt>
                        <dd className="mt-1 text-sm text-zinc-300">
                          {m.plazos || "—"}
                        </dd>
                      </div>
                      {m.detalles_tecnicos ? (
                        <div className="sm:col-span-2">
                          <dt className="text-xs font-medium uppercase tracking-wide text-subtle">
                            {content.modificar.detallesLabel}
                          </dt>
                          <dd className="mt-1 text-sm text-zinc-300">
                            {m.detalles_tecnicos}
                          </dd>
                        </div>
                      ) : null}
                    </dl>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
