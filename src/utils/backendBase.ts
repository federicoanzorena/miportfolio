const baseConfigurada = (import.meta.env.VITE_API_BASE as string | undefined) ?? "";

export function apiUrl(ruta: string): string {
  return `${baseConfigurada.replace(/\/+$/, "")}${ruta}`;
}

export function wsUrl(salaId: string, token: string): string {
  const origen = baseConfigurada || window.location.origin;
  const protocolo = origen.startsWith("https") ? "wss" : "ws";
  const host = origen.replace(/^https?:\/\//, "");
  return `${protocolo}://${host}/ws/chat/${encodeURIComponent(salaId)}?token=${encodeURIComponent(token)}`;
}
