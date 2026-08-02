# binfinito — Showcase de metodología

Sitio web profesional de binfinito, el equipo de desarrollo de Federico
Anzorena, que demuestra una metodología de trabajo para rediseñar sitios web
Frontend. No es un portfolio tradicional: es un recorrido por un proceso claro,
ordenado y profesional.

## Páginas

| Ruta            | Propósito                                    |
| --------------- | -------------------------------------------- |
| `/`             | Qué problema resuelve binfinito              |
| `/metodologia`  | Cómo trabaja el equipo (8 pasos)             |
| `/que-entrego`  | Qué recibe el cliente                        |
| `/arquitectura` | Cómo se organiza un proyecto profesional     |
| `/tecnologias`  | Por qué se utilizan estas herramientas       |
| `/nosotros`     | El equipo detrás de binfinito                |
| `/participar`   | Cómo sumarse al equipo                       |
| `/contacto`     | Cómo podemos comenzar un proyecto            |

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

## Accesibilidad

- HTML semántico y un único `h1` por página
- Navegación por teclado, skip-link y foco visible
- `aria-current` en la navegación activa
- Respeto por `prefers-reduced-motion`
- Verificado con axe-core (0 violaciones)
