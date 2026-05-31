import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { SeoLandingPage } from "./pages/SeoLandingPage";
import { DisclaimerPage } from "./pages/DisclaimerPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { TermsPage } from "./pages/TermsPage";

const SEO_ROUTES = [
  { path: "/what-is-this-file", title: "What Is This File?", blurb: "Identify unknown files from magic bytes without uploading the full file." },
  { path: "/mime-detector", title: "MIME Detector", blurb: "Compare claimed MIME types against detected signatures and flag mismatches." },
  { path: "/magic-byte-checker", title: "Magic Byte Checker", blurb: "Inspect the first bytes of any file or pasted hex to see format families." },
  { path: "/office-macro-detect", title: "Office Macro Detect", blurb: "Spot OLE containers and macro indicators before opening documents." },
  { path: "/polyglot-file-check", title: "Polyglot File Check", blurb: "Detect ambiguous files that match more than one format signature." },
];

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        {SEO_ROUTES.map((r) => (
          <Route key={r.path} path={r.path.slice(1)} element={<SeoLandingPage title={r.title} blurb={r.blurb} />} />
        ))}
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="disclaimer" element={<DisclaimerPage />} />
      </Route>
    </Routes>
  );
}
