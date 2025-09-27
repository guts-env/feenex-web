import { type ReactNode } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, LightbulbIcon } from 'lucide-react';

export interface GuideStepData {
  id: number;
  title: string;
  description: ReactNode;
  image?: string;
  tips?: ReactNode[];
  warning?: ReactNode;
  info?: ReactNode;
}

interface GuideStepProps extends Omit<GuideStepData, 'id'> {
  stepNumber: number;
}

export function GuideStep({
  stepNumber,
  title,
  description,
  image,
  tips,
  warning,
  info,
}: GuideStepProps) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-semibold text-lg mb-2">
          {stepNumber}. {title}
        </h4>
        <div className="text-muted-foreground text-md">{description}</div>
      </div>

      {/* Image */}
      {image && <img src={image} alt={title} className="rounded-lg border-1" />}

      {/* Tips */}
      {tips && tips.length > 0 && (
        <Alert>
          <AlertDescription>
            <ul className="ml-4 list-disc space-y-1">
              {tips.map((tip, tipIndex) => (
                <li key={tipIndex} className="text-sm">
                  {tip}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Warning */}
      {warning && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Warning:</strong> {warning}
          </AlertDescription>
        </Alert>
      )}

      {/* Info */}
      {info && (
        <Alert variant="info">
          <LightbulbIcon className="size-12" />
          <AlertDescription>{info}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
