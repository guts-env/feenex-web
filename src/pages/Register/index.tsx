import RegistrationForm from '@/pages/Register/RegistrationForm';
import AuthImagePanel from '@/components/features/AuthImagePanel';
import TermsAndPrivacyAgreement from '@/components/ui/terms-and-privacy-agreement';

export default function Register() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 relative">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            <RegistrationForm />
          </div>
        </div>
        <TermsAndPrivacyAgreement className="absolute bottom-8 left-6 right-6 lg:left-10 lg:right-auto lg:w-[calc(50%-5rem)]" />
      </div>
      <AuthImagePanel />
    </div>
  );
}
