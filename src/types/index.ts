import type { LucideIcon } from "lucide-react";

export type RoutePath =
  | "/"
  | "/metodologia"
  | "/que-entrego"
  | "/arquitectura"
  | "/tecnologias"
  | "/nosotros"
  | "/participar"
  | "/sumate";

export interface NavItem {
  to: RoutePath;
  label: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo?: string;
  photoAlt?: string;
  filled: boolean;
}

export interface HeroContent {
  badge: string;
  titleA: string;
  titleAccent: string;
  titleB: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
  visualCaption: string;
}

export interface Step {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface Deliverable {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  span?: "default" | "wide" | "tall";
}

export interface FolderNode {
  name: string;
  kind: "folder" | "file";
  description?: string;
  children?: FolderNode[];
}

export interface ArchitectureReason {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface Technology {
  name: string;
  role: string;
  reason: string;
  icon: LucideIcon;
}

export interface FooterLink {
  label: string;
  href: string;
}
