import type { LegalSection } from "../components/LegalDocument";
import { ghRepo, site } from "./links";

export const TERMS_UPDATED = "May 31, 2026";

export const termsSections: LegalSection[] = [
  {
    title: "Agreement to terms",
    blocks: [
      {
        type: "p",
        text: (
          <>
            By accessing or using the Service—including loading the page, uploading a file, pasting bytes, using URL
            scan, batch scan, or self-hosting a fork—you agree to these Terms and our{" "}
            {site("/privacy", "Privacy Policy")}. If you do not agree, do not use the Service. If you use the Service on
            behalf of an organization, you represent that you have authority to bind that organization.
          </>
        ),
      },
    ],
  },
  {
    title: "Eligibility",
    blocks: [
      {
        type: "p",
        text: "You must be at least 18 years old (or the age of majority where you live, whichever is higher). The Service is not directed to children.",
      },
    ],
  },
  {
    title: "What the Service is (and is not)",
    blocks: [
      {
        type: "ul",
        items: [
          "FileSniff provides heuristic, informational file-type identification from magic bytes and related metadata.",
          "It is not antivirus, anti-malware, forensics-as-a-service, or legal advice.",
          "It does not guarantee accuracy, completeness, or safety of any file.",
          "It may produce false positives or false negatives.",
          "It must not be your sole basis for security, legal, compliance, or business decisions.",
        ],
      },
      {
        type: "p",
        text: "You are solely responsible for files you analyze, how you store them, and any harm arising from opening, executing, or distributing them.",
      },
    ],
  },
  {
    title: "Your responsibilities",
    blocks: [
      {
        type: "ul",
        items: [
          "Only analyze files you have the legal right to possess and analyze.",
          "Do not upload malware for distribution, or use the Service to attack, harass, or harm others.",
          "Do not violate applicable law (export control, privacy, computer misuse, or IP laws).",
          "Do not abuse the Service (automated scraping, denial-of-service, circumventing limits, probing internal systems).",
          "Do not present the Service's output as a professional certification without independent verification.",
          "Use appropriate isolation (VM, sandbox) when handling untrusted or malicious samples.",
        ],
      },
      {
        type: "p",
        text: "You are responsible for compliance with laws in your jurisdiction and any jurisdiction where you process data.",
      },
    ],
  },
  {
    title: "Privacy mode vs server processing",
    blocks: [
      {
        type: "ul",
        items: [
          "In-browser (default): processing occurs locally; we do not receive file contents.",
          "Server / URL / full scan / batch: you explicitly choose to send data to infrastructure we operate or you self-host. You bear all risk of that choice.",
        ],
      },
      {
        type: "p",
        text: <>See the {site("/privacy", "Privacy Policy")} for details.</>,
      },
    ],
  },
  {
    title: "Intellectual property",
    blocks: [
      {
        type: "p",
        text: "The Service, branding, and documentation are owned by the Operator or licensors. Open-source components are licensed under their respective licenses (MIT for core/web; AGPL-3.0 for the optional worker).",
      },
      {
        type: "p",
        text: "You retain ownership of files you submit. You grant us a limited, non-exclusive license to process submissions only as needed to operate the Service you requested, then delete ephemeral copies per our retention policy.",
      },
    ],
  },
  {
    title: "Disclaimer of warranties",
    blocks: [
      {
        type: "p",
        text: (
          <>
            TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, THE SERVICE AND ALL OUTPUT ARE PROVIDED &quot;AS IS&quot;
            AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR
            OTHERWISE, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, ACCURACY,
            RELIABILITY, AVAILABILITY, FREEDOM FROM VIRUSES OR MALWARE, AND UNINTERRUPTED OR ERROR-FREE OPERATION. Some
            jurisdictions do not allow exclusion of implied warranties; in those cases, exclusions apply to the maximum
            extent permitted.
          </>
        ),
      },
    ],
  },
  {
    title: "Limitation of liability",
    blocks: [
      {
        type: "ul",
        items: [
          "NO INDIRECT DAMAGES. The Operator, affiliates, contributors, and suppliers shall not be liable for any indirect, incidental, special, consequential, exemplary, or punitive damages, or for loss of profits, revenue, data, goodwill, business interruption, security incidents, or replacement costs—even if advised of the possibility.",
          "CAP ON DIRECT DAMAGES. Total aggregate liability for all claims arising from or related to the Service shall not exceed the greater of (a) USD $100 or (b) amounts you paid us for the Service in the 12 months before the claim (typically $0 for free use).",
          "FREE SERVICE. You acknowledge the Service is provided free of charge and that these limitations are a fundamental basis of the bargain.",
          "MANDATORY RIGHTS. Nothing limits liability where law prohibits such limitation (e.g., fraud, wilful misconduct, death or personal injury caused by negligence in some jurisdictions). In those cases, liability is limited to the minimum permitted by law.",
        ],
      },
    ],
  },
  {
    title: "Indemnification",
    blocks: [
      {
        type: "p",
        text: "You agree to defend, indemnify, and hold harmless the Operator, contributors, and service providers from any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or related to your use or misuse of the Service; files, URLs, or data you submit; your violation of these Terms or applicable law; your violation of third-party rights; or reliance on or dissemination of sniff results. We may assume exclusive defense of any matter subject to indemnification; you will cooperate.",
      },
    ],
  },
  {
    title: "Third-party services and links",
    blocks: [
      {
        type: "p",
        text: "The Service may reference third-party tools, hosts (e.g., GitHub, cloud providers), or external sites. We are not responsible for third-party content, availability, or practices.",
      },
    ],
  },
  {
    title: "Self-hosting and AGPL worker",
    blocks: [
      {
        type: "p",
        text: "If you deploy the worker or Site yourself, you are responsible for your deployment's legal compliance, security, logging, and user terms. The AGPL-3.0 license may require you to offer source to users who interact with your modified worker over a network.",
      },
    ],
  },
  {
    title: "Suspension and termination",
    blocks: [
      {
        type: "p",
        text: "We may suspend or discontinue the Service, or block abusive use, at any time, with or without notice. Sections that by nature should survive (disclaimers, liability limits, indemnity, governing law) survive termination.",
      },
    ],
  },
  {
    title: "Changes",
    blocks: [
      {
        type: "p",
        text: 'We may update these Terms. The "Last updated" date will change. Continued use after changes constitutes acceptance. If you disagree, stop using the Service.',
      },
    ],
  },
  {
    title: "Governing law and disputes",
    blocks: [
      {
        type: "ul",
        items: [
          "Governing law: laws of India, excluding conflict-of-law rules that would apply another jurisdiction's law.",
          "Courts: exclusive jurisdiction of courts in Karnataka, India, unless mandatory consumer law in your country requires otherwise.",
          "Informal resolution: before filing suit, contact us via GitHub issues to attempt good-faith resolution for 30 days.",
          "Time limit: any claim must be brought within one (1) year after it arose, or it is permanently barred, to the extent permitted by law.",
          "Class actions: where enforceable, disputes are brought only in your individual capacity, not as a class or representative action.",
        ],
      },
    ],
  },
  {
    title: "Export and sanctions",
    blocks: [
      {
        type: "p",
        text: "You represent you are not located in, under control of, or a national of any country or person subject to comprehensive embargoes or sanctions, and you will not use the Service in violation of export control laws.",
      },
    ],
  },
  {
    title: "Severability and entire agreement",
    blocks: [
      {
        type: "p",
        text: "If any provision is held invalid, the remainder stays in effect. These Terms and the Privacy Policy are the entire agreement regarding the hosted Service.",
      },
    ],
  },
  {
    title: "Contact",
    blocks: [
      {
        type: "p",
        text: (
          <>
            Questions: {ghRepo()}. Website:{" "}
            <a href="https://www.chaitanyaprabuddha.com" className="text-accent underline">
              www.chaitanyaprabuddha.com
            </a>
            .
          </>
        ),
      },
    ],
  },
];
