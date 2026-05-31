import { Github, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const GITHUB = "https://github.com/chayprabs/magic-byte-detector";
const TWITTER = "https://x.com/chayprabs";
const WEBSITE = "https://www.chaitanyaprabuddha.com";

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function TopBar() {
  return (
    <header className="border-b border-neutral-200 bg-white/90 backdrop-blur sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to="/" className="text-lg font-semibold tracking-tight text-ink hover:text-accent transition-colors">
          FileSniff
        </Link>
        <nav className="flex items-center gap-4" aria-label="External links">
          <a
            href={GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-ink transition-colors p-1"
            title="GitHub repository"
          >
            <Github className="w-5 h-5" />
            <span className="sr-only">GitHub</span>
          </a>
          <a
            href={TWITTER}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-ink transition-colors p-1"
            title="Twitter / X"
          >
            <XIcon className="w-5 h-5" />
            <span className="sr-only">Twitter</span>
          </a>
          <a
            href={WEBSITE}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-ink transition-colors p-1"
            title="Personal website"
          >
            <Globe className="w-5 h-5" />
            <span className="sr-only">Website</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
