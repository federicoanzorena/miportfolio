import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../utils/cn";

type Variant = "primary" | "secondary";

interface BaseProps {
  children: ReactNode;
  variant?: Variant;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  className?: string;
  "aria-label"?: string;
}

type ButtonAsLink = BaseProps & { to: string };
type ButtonAsAnchor = BaseProps & { href: string };
type ButtonAsButton = BaseProps & { type?: "button" | "submit" };

export type AnimatedButtonProps =
  ButtonAsLink | ButtonAsAnchor | ButtonAsButton;

const baseStyles =
  "group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors duration-300 focus-ring";

const variants: Record<Variant, string> = {
  primary:
    "bg-zinc-50 text-zinc-900 hover:bg-white shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_8px_24px_-8px_rgba(129,140,248,0.5)]",
  secondary:
    "border border-line bg-surface text-zinc-100 hover:border-zinc-600 hover:bg-surface-2",
};

function Inner({ icon: Icon, iconPosition, children }: BaseProps) {
  return (
    <>
      {Icon && iconPosition === "left" ? (
        <Icon
          aria-hidden
          className="size-4 shrink-0 transition-transform duration-300 group-hover:-translate-x-0.5"
        />
      ) : null}
      {children}
      {Icon && iconPosition !== "left" ? (
        <Icon
          aria-hidden
          className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
        />
      ) : null}
    </>
  );
}

export function AnimatedButton(props: AnimatedButtonProps) {
  const {
    variant = "primary",
    icon,
    iconPosition = "right",
    className,
    children,
  } = props;

  const classes = cn(baseStyles, variants[variant], className);

  if ("to" in props) {
    return (
      <motion.span
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="inline-block"
      >
        <Link
          to={props.to}
          className={classes}
          aria-label={props["aria-label"]}
        >
          <Inner icon={icon} iconPosition={iconPosition}>
            {children}
          </Inner>
        </Link>
      </motion.span>
    );
  }

  if ("href" in props) {
    return (
      <motion.span
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="inline-block"
      >
        <a
          href={props.href}
          className={classes}
          aria-label={props["aria-label"]}
        >
          <Inner icon={icon} iconPosition={iconPosition}>
            {children}
          </Inner>
        </a>
      </motion.span>
    );
  }

  return (
    <motion.button
      type={props.type ?? "button"}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={classes}
      aria-label={props["aria-label"]}
    >
      <Inner icon={icon} iconPosition={iconPosition}>
        {children}
      </Inner>
    </motion.button>
  );
}
