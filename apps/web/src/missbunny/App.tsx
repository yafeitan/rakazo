import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { LangProvider } from "./locale";
import { BookPage } from "./pages/book";
import { BrowsePage } from "./pages/browse";
import { DashboardPage } from "./pages/dashboard";
import { EnginePage } from "./pages/engine";
import { HomePage } from "./pages/home";
import { DemoPage } from "./pages/landing";
import { OpsPage } from "./pages/ops";
import { OrderPage, OrdersPage } from "./pages/orders";
import { ProfilePage } from "./pages/profile";
import { StudioPage } from "./pages/studio";
import { Shell } from "./shell";

export function App() {
  return (
    <LangProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route element={<DemoShell />}>
          <Route path="/demo" element={<DemoPage />} />
          <Route path="/models" element={<BrowsePage />} />
          <Route path="/models/:slug" element={<ProfilePage />} />
          <Route path="/models/:slug/book" element={<BookPage />} />
          <Route path="/bookings" element={<OrdersPage />} />
          <Route path="/bookings/:id" element={<OrderPage />} />
          <Route path="/studio" element={<StudioPage />} />
          <Route path="/studio/engine" element={<EnginePage />} />
          <Route path="/studio/ops" element={<OpsPage />} />
          <Route path="/studio/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </LangProvider>
  );
}

function DemoShell() {
  return (
    <Shell>
      <Outlet />
    </Shell>
  );
}
