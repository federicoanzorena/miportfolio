import type { SolicitudModificar, SolicitudSumate } from "@shared/types/panel";
import { apiUrl } from "@shared/lib/backendBase";

async function peticion<T>(ruta: string, init?: RequestInit): Promise<T> {
  const response = await fetch(apiUrl(ruta), init);
  if (!response.ok) {
    let detalle = `Error ${response.status}`;
    try {
      const body = (await response.json()) as { detail?: string };
      detalle = body.detail ?? detalle;
    } catch {
      // respuesta sin cuerpo JSON
    }
    throw new Error(detalle);
  }
  return (await response.json()) as T;
}

export function registrarInteres(datos: {
  nombre: string;
  email: string;
}): Promise<{ ok: boolean; mensaje: string }> {
  return peticion("/api/sumate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
}

export function registrarModificacion(datos: {
  nombre: string;
  email: string;
  url_sitio: string;
  que_cambiar: string;
  prioridades: string;
  presupuesto: string;
  plazos: string;
  detalles_tecnicos: string;
  website: string;
}): Promise<{ ok: boolean; mensaje: string }> {
  return peticion("/api/modificar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
}

export function loginPanel(clave: string): Promise<{ ok: boolean }> {
  return peticion("/api/panel/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clave }),
  });
}

export function panelEstado(): Promise<{ autenticado: boolean }> {
  return peticion("/api/panel/estado", { credentials: "include" });
}

export function logoutPanel(): Promise<{ ok: boolean }> {
  return peticion("/api/panel/logout", {
    method: "POST",
    credentials: "include",
  });
}

export function listarSumate(): Promise<SolicitudSumate[]> {
  return peticion("/api/panel/solicitudes-sumate", { credentials: "include" });
}

export function listarModificar(): Promise<SolicitudModificar[]> {
  return peticion("/api/panel/solicitudes-modificar", {
    credentials: "include",
  });
}
