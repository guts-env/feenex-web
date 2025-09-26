import { HelpCircleIcon } from 'lucide-react';
import SupportForm from '@/pages/Support/SupportForm';

export default function Support() {
  return (
    <div className="container mx-auto md:pt-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2 flex items-baseline gap-2">
            <HelpCircleIcon className="size-5" /> Contact Support
          </h1>
          <p className="text-muted-foreground">
            Need help? Send us a message and we'll get back to you as soon as possible.
          </p>
        </div>
        <SupportForm />
      </div>
    </div>
  );
}
