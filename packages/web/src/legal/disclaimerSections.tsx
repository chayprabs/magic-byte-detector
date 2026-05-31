import type { LegalSection } from "../components/LegalDocument";
import { site } from "./links";

export const DISCLAIMER_UPDATED = "May 31, 2026";

export const disclaimerSections: LegalSection[] = [
  {
    title: "No professional advice",
    blocks: [
      {
        type: "p",
        text: "FileSniff output is informational only. It is not legal, security, forensic, or compliance advice. Consult qualified professionals before acting on results.",
      },
    ],
  },
  {
    title: "No guarantee of accuracy",
    blocks: [
      {
        type: "p",
        text: "Magic-byte detection can be wrong. Files may be misidentified, especially polyglots, truncated files, or deliberately crafted samples. Verify results independently.",
      },
    ],
  },
  {
    title: "Malware and dangerous content",
    blocks: [
      {
        type: "p",
        text: "Analyzing malware may be illegal in some contexts or may harm your systems. You assume all risk from opening, executing, or hosting files. Use isolated environments.",
      },
    ],
  },
  {
    title: "No warranty (software)",
    blocks: [
      {
        type: "p",
        text: 'Software is provided AS IS under the MIT License (core/web) and AGPL-3.0 (worker). See the repository LICENSE files and NOTICE.',
      },
    ],
  },
  {
    title: "Hosted service",
    blocks: [
      {
        type: "p",
        text: (
          <>
            Use of the public website is governed by {site("/terms", "Terms & Conditions")} and{" "}
            {site("/privacy", "Privacy Policy")}, which limit liability and require indemnification to the fullest extent
            permitted by law.
          </>
        ),
      },
    ],
  },
  {
    title: "Not an offer",
    blocks: [
      {
        type: "p",
        text: "Nothing on this site creates a partnership, agency, or employment relationship.",
      },
    ],
  },
  {
    title: "Jurisdiction",
    blocks: [
      {
        type: "p",
        text: "Operators and users are responsible for compliance with laws in all applicable countries. These documents are drafted for global access but enforceability varies; some countries may not allow certain limitations.",
      },
      {
        type: "p",
        text: (
          <>
            <strong>If you need enforceable protection in your home jurisdiction, consult a licensed attorney.</strong>{" "}
            No document can guarantee that you will never face legal claims anywhere in the world.
          </>
        ),
      },
    ],
  },
];
