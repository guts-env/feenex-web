import { GuideStep, type GuideStepData } from './GuideStep';

export interface GuideData {
  id: string;
  title: string;
  description: string;
  steps: GuideStepData[];
}

interface GuideContentProps {
  guide: GuideData;
}

export function GuideContent({ guide }: GuideContentProps) {
  if (!guide.steps || guide.steps.length === 0) {
    return (
      <div className="py-8">
        <div className="mb-4 py-4 border-l-3 border-l-primary pl-4 bg-primary/5 rounded-br-lg rounded-tr-lg">
          <h3 className="text-xl font-semibold mb-2">{guide.title}</h3>
          <p className="text-muted-foreground">{guide.description}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Guide Header */}
      <div className="mb-4 py-4 border-l-3 border-l-primary pl-4 bg-primary/5 rounded-br-lg rounded-tr-lg">
        <h3 className="text-xl font-semibold mb-2">{guide.title}</h3>
        <p className="text-muted-foreground">{guide.description}</p>
      </div>

      {/* Guide Steps */}
      <div className="space-y-8">
        {guide.steps.map((step, index) => (
          <GuideStep
            key={step.id}
            stepNumber={index + 1}
            title={step.title}
            description={step.description}
            image={step.image}
            tips={step.tips}
            warning={step.warning}
            info={step.info}
          />
        ))}
      </div>
    </>
  );
}