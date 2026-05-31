import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white mt-auto">
      <p className="max-w-5xl mx-auto px-4 pt-4 text-center text-xs text-muted">
        By using FileSniff you agree to our{" "}
        <Link to="/terms" className="underline underline-offset-2 hover:text-ink">
          Terms
        </Link>{" "}
        and{" "}
        <Link to="/privacy" className="underline underline-offset-2 hover:text-ink">
          Privacy Policy
        </Link>
        .
      </p>
      <nav
        aria-label="Legal"
        className="max-w-5xl mx-auto px-4 py-4 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-muted"
      >
        <Link to="/privacy" className="hover:text-ink underline-offset-2 hover:underline">
          Privacy Policy
        </Link>
        <Link to="/terms" className="hover:text-ink underline-offset-2 hover:underline">
          Terms &amp; Conditions
        </Link>
        <Link to="/disclaimer" className="hover:text-ink underline-offset-2 hover:underline">
          Disclaimer
        </Link>
      </nav>
    </footer>
  );
}
