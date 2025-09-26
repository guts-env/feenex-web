import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, Lightbulb, Play } from 'lucide-react';
import { useOnboarding } from './OnboardingProvider';

interface OnboardingBannerProps {
  tourId: string;
  title: string;
  description: string;
  showOnCondition?: boolean;
}

export function OnboardingBanner({
  tourId,
  title,
  description,
  showOnCondition = true
}: OnboardingBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const { isTourCompleted, startTour } = useOnboarding();

  // Don't show if tour is completed, banner is dismissed, or condition not met
  if (isTourCompleted(tourId) || isDismissed || !showOnCondition) {
    return null;
  }

  const handleStartTour = () => {
    startTour(tourId);
    setIsDismissed(true);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  return (
    <Alert className="mb-4 border-primary/20 bg-primary/5">
      <Lightbulb className="h-4 w-4 text-primary" />
      <AlertDescription className="flex items-center justify-between">
        <div className="flex-1">
          <span className="font-medium text-primary">{title}</span>
          <span className="text-muted-foreground ml-2">{description}</span>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button
            size="sm"
            onClick={handleStartTour}
            className="h-8 text-xs"
          >
            <Play className="h-3 w-3 mr-1" />
            Start Tour
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDismiss}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}