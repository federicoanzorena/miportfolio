# binfinito — Showcase de metodología

Sitio web profesional de binfinito, el equipo de desarrollo de Federico
Anzorena, que demuestra una metodología de trabajo para rediseñar sitios web
Frontend. No es un portfolio tradicional: es un recorrido por un proceso claro,
ordenado y profesional.

## Páginas

| Ruta            | Propósito                                |
| --------------- | ---------------------------------------- |
| `/`             | Qué problema resuelve binfinito          |
| `/metodologia`  | Cómo trabaja el equipo (8 pasos)         |
| `/que-entrego`  | Qué recibe el cliente                    |
| `/arquitectura` | Cómo se organiza un proyecto profesional |
| `/tecnologias`  | Por qué se utilizan estas herramientas   |
| `/nosotros`     | El equipo detrás de binfinito            |
| `/participar`   | Cómo sumarse al equipo                   |
| `/contacto`     | Cómo podemos comenzar un proyecto        |

## Stack

- React 19 + Vite
- TypeScript (tipado estricto)
- Tailwind CSS v4
- Framer Motion (animaciones)
- Lucide React (iconografía)
- React Router
- clsx

## Estructura del proyecto

```
src/
  components/   UI y componentes de sección
    layout/     Navbar, Footer, Layout
    ui/         Primitivas reutilizables
    home/       Secciones de la página de inicio
    ...
  pages/        Una carpeta por ruta
  hooks/        Hooks personalizados
  types/        Tipos compartidos
  data/         Contenido centralizado (traducciones futuras)
  utils/        Utilidades (cn)
  styles/       Tema y estilos base
```

Todo el contenido textual vive en `src/data/content.ts` para permitir una
futura traducción sin tocar componentes.

## Scripts

```bash
npm run dev      # desarrollo
npm run build    # build de producción
npm run preview  # previsualizar el build
npm run lint     # eslint
npm run format   # prettier
```

## Reactivación

Proyecto en standby hasta conseguir las credenciales SMTP y el dominio de
binfinito. Para retomar:

1. **Crear franjas disponibles** (no hay UI de admin):
   ```bash
   python -m server.agenda.crear_franjas                              # modo ejemplo
   python -m server.agenda.crear_franjas --franja 2026-08-20 15:00 15:30
   ```
   El modo ejemplo crea franjas de prueba en los próximos 5 días hábiles y lo
   avisa al final; sin `--franja` no es una carga real de agenda.
2. **Levantar local**: backend con `uvicorn server.main:app --port 8000` (ver
   `Procfile`) y frontend con `npm run dev` (el proxy de Vite ya apunta a :8000).
3. **Activar email**: definir `SMTP_*` (`SMTP_ENABLED=true`, `SMTP_HOST`,
   `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`). Con
   `SMTP_ENABLED=false` el envío se loguea y no se manda.
4. **Deploy**: backend en Railway (nixpacks/Procfile) con `DATABASE_URL`,
   `BINFINITO_SECRET` y `FRONTEND_ORIGINS`; frontend en Netlify (`netlify.toml`).

### Pendientes futuros

- Ruta `/sala/:salaId?token=...` para entrar a la sala desde el email.
- Canal de alerta aparte para fallos de envío de email (Sentry u otro).

## Accesibilidad

- HTML semántico y un único `h1` por página
- Navegación por teclado, skip-link y foco visible
- `aria-current` en la navegación activa
- Respeto por `prefers-reduced-motion`
- Verificado con axe-core (0 violaciones)
