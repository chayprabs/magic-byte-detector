import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-6 flex justify-center gap-8 text-sm text-muted">
        <Link to="/privacy" className="hover:text-ink underline-offset-2 hover:underline">
          Privacy Policy
        </Link>
        <Link to="/terms" className="hover:text-ink underline-offset-2 hover:underline">
          Terms &amp; Conditions
        </Link>
      </div>
    </footer>
  );
}
