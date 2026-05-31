export function PrivacyPage() {
  return (
    <article className="prose prose-neutral max-w-none text-sm leading-relaxed space-y-4">
      <h1 className="text-2xl font-semibold">Privacy Policy</h1>
      <p className="text-muted">Last updated: May 31, 2026</p>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Summary</h2>
        <p>
          FileSniff (&quot;we&quot;, &quot;the tool&quot;) helps you identify file types from magic bytes. By default,
          analysis runs entirely in your browser on the first 4 KB of a file. No file content is sent to our
          servers unless you explicitly disable privacy mode or use URL / full-scan features that require the
          optional backend worker.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Local (in-browser) mode</h2>
        <p>
          When &quot;100% in-browser&quot; is enabled, bytes never leave your device. We do not collect filenames or
          file contents in this mode. Standard web server or CDN logs (IP address, user agent) may still apply
          when you load the static site.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Worker / full-scan mode</h2>
        <p>
          If you upload a file or submit a URL for server-side scanning, the file is processed in ephemeral
          storage on the worker, deleted after processing (typically within minutes), and is not used for
          training, advertising profiling, or resale. Hashes and detection metadata may be logged without file
          contents.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">What we do not do</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>No third-party advertising or tracking pixels on the playground.</li>
          <li>No sale of uploaded files or sniff results.</li>
          <li>No antivirus claims; results are informational only.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Contact</h2>
        <p>
          Questions: open an issue at{" "}
          <a href="https://github.com/chayprabs/magic-byte-detector" className="text-accent underline">
            github.com/chayprabs/magic-byte-detector
          </a>
          .
        </p>
      </section>
    </article>
  );
}
