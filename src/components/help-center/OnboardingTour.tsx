import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, ArrowLeft, ArrowRight, Play, Pause } from 'lucide-react';
import { useOnboarding } from './OnboardingProvider';

export function OnboardingTour() {
  const {
    isActive,
    currentTour,
    currentStepIndex,
    nextStep,
    prevStep,
    skipTour,
    completeTour,
    pauseTour,
  } = useOnboarding();

  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const currentStep = currentTour?.steps[currentStepIndex];

  useEffect(() => {
    if (!isActive || !currentStep) {
      setHighlightedElement(null);
      return;
    }

    // Add a small delay to ensure DOM elements are rendered
    const timer = setTimeout(() => {
      // Find the target element
      const targetElement = document.querySelector(currentStep.target) as HTMLElement;
    if (targetElement) {
      setHighlightedElement(targetElement);

      // Calculate tooltip position
      const rect = targetElement.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      let top = rect.top + scrollTop;
      let left = rect.left + scrollLeft;

      // Position tooltip based on the step's position preference
      switch (currentStep.position) {
        case 'top':
          top = rect.top + scrollTop - 20;
          left = rect.left + scrollLeft + rect.width / 2 - 200;
          break;
        case 'bottom':
          top = rect.bottom + scrollTop + 20;
          left = rect.left + scrollLeft + rect.width / 2 - 200;
          break;
        case 'left':
          top = rect.top + scrollTop + rect.height / 2 - 100;
          left = rect.left + scrollLeft - 420;
          break;
        case 'right':
          top = rect.top + scrollTop + rect.height / 2 - 100;
          left = rect.right + scrollLeft + 20;
          break;
      }

      // Ensure tooltip stays within viewport
      const maxLeft = window.innerWidth - 400;
      const maxTop = window.innerHeight - 200;

      setTooltipPosition({
        top: Math.max(20, Math.min(top, maxTop)),
        left: Math.max(20, Math.min(left, maxLeft))
      });

      // Scroll element into view
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });

        // Add highlight styles
        targetElement.style.position = 'relative';
        targetElement.style.zIndex = '9999';
        targetElement.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 0 8px rgba(59, 130, 246, 0.2)';
        targetElement.style.borderRadius = '8px';
      } else {
        console.warn(`Onboarding: Could not find element with selector "${currentStep.target}"`);
      }
    }, 100); // Small delay to ensure DOM is ready

    return () => {
      clearTimeout(timer);
      // Cleanup highlight styles
      const element = document.querySelector(currentStep.target) as HTMLElement;
      if (element) {
        element.style.position = '';
        element.style.zIndex = '';
        element.style.boxShadow = '';
        element.style.borderRadius = '';
      }
    };
  }, [isActive, currentStep]);

  if (!isActive || !currentTour || !currentStep) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-[9998]" />

      {/* Tour Tooltip */}
      <Card
        className="fixed z-[10000] w-96 shadow-2xl border-2 border-primary/20"
        style={{
          top: `${tooltipPosition.top}px`,
          left: `${tooltipPosition.left}px`
        }}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="text-lg">{currentStep.title}</CardTitle>
                <Badge variant="outline" className="text-xs">
                  {currentStepIndex + 1}/{currentTour.steps.length}
                </Badge>
              </div>
              <CardDescription className="text-sm">
                {currentStep.description}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={skipTour}
              className="h-8 w-8 p-0 ml-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevStep}
                disabled={currentStepIndex === 0}
                className="flex items-center gap-1"
              >
                <ArrowLeft className="h-3 w-3" />
                Back
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={pauseTour}
                className="flex items-center gap-1"
              >
                <Pause className="h-3 w-3" />
                Pause
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={skipTour}
                className="text-muted-foreground"
              >
                Skip Tour
              </Button>

              {currentStepIndex === currentTour.steps.length - 1 ? (
                <Button onClick={completeTour} className="flex items-center gap-1">
                  Complete
                </Button>
              ) : (
                <Button onClick={nextStep} className="flex items-center gap-1">
                  Next
                  <ArrowRight className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Progress indicator */}
          <div className="mt-3 flex gap-1">
            {currentTour.steps.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  index === currentStepIndex
                    ? 'bg-primary'
                    : index < currentStepIndex
                    ? 'bg-primary/50'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}