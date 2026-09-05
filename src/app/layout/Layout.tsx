import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { content } from "@shared/data/content";
import { useScrollToTop } from "@shared/hooks/useScrollToTop";
import { InfinityBackground } from "@shared/ui/InfinityBackground";
import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

const BACKGROUND_KEY = "binfinito-background-visible";

function readBackgroundPreference() {
  try {
    return window.localStorage.getItem(BACKGROUND_KEY) !== "0";
  } catch {
    return true;
  }
}

export function Layout() {
  useScrollToTop();

  const [backgroundVisible, setBackgroundVisible] = useState(
    readBackgroundPreference,
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(
        BACKGROUND_KEY,
        backgroundVisible ? "1" : "0",
      );
    } catch {
      return;
    }
  }, [backgroundVisible]);

  return (
    <div className="flex min-h-screen flex-col">
      {backgroundVisible ? <InfinityBackground /> : null}
      <a
        href="#main-content"
        className="focus-ring sr-only z-[60] rounded-lg bg-zinc-50 px-4 py-2 text-sm font-medium text-zinc-900 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {content.common.skipLink}
      </a>
      <Navbar
        backgroundVisible={backgroundVisible}
        onToggleBackground={() => setBackgroundVisible((v) => !v)}
      />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
