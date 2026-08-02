import { Outlet } from "react-router-dom";
import { content } from "../../data/content";
import { useScrollToTop } from "../../hooks/useScrollToTop";
import { InfinityBackground } from "../ui/InfinityBackground";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

export function Layout() {
  useScrollToTop();

  return (
    <div className="flex min-h-screen flex-col">
      <InfinityBackground />
      <a
        href="#main-content"
        className="focus-ring sr-only z-[60] rounded-lg bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-900 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {content.common.skipLink}
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
