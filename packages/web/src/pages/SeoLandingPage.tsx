import { SniffWorkspace } from "../components/SniffWorkspace";

interface Props {
  title: string;
  blurb: string;
}

export function SeoLandingPage({ title, blurb }: Props) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-ink text-center">{title}</h1>
      <p className="text-center text-sm text-muted max-w-2xl mx-auto">{blurb}</p>
      <SniffWorkspace />
    </div>
  );
}
