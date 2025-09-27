import RegistrationForm from '@/pages/Register/RegistrationForm';
import AuthImagePanel from '@/components/features/AuthImagePanel';
import TermsAndPrivacyAgreement from '@/components/ui/terms-and-privacy-agreement';

export default function Register() {
  return (
    <div className="grid h-dvh lg:grid-cols-2 relative">
      <div className="flex flex-col p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center min-h-0">
          <div className="w-full max-w-md">
            <RegistrationForm />
          </div>
        </div>
        <TermsAndPrivacyAgreement className="mt-6 pb-safe lg:absolute lg:bottom-8 lg:left-10 lg:right-auto lg:w-[calc(50%-5rem)] lg:mt-0 lg:pb-0" />
      </div>
      <AuthImagePanel />
    </div>
  );
}
