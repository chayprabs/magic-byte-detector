import type { LegalSection } from "../components/LegalDocument";
import { ghIssues, ghRepo } from "./links";

export const PRIVACY_UPDATED = "May 31, 2026";

export const privacySections: LegalSection[] = [
  {
    title: "Summary",
    blocks: [
      {
        type: "table",
        headers: ["Mode", "What leaves your device"],
        rows: [
          ["100% in-browser (default)", "Nothing from file contents; only normal website delivery (see Hosting logs)"],
          ["Full scan / URL / batch", "File or URL content is sent to the worker you use (ours or yours)"],
        ],
      },
      {
        type: "p",
        text: "We do not sell file contents. We do not use uploads for advertising profiles or AI training.",
      },
    ],
  },
  {
    title: "Who we are (data controller)",
    blocks: [
      {
        type: "p",
        text: (
          <>
            For the hosted Service operated by Chaitanya Prabuddha, the data controller is{" "}
            <strong>Chaitanya Prabuddha</strong>. Contact via {ghIssues()} on the project repository.
          </>
        ),
      },
    ],
  },
  {
    title: "What we collect",
    blocks: [
      {
        type: "p",
        text: (
          <>
            <strong>Information you provide:</strong> files or archives when you use server-side features; URLs in
            URL-scan mode. Hex/base64 pasted in-browser stays on your device unless you use server features. We do
            not require an account, email, or name.
          </>
        ),
      },
      {
        type: "p",
        text: (
          <>
            <strong>Information collected automatically:</strong> when you load the Site, infrastructure may log IP
            address, browser/user agent, referrer, timestamps, request paths, and TLS/CDN metadata. We aim not to
            use third-party advertising trackers or social pixels on the playground.
          </>
        ),
      },
      {
        type: "p",
        text: (
          <>
            <strong>Information we derive:</strong> detection results (format, MIME, hashes, flags) when you use our
            worker; SHA-256 and optionally ssdeep on worker paths; operational logs without intentionally storing
            full file contents after processing.
          </>
        ),
      },
    ],
  },
  {
    title: "How we use information",
    blocks: [
      {
        type: "p",
        text: "We process data only to run the analysis you requested; operate, secure, and debug the Service; and comply with law or enforce our Terms.",
      },
      {
        type: "p",
        text: (
          <>
            <strong>Legal bases (EEA/UK GDPR-style):</strong> contract (providing the Service you asked for),
            legitimate interests (security, abuse prevention), and legal obligation where applicable. We do not use
            your files for marketing, sale, or model training.
          </>
        ),
      },
    ],
  },
  {
    title: "Retention",
    blocks: [
      {
        type: "table",
        headers: ["Data", "Retention"],
        rows: [
          [
            "Uploaded files (worker)",
            "Ephemeral — processed in memory/temp storage and deleted promptly (target: within 5 minutes unless a technical failure delays deletion)",
          ],
          ["Server logs", "Short operational retention; no intentional long-term storage of file bodies"],
          ["Local browser", "Under your control; clear site data in your browser"],
        ],
      },
    ],
  },
  {
    title: "Sharing and subprocessors",
    blocks: [
      {
        type: "p",
        text: "We do not sell personal information. We may share limited data with hosting/CDN providers strictly to deliver the Service, or with law enforcement if required by valid legal process and only to the extent compelled.",
      },
      {
        type: "p",
        text: "Categories: infrastructure hosting, DNS/TLS, GitHub (for source and issues if you contact us there).",
      },
    ],
  },
  {
    title: "International transfers",
    blocks: [
      {
        type: "p",
        text: "If you access the Service from outside India, your data may be processed in India and wherever our hosts operate. We rely on appropriate safeguards where required (e.g., standard contractual clauses or equivalent mechanisms when applicable).",
      },
    ],
  },
  {
    title: "Security",
    blocks: [
      {
        type: "p",
        text: "We use reasonable technical measures (HTTPS, ephemeral processing, access limits). No method is 100% secure. You use the Service at your own risk, especially when uploading sensitive or malicious files.",
      },
    ],
  },
  {
    title: "Your rights",
    blocks: [
      {
        type: "p",
        text: "Depending on where you live, you may have rights to access, correct, delete, restrict, object, or port personal data, and to withdraw consent where processing is consent-based.",
      },
      {
        type: "ul",
        items: [
          "In-browser mode: we often have nothing to retrieve about your file contents.",
          "Worker mode: contact us promptly; ephemeral deletion may mean data is already gone.",
          "California (CCPA/CPRA): we do not sell personal information; residents may request disclosure/deletion via GitHub.",
          "EU/UK: you may lodge a complaint with your local supervisory authority.",
        ],
      },
      {
        type: "p",
        text: "We will respond to verifiable requests within timelines required by law (e.g., 30–45 days where applicable).",
      },
    ],
  },
  {
    title: "Children",
    blocks: [
      {
        type: "p",
        text: "The Service is not for users under 18. We do not knowingly collect children's data.",
      },
    ],
  },
  {
    title: "Do not upload special categories",
    blocks: [
      {
        type: "p",
        text: "Do not upload files whose contents include highly sensitive personal data (health, biometrics, government IDs, etc.) unless you have a lawful basis and accept the risk. The Tool is not designed for regulated data processing on your behalf.",
      },
    ],
  },
  {
    title: "Changes",
    blocks: [
      {
        type: "p",
        text: 'We may update this policy. Check the "Last updated" date. Continued use means you accept the updated policy.',
      },
    ],
  },
  {
    title: "Contact",
    blocks: [
      {
        type: "p",
        text: <>Questions: {ghRepo()}.</>,
      },
    ],
  },
];
