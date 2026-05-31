export function TermsPage() {
  return (
    <article className="prose prose-neutral max-w-none text-sm leading-relaxed space-y-4">
      <h1 className="text-2xl font-semibold">Terms &amp; Conditions</h1>
      <p className="text-muted">Last updated: May 31, 2026</p>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Acceptance</h2>
        <p>
          By using FileSniff you agree to these terms. If you do not agree, do not use the service.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Informational tool only</h2>
        <p>
          FileSniff provides heuristic file-type and risk indicators based on magic bytes and metadata. It is not
          antivirus software, legal advice, or a guarantee of safety. You are solely responsible for how you
          handle files, including malware. Analyze suspicious files only in isolated environments you control.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Your responsibilities</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>You must have the right to analyze any file you upload or scan.</li>
          <li>You must not use the service for unlawful purposes or to harm others.</li>
          <li>You must not attempt to disrupt, overload, or reverse-engineer the service beyond normal use.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Disclaimer of warranties</h2>
        <p>
          THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR
          IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. Detection
          may be wrong; do not rely on FileSniff as the sole basis for security decisions.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Limitation of liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE AUTHORS AND CONTRIBUTORS SHALL NOT BE LIABLE FOR ANY
          INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF DATA, PROFITS, OR
          GOODWILL, ARISING FROM YOUR USE OF FILESNIFF, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. OUR
          AGGREGATE LIABILITY SHALL NOT EXCEED ONE HUNDRED U.S. DOLLARS (USD $100) OR THE AMOUNT YOU PAID US IN
          THE PAST TWELVE MONTHS, WHICHEVER IS GREATER.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Open source</h2>
        <p>
          Browser components are offered under the MIT License. The optional worker is under AGPL-3.0. See the
          repository LICENSE files for details.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Changes</h2>
        <p>We may update these terms. Continued use after changes constitutes acceptance.</p>
      </section>
    </article>
  );
}
