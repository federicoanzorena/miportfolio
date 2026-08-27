const baseConfigurada = (import.meta.env.VITE_API_BASE as string | undefined) ?? "";

export function apiUrl(ruta: string): string {
  return `${baseConfigurada.replace(/\/+$/, "")}${ruta}`;
}
