import {
  Activity,
  Atom,
  BadgeCheck,
  CodeXml,
  Component as ComponentIcon,
  Eye,
  FileCode,
  FolderTree,
  Gauge,
  Layers,
  Mail,
  Monitor,
  PenTool,
  PlusSquare,
  Rocket,
  ScanSearch,
  Search,
  Server,
  Shapes,
  Smartphone,
  Sparkles,
  Target,
  Users,
  WandSparkles,
  Wind,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type {
  ArchitectureReason,
  ContactChannel,
  Deliverable,
  FolderNode,
  HeroContent,
  NavItem,
  Step,
  TeamMember,
  Technology,
} from "../types";

import photo from "../assets/foto.webp";

export interface Highlight {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface PreviewSection {
  eyebrow: string;
  title: string;
  description: string;
}

export interface ProcessStep {
  label: string;
  phase: string;
  description: string;
}

export interface CtaSection {
  title: string;
  description: string;
  primary: string;
  secondary: string;
}

export interface ContactContent {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: string;
  channels: ContactChannel[];
  availability: { title: string; value: string };
  nextSteps: { step: string; title: string; description: string }[];
}

export interface ParticipateRole {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
}

export interface ParticipateContent {
  eyebrow: string;
  title: string;
  description: string;
  intro: string;
  rolesTitle: string;
  roles: ParticipateRole[];
  howTitle: string;
  howDescription: string;
  steps: { step: string; title: string; description: string }[];
  ctaTitle: string;
  ctaDescription: string;
  cta: string;
  secondaryCta: string;
}

interface Content {
  brand: { name: string };
  nav: { items: NavItem[]; cta: string };
  team: {
    eyebrow: string;
    title: string;
    description: string;
    intro: string;
    bio: string[];
    members: TeamMember[];
    skills: string[];
    homeCta: string;
    openCta: string;
  };
  participate: ParticipateContent;
  footer: {
    description: string;
    exploreTitle: string;
    techTitle: string;
    techItems: string[];
    links: NavItem[];
    credit: string;
    legal: string;
  };
  home: {
    hero: HeroContent;
    highlight: Highlight[];
    processPreview: PreviewSection & {
      steps: ProcessStep[];
      cta: string;
      tags: string[];
    };
    deliverablesPreview: PreviewSection & { cta: string };
    cta: CtaSection;
  };
  methodology: PreviewSection & { steps: Step[] };
  deliverables: PreviewSection & { items: Deliverable[] };
  architecture: PreviewSection & {
    treeIntro: string;
    checklist: string[];
    tree: FolderNode[];
    reasons: ArchitectureReason[];
  };
  technologies: PreviewSection & { items: Technology[] };
  contact: ContactContent;
  notFound: {
    eyebrow: string;
    title: string;
    description: string;
    cta: string;
  };
  common: { backHome: string; skipLink: string };
}

export const content: Content = {
  brand: {
    name: "binfinito",
  },
  nav: {
    items: [
      { to: "/", label: "Inicio" },
      { to: "/metodologia", label: "Metodología" },
      { to: "/que-entrego", label: "Qué entregamos" },
      { to: "/arquitectura", label: "Arquitectura" },
      { to: "/tecnologias", label: "Tecnologías" },
      { to: "/nosotros", label: "Nosotros" },
      { to: "/contacto", label: "Contacto" },
    ],
    cta: "Empezar un proyecto",
  },
  team: {
    eyebrow: "Nosotros",
    title: "binfinito",
    description:
      "Un equipo de desarrolladores que transforma sitios existentes en experiencias modernas, con procesos claros y código que se mantiene en el tiempo.",
    intro: "Un equipo de desarrolladores en crecimiento",
    bio: [
      "binfinito es un equipo de desarrolladores que comparte una misma manera de trabajar: procesos claros, código ordenado y foco en resultados que se mantienen en el tiempo.",
      "Hoy el equipo lo integra Federico Anzorena, desarrollador fullstack con foco en el Frontend. Cada proyecto se aborda de forma estructurada: analizamos, diseñamos, construimos y entregamos con criterio.",
      "Creemos en la claridad por encima de la complejidad: menos herramientas, menos fricción y más calidad visible en cada detalle. Y creemos que el mejor proyecto se construye entre personas con ganas.",
    ],
    members: [
      {
        id: "federico",
        name: "Federico Anzorena",
        role: "Desarrollador Fullstack",
        photo,
        photoAlt:
          "Federico Anzorena, desarrollador fullstack y miembro de binfinito",
        filled: true,
      },
      {
        id: "slot-frontend",
        name: "¿El próximo?",
        role: "Desarrollador Frontend",
        filled: false,
      },
      {
        id: "slot-backend",
        name: "¿El próximo?",
        role: "Desarrollador Backend",
        filled: false,
      },
      {
        id: "slot-tu-rol",
        name: "¿El próximo?",
        role: "Tu rol aquí",
        filled: false,
      },
    ],
    skills: [
      "React",
      "TypeScript",
      "Node.js",
      "Backend",
      "Diseño UI",
      "Arquitectura Frontend",
    ],
    homeCta: "Conocer al equipo",
    openCta: "Quiero sumarme al equipo",
  },
  participate: {
    eyebrow: "Participar",
    title: "Sumate al equipo",
    description:
      "binfinito crece con personas que comparten la misma manera de pensar el trabajo. Si te interesa ser parte, contanos quién sos.",
    intro:
      "binfinito es un equipo de desarrolladores en crecimiento. Buscamos gente con ganas de construir, aprender y hacer las cosas bien: sin ego, con foco en el resultado y con espacio para ideas propias.",
    rolesTitle: "Qué perfiles buscamos",
    roles: [
      {
        title: "Desarrollador Frontend",
        description:
          "Para construir interfaces modernas con React, TypeScript y Tailwind, cuidando cada detalle de la experiencia.",
        icon: Monitor,
        accent: "from-sky-400 to-blue-500",
      },
      {
        title: "Desarrollador Backend",
        description:
          "Para diseñar APIs, lógica de negocio y sistemas que soporten productos sólidos y escalables.",
        icon: Server,
        accent: "from-violet-400 to-purple-500",
      },
      {
        title: "Colegas de otras áreas",
        description:
          "Diseñadores, testing, producto y otras disciplinas que suman calidad al trabajo del equipo.",
        icon: Users,
        accent: "from-emerald-400 to-teal-500",
      },
    ],
    howTitle: "Cómo participar",
    howDescription:
      "Pronto iremos sumando información sobre convocatorias y procesos de aplicación. Mientras tanto, el primer paso es siempre el mismo:",
    steps: [
      {
        step: "01",
        title: "Escríbenos",
        description:
          "Contanos quién sos, qué hacés y por qué te interesa ser parte de binfinito.",
      },
      {
        step: "02",
        title: "Compartimos la información",
        description:
          "En esta sección iremos publicando cómo participar y qué buscamos en cada convocatoria.",
      },
      {
        step: "03",
        title: "Sumate al equipo",
        description:
          "Si hay match, coordinamos la incorporación y arrancamos a construir juntos.",
      },
    ],
    ctaTitle: "¿Tenés ganas de construir con nosotros?",
    ctaDescription:
      "Escribinos y contanos de tu perfil. El equipo se arma con personas, no con currículums.",
    cta: "Escribir al equipo",
    secondaryCta: "Conocer al equipo",
  },
  footer: {
    description:
      "Rediseño de sitios web Frontend con procesos claros, código limpio y resultados medibles.",
    exploreTitle: "Explorar",
    techTitle: "Stack",
    techItems: ["React", "TypeScript", "Tailwind CSS", "Vite"],
    links: [
      { to: "/", label: "Inicio" },
      { to: "/metodologia", label: "Metodología" },
      { to: "/que-entrego", label: "Qué entregamos" },
      { to: "/arquitectura", label: "Arquitectura" },
      { to: "/tecnologias", label: "Tecnologías" },
      { to: "/nosotros", label: "Nosotros" },
      { to: "/participar", label: "Participar" },
      { to: "/contacto", label: "Contacto" },
    ],
    credit: "Hecho con React, TypeScript y Tailwind CSS",
    legal: "Todos los derechos reservados.",
  },
  home: {
    hero: {
      badge: "Rediseño Frontend profesional",
      titleA: "Transformamos sitios web existentes en",
      titleAccent: "experiencias modernas",
      titleB: "que se mantienen con facilidad.",
      description:
        "Rediseñamos proyectos sin descartar lo que ya funciona: misma estructura original, nueva apariencia, mejor rendimiento y un código limpio y ordenado que tu equipo pueda mantener sin fricción.",
      primaryCta: "Conocer la metodología",
      secondaryCta: "Ver arquitectura del proyecto",
      visualCaption: "El mismo sitio, rediseñado.",
    },
    highlight: [
      {
        title: "Rapidez",
        description:
          "Sitios que cargan rápido y se sienten instantáneos en cualquier dispositivo.",
        icon: Rocket,
      },
      {
        title: "Modernidad",
        description:
          "Interfaces actuales, elegantes y alineadas con las tendencias de diseño actuales.",
        icon: Sparkles,
      },
      {
        title: "Escalabilidad",
        description:
          "Estructuras pensadas para crecer con nuevas secciones y funcionalidades.",
        icon: Layers,
      },
    ],
    processPreview: {
      eyebrow: "Cómo trabajamos",
      title: "Un método probado, paso a paso",
      description:
        "No improvisamos. Cada rediseño sigue un proceso definido que garantiza resultados consistentes y sin sorpresas.",
      steps: [
        {
          label: "Analizamos",
          phase: "01 · Fase 1",
          description: "El sitio actual, entendido a fondo.",
        },
        {
          label: "Diseñamos",
          phase: "02 · Fase 2",
          description: "La nueva interfaz, diseñada y construida.",
        },
        {
          label: "Entregamos",
          phase: "03 · Fase 3",
          description: "Código limpio, listo para evolucionar.",
        },
      ],
      cta: "Ver los 8 pasos en detalle",
      tags: ["Auditoría", "Diseño UI", "Componentes", "Entrega final"],
    },
    deliverablesPreview: {
      eyebrow: "Qué recibes",
      title: "Resultados concretos, sin letra chica",
      description:
        "Un proyecto terminado y listo para evolucionar: desde el primer componente hasta la arquitectura completa.",
      cta: "Ver todo lo que entregamos",
    },
    cta: {
      title: "¿Tienes un sitio que merece más?",
      description:
        "Hablemos de tu proyecto. Te mostramos cómo podemos rediseñarlo sin complicar lo que ya funciona.",
      primary: "Conversemos sobre tu proyecto",
      secondary: "Conocer la metodología",
    },
  },
  methodology: {
    eyebrow: "Metodología",
    title: "Un proceso claro para cada rediseño",
    description:
      "Ocho pasos que llevan cualquier sitio web existente desde su estado actual hasta una experiencia moderna, sin perder el control en ninguna etapa.",
    steps: [
      {
        number: "01",
        title: "Analizar el sitio existente",
        description:
          "Revisamos cada página con ojo crítico: jerarquía, contraste, ritmo y usabilidad. Identificamos qué funciona, qué confunde y qué falta.",
        icon: Search,
      },
      {
        number: "02",
        title: "Comprender la estructura",
        description:
          "Mapeamos componentes, estilos y dependencias para entender cómo está construido el proyecto antes de tocarlo.",
        icon: ScanSearch,
      },
      {
        number: "03",
        title: "Detectar oportunidades de mejora",
        description:
          "Priorizamos los cambios de mayor impacto: accesibilidad, rendimiento, consistencia visual y fricciones de usuario.",
        icon: Target,
      },
      {
        number: "04",
        title: "Diseñar una nueva interfaz",
        description:
          "Traducimos las oportunidades en un diseño moderno, elegante y coherente con la identidad de tu marca.",
        icon: PenTool,
      },
      {
        number: "05",
        title: "Desarrollar componentes reutilizables",
        description:
          "Construimos piezas independientes que se combinan entre sí. Un botón se define una vez y se usa en todo el sitio.",
        icon: ComponentIcon,
      },
      {
        number: "06",
        title: "Optimizar experiencia de usuario",
        description:
          "Pulimos cada interacción: animaciones sutiles, navegación clara y flujos que se sienten naturales.",
        icon: Gauge,
      },
      {
        number: "07",
        title: "Organizar el proyecto",
        description:
          "Estructuramos carpetas y archivos con nombres descriptivos. Cualquier persona entiende el proyecto en minutos.",
        icon: FolderTree,
      },
      {
        number: "08",
        title: "Entregar código limpio",
        description:
          "Entregamos código tipado, documentado y listo para futuras modificaciones, incluso editadas por inteligencia artificial.",
        icon: BadgeCheck,
      },
    ],
  },
  deliverables: {
    eyebrow: "Qué entregamos",
    title: "Todo lo que tu proyecto necesita",
    description:
      "Un entregable completo, no solo un diseño nuevo. Cada pieza está pensada para funcionar bien hoy y seguir evolucionando mañana.",
    items: [
      {
        title: "Diseño Responsive",
        description:
          "Interfaces que se ven y funcionan perfectas en teléfonos, tablets, notebooks y monitores grandes.",
        icon: Smartphone,
        accent: "from-sky-400 to-blue-500",
      },
      {
        title: "Interfaz Moderna",
        description:
          "Estética actual inspirada en las mejores experiencias digitales: limpia, elegante y con carácter propio.",
        icon: Monitor,
        accent: "from-violet-400 to-purple-500",
      },
      {
        title: "Código Limpio",
        description:
          "TypeScript estricto, componentes pequeños y nombres descriptivos. Código que se lee como buena prosa.",
        icon: CodeXml,
        accent: "from-emerald-400 to-teal-500",
        span: "wide",
      },
      {
        title: "Componentes Reutilizables",
        description:
          "Piezas independientes y combinables. Los cambios se aplican una vez y se reflejan en todo el sitio.",
        icon: ComponentIcon,
        accent: "from-amber-400 to-orange-500",
      },
      {
        title: "Arquitectura Escalable",
        description:
          "Una estructura clara que acompaña el crecimiento del proyecto sin transformarse en deuda técnica.",
        icon: Layers,
        accent: "from-rose-400 to-pink-500",
      },
      {
        title: "Proyecto Organizado",
        description:
          "Carpetas y archivos ordenados con criterio. Encontrar algo nunca es una búsqueda, es una certeza.",
        icon: FolderTree,
        accent: "from-cyan-400 to-sky-500",
        span: "wide",
      },
      {
        title: "Fácil Mantenimiento",
        description:
          "Menos fricción a la hora de actualizar contenido, corregir errores o sumar funcionalidades.",
        icon: Wrench,
        accent: "from-lime-400 to-green-500",
      },
      {
        title: "Preparado para IA",
        description:
          "Estructuras y estilos predecibles que permiten a la inteligencia artificial editar el código con seguridad.",
        icon: WandSparkles,
        accent: "from-fuchsia-400 to-pink-500",
      },
    ],
  },
  architecture: {
    eyebrow: "Arquitectura",
    title: "Un proyecto que se entiende a simple vista",
    description:
      "Separación clara de responsabilidades. Cada carpeta tiene un propósito único, y cualquiera —persona o IA— sabe dónde encontrar lo que busca.",
    treeIntro:
      "Estructura estándar de nuestros proyectos, renderizada dentro de tu editor preferido.",
    checklist: [
      "Cada carpeta tiene un propósito único y predecible.",
      "La interfaz, la lógica y los datos nunca se mezclan.",
      "Cualquier desarrollador o IA encuentra lo que busca en segundos.",
    ],
    tree: [
      {
        name: "src",
        kind: "folder",
        children: [
          {
            name: "components",
            kind: "folder",
            children: [
              {
                name: "ui",
                kind: "folder",
                children: [
                  { name: "Card.tsx", kind: "file" },
                  { name: "Button.tsx", kind: "file" },
                ],
              },
              {
                name: "layout",
                kind: "folder",
                children: [
                  { name: "Navbar.tsx", kind: "file" },
                  { name: "Footer.tsx", kind: "file" },
                ],
              },
              {
                name: "home",
                kind: "folder",
                children: [{ name: "Hero.tsx", kind: "file" }],
              },
            ],
          },
          {
            name: "pages",
            kind: "folder",
            children: [
              { name: "HomePage.tsx", kind: "file" },
              { name: "MethodologyPage.tsx", kind: "file" },
              { name: "ContactPage.tsx", kind: "file" },
            ],
          },
          {
            name: "hooks",
            kind: "folder",
            children: [{ name: "useScrollPosition.ts", kind: "file" }],
          },
          {
            name: "types",
            kind: "folder",
            children: [{ name: "index.ts", kind: "file" }],
          },
          {
            name: "data",
            kind: "folder",
            children: [{ name: "content.ts", kind: "file" }],
          },
          {
            name: "assets",
            kind: "folder",
            children: [{ name: "illustrations.tsx", kind: "file" }],
          },
          {
            name: "styles",
            kind: "folder",
            children: [{ name: "index.css", kind: "file" }],
          },
          {
            name: "utils",
            kind: "folder",
            children: [{ name: "cn.ts", kind: "file" }],
          },
          { name: "main.tsx", kind: "file" },
        ],
      },
    ],
    reasons: [
      {
        title: "Mantenimiento simple",
        description:
          "Sabes exactamente qué archivo tocar para cada cambio. Las correcciones se vuelven rápidas y seguras.",
        icon: Wrench,
      },
      {
        title: "Escalabilidad natural",
        description:
          "Sumar una sección o una página nueva no altera lo existente. El proyecto crece sin dolor.",
        icon: Layers,
      },
      {
        title: "Nuevas funcionalidades",
        description:
          "Cada característica nueva encuentra su lugar en minutos, sin mezclarse con el resto del código.",
        icon: PlusSquare,
      },
      {
        title: "Comprensión inmediata",
        description:
          "Un nuevo desarrollador entiende el proyecto en horas, no en semanas. Nada vive en un cajón misterioso.",
        icon: Eye,
      },
      {
        title: "Edición asistida por IA",
        description:
          "Una estructura predecible permite que la IA genere y modifique código con precisión y sin romper nada.",
        icon: WandSparkles,
      },
    ],
  },
  technologies: {
    eyebrow: "Tecnologías",
    title: "Herramientas elegidas por criterio, no por moda",
    description:
      "Cada tecnología cumple un rol específico en el proyecto. Estas son las razones técnicas detrás de cada elección.",
    items: [
      {
        name: "React",
        role: "Interfaz de usuario",
        reason:
          "El estándar de la industria para interfaces declarativas. Un modelo de componentes que hace natural construir piezas reutilizables y mantener proyectos grandes.",
        icon: Atom,
      },
      {
        name: "TypeScript",
        role: "Tipado estático",
        reason:
          "Detecta errores antes de llegar a producción y documenta el código por sí solo. En un proyecto que se mantiene con el tiempo, esta seguridad vale oro.",
        icon: FileCode,
      },
      {
        name: "Tailwind CSS",
        role: "Estilos",
        reason:
          "Diseño consistente sin hojas de estilo dispersas. El mismo lenguaje visual en todo el proyecto, con una curva de aprendizaje baja para quien lo hereda.",
        icon: Wind,
      },
      {
        name: "Vite",
        role: "Herramienta de desarrollo",
        reason:
          "Desarrollo instantáneo con recarga en caliente y builds optimizados. Menos tiempo esperando, más tiempo creando.",
        icon: Zap,
      },
      {
        name: "Framer Motion",
        role: "Animaciones",
        reason:
          "Animaciones suaves y discretas declaradas en el mismo componente. Sin CSS mágico escondido ni librerías pesadas.",
        icon: Activity,
      },
      {
        name: "Lucide",
        role: "Iconografía",
        reason:
          "Iconos consistentes, accesibles y ligeros, que se integran directamente con React. Una sola familia visual sin fricción.",
        icon: Shapes,
      },
    ],
  },
  contact: {
    eyebrow: "Contacto",
    title: "Hablemos de tu proyecto",
    description:
      "Si tienes un sitio que no refleja la calidad de tu trabajo, este es el momento. Cuéntanos tu caso y te proponemos un camino claro.",
    primaryCta: "Enviarnos un mensaje",
    channels: [
      {
        label: "Correo",
        value: "anzorenam133@gmail.com",
        href: "mailto:anzorenam133@gmail.com",
        icon: Mail,
      },
    ],
    availability: {
      title: "Disponibilidad",
      value: "Abiertos a nuevos proyectos",
    },
    nextSteps: [
      {
        step: "01",
        title: "Cuéntanos tu proyecto",
        description:
          "Nos escribes y nos describes tu sitio actual y lo que quieres lograr.",
      },
      {
        step: "02",
        title: "Recibes una propuesta",
        description:
          "Te proponemos un plan claro con alcance, pasos y tiempos.",
      },
      {
        step: "03",
        title: "Comenzamos el rediseño",
        description: "Ponemos la metodología en marcha desde el primer día.",
      },
    ],
  },
  notFound: {
    eyebrow: "Error 404",
    title: "Esta página no existe",
    description:
      "La página que buscas se movió o nunca existió. Volvamos a terreno conocido.",
    cta: "Volver al inicio",
  },
  common: {
    backHome: "Volver al inicio",
    skipLink: "Saltar al contenido",
  },
};
