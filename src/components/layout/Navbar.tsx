import { AnimatePresence, motion } from "framer-motion";
import { Infinity as InfinityIcon, Menu, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { content } from "../../data/content";
import { useScrollY } from "../../hooks/useScrollY";
import { cn } from "../../utils/cn";
import { Container } from "../ui/Container";
import { Logo } from "../ui/Logo";

interface NavbarProps {
  backgroundVisible: boolean;
  onToggleBackground: () => void;
}

export function Navbar({
  backgroundVisible,
  onToggleBackground,
}: NavbarProps) {
  const [open, setOpen] = useState(false);
  const scrollY = useScrollY();

  const closeMenu = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, closeMenu]);

  const handleNavigate = () => {
    closeMenu();
  };

  const scrolled = scrollY > 8;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled
          ? "border-b border-line bg-base/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container>
        <nav
          aria-label="Navegación principal"
          className="flex h-16 items-center justify-between gap-4"
        >
          <Link
            to="/"
            className="focus-ring flex items-center gap-2.5 rounded-lg"
            aria-label={`${content.brand.name} — Inicio`}
          >
            <Logo />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {content.nav.items.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    cn(
                      "focus-ring rounded-full px-3.5 py-2 text-sm font-medium transition-colors duration-200",
                      isActive
                        ? "text-zinc-50"
                        : "text-muted hover:text-zinc-100",
                    )
                  }
                >
                  {({ isActive }) => (
                    <span className="relative">
                      {item.label}
                      {isActive ? (
                        <motion.span
                          layoutId="nav-dot"
                          aria-hidden
                          className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent-500"
                        />
                      ) : null}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleBackground}
              aria-pressed={backgroundVisible}
              aria-label={
                backgroundVisible ? "Ocultar fondo animado" : "Mostrar fondo animado"
              }
              title={
                backgroundVisible ? "Ocultar fondo animado" : "Mostrar fondo animado"
              }
              className="focus-ring grid size-10 place-items-center rounded-lg text-zinc-200 transition-colors hover:bg-surface"
            >
              <InfinityIcon
                className={cn(
                  "size-5 transition-opacity",
                  !backgroundVisible && "opacity-40",
                )}
              />
            </button>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              className="focus-ring grid size-10 place-items-center rounded-lg text-zinc-200 transition-colors hover:bg-surface lg:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>
      </Container>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-b border-line bg-base/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="space-y-1 px-5 py-4">
              {content.nav.items.map((item, index) => (
                <motion.li
                  key={item.to}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index, duration: 0.2 }}
                >
                  <NavLink
                    to={item.to}
                    end={item.to === "/"}
                    onClick={handleNavigate}
                    className={({ isActive }) =>
                      cn(
                        "focus-ring block rounded-xl px-4 py-3 text-base font-medium transition-colors",
                        isActive
                          ? "bg-surface text-zinc-50"
                          : "text-muted hover:bg-surface/60 hover:text-zinc-100",
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
