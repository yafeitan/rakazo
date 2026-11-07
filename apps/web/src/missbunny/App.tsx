import { Navigate, Route, Routes } from "react-router-dom";
import { BookPage } from "./pages/book";
import { BrowsePage } from "./pages/browse";
import { DashboardPage } from "./pages/dashboard";
import { EnginePage } from "./pages/engine";
import { DemoPage } from "./pages/landing";
import { OrderPage, OrdersPage } from "./pages/orders";
import { ProfilePage } from "./pages/profile";
import { StudioPage } from "./pages/studio";
import { Shell } from "./shell";

export function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Navigate to="/demo" replace />} />
        <Route path="/demo" element={<DemoPage />} />
        <Route path="/models" element={<BrowsePage />} />
        <Route path="/models/:slug" element={<ProfilePage />} />
        <Route path="/models/:slug/book" element={<BookPage />} />
        <Route path="/bookings" element={<OrdersPage />} />
        <Route path="/bookings/:id" element={<OrderPage />} />
        <Route path="/studio" element={<StudioPage />} />
        <Route path="/studio/engine" element={<EnginePage />} />
        <Route path="/studio/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/demo" replace />} />
      </Routes>
    </Shell>
  );
}
