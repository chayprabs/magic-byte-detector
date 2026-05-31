const REPO = "https://github.com/chayprabs/magic-byte-detector";

export function ghIssues() {
  return (
    <a href={`${REPO}/issues`} className="text-accent underline">
      GitHub issues
    </a>
  );
}

export function ghRepo() {
  return (
    <a href={REPO} className="text-accent underline">
      github.com/chayprabs/magic-byte-detector
    </a>
  );
}

export function site(path: string, label: string) {
  return (
    <a href={path} className="text-accent underline">
      {label}
    </a>
  );
}
