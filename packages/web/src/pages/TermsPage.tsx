import { LegalDocument } from "../components/LegalDocument";
import { TERMS_UPDATED, termsSections } from "../legal/termsSections";

export function TermsPage() {
  return (
    <LegalDocument
      title="Terms & Conditions"
      updated={TERMS_UPDATED}
      intro={
        <>
          This document governs your use of the hosted website and optional API worker. Use of the open-source code is
          additionally subject to the LICENSE files in the repository. This is not legal advice; have a qualified
          lawyer review these terms for your situation.
        </>
      }
      sections={termsSections}
    />
  );
}
