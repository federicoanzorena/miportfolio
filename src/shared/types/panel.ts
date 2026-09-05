export interface SolicitudSumate {
  id: number;
  nombre: string;
  email: string;
  fecha: string;
}

export interface SolicitudModificar {
  id: number;
  nombre: string;
  email: string;
  url_sitio: string;
  que_cambiar: string;
  prioridades: string;
  presupuesto: string;
  plazos: string;
  detalles_tecnicos: string;
  fecha: string;
}
