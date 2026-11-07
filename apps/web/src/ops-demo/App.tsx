import { Navigate, Route, Routes } from "react-router-dom";
import { Chat } from "./pages/chat";
import { Book, Checkout, Profile } from "./pages/guest";
import { Onboarding } from "./pages/onboarding";
import { BotDetail, Bots, Memory, Overview, Settings, Tools, Work } from "./pages/os";
import { Scene } from "./pages/scene";
import { Shell } from "./shell";

export function App() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route path="/studio" element={<Overview />} />
        <Route path="/studio/bots" element={<Bots />} />
        <Route path="/studio/bots/:id" element={<BotDetail />} />
        <Route path="/studio/work" element={<Work />} />
        <Route path="/studio/memory" element={<Memory />} />
        <Route path="/studio/tools" element={<Tools />} />
        <Route path="/studio/settings" element={<Settings />} />
        <Route path="/studio/onboarding" element={<Onboarding />} />
        <Route path="/app" element={<Scene />} />
        <Route path="/app/chat/:id" element={<Chat />} />
      </Route>
      <Route path="/models/:slug" element={<Profile />} />
      <Route path="/models/:slug/book" element={<Book />} />
      <Route path="/models/:slug/checkout" element={<Checkout />} />
      <Route path="*" element={<Navigate to="/studio" replace />} />
    </Routes>
  );
}
