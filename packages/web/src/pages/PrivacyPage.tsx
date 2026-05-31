import { LegalDocument } from "../components/LegalDocument";
import { PRIVACY_UPDATED, privacySections } from "../legal/privacySections";

export function PrivacyPage() {
  return (
    <LegalDocument
      title="Privacy Policy"
      updated={PRIVACY_UPDATED}
      intro={
        <>
          This policy describes how the hosted FileSniff / magic-byte-detector Service handles information.
          Self-hosted deployments are controlled by their operators, not by us.
        </>
      }
      sections={privacySections}
    />
  );
}
