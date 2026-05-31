import { LegalDocument } from "../components/LegalDocument";
import { DISCLAIMER_UPDATED, disclaimerSections } from "../legal/disclaimerSections";

export function DisclaimerPage() {
  return (
    <LegalDocument
      title="Legal Disclaimer"
      updated={DISCLAIMER_UPDATED}
      sections={disclaimerSections}
    />
  );
}
