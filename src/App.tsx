import { MotionConfig } from "framer-motion";
import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { Layout } from "./components/layout/Layout";

const HomePage = lazy(() =>
  import("./pages/HomePage").then((m) => ({ default: m.HomePage })),
);
const MethodologyPage = lazy(() =>
  import("./pages/MethodologyPage").then((m) => ({
    default: m.MethodologyPage,
  })),
);
const DeliverablesPage = lazy(() =>
  import("./pages/DeliverablesPage").then((m) => ({
    default: m.DeliverablesPage,
  })),
);
const ArchitecturePage = lazy(() =>
  import("./pages/ArchitecturePage").then((m) => ({
    default: m.ArchitecturePage,
  })),
);
const TechnologiesPage = lazy(() =>
  import("./pages/TechnologiesPage").then((m) => ({
    default: m.TechnologiesPage,
  })),
);
const TeamPage = lazy(() =>
  import("./pages/TeamPage").then((m) => ({ default: m.TeamPage })),
);
const ParticipatePage = lazy(() =>
  import("./pages/ParticipatePage").then((m) => ({
    default: m.ParticipatePage,
  })),
);
const ContactPage = lazy(() =>
  import("./pages/ContactPage").then((m) => ({ default: m.ContactPage })),
);
const SumatePage = lazy(() =>
  import("./pages/SumatePage").then((m) => ({ default: m.SumatePage })),
);
const ModificarPage = lazy(() =>
  import("./pages/ModificarPage").then((m) => ({ default: m.ModificarPage })),
);
const PanelPage = lazy(() =>
  import("./pages/PanelPage").then((m) => ({ default: m.PanelPage })),
);
const NotFoundPage = lazy(() =>
  import("./pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })),
);

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/metodologia", element: <MethodologyPage /> },
      { path: "/que-entrego", element: <DeliverablesPage /> },
      { path: "/arquitectura", element: <ArchitecturePage /> },
      { path: "/tecnologias", element: <TechnologiesPage /> },
      { path: "/nosotros", element: <TeamPage /> },
      { path: "/participar", element: <ParticipatePage /> },
      { path: "/sumate", element: <SumatePage /> },
      { path: "/modificar", element: <ModificarPage /> },
      { path: "/panel", element: <PanelPage /> },
      { path: "/contacto", element: <ContactPage /> },
      { path: "/sobre-mi", element: <Navigate to="/nosotros" replace /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Suspense
        fallback={
          <div className="grid min-h-screen place-items-center bg-base">
            <span className="size-8 animate-spin rounded-full border-2 border-line border-t-accent-500" />
          </div>
        }
      >
        <RouterProvider router={router} />
      </Suspense>
    </MotionConfig>
  );
}

export default App;
