import { Link } from 'react-router-dom';

interface TermsAndPrivacyAgreementProps {
  className?: string;
}

export default function TermsAndPrivacyAgreement({ className }: TermsAndPrivacyAgreementProps) {
  return (
    <p className={`text-xs text-muted-foreground text-center text-balance ${className || ''}`}>
      By continuing, you agree to our{' '}
      <Link
        to="https://app.termly.io/policy-viewer/policy.html?policyUUID=b6563c6b-a3cd-432a-8db4-bb73240dc039"
        className="underline underline-offset-4 hover:text-foreground transition-colors mx-1"
        target="_blank"
      >
        Terms and Conditions
      </Link>{' '}
      and{' '}
      <Link
        to="https://app.termly.io/policy-viewer/policy.html?policyUUID=1e0b6c0f-2e0b-4227-8862-8cbaa85398f7"
        className="underline underline-offset-4 hover:text-foreground transition-colors ml-1"
        target="_blank"
      >
        Privacy Policy
      </Link>
    </p>
  );
}
