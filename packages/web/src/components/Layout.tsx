import { Outlet } from "react-router-dom";
import { TopBar } from "./TopBar";
import { SeoBar } from "./SeoBar";
import { Footer } from "./Footer";

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa]">
      <TopBar />
      <SeoBar />
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
