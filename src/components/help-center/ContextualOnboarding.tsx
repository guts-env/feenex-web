import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useOnboarding } from './OnboardingProvider';

/**
 * Component that triggers contextual onboarding based on the current page
 */
export function ContextualOnboarding() {
  const location = useLocation();
  const { startTour, isTourCompleted } = useOnboarding();

  useEffect(() => {
    // Only trigger contextual tours if user hasn't completed them
    const contextualTours: Record<string, string> = {
      '/expenses': 'expense-creation',
      // Add more contextual tours here as needed
      // '/organization': 'organization-setup',
    };

    const tourId = contextualTours[location.pathname];

    if (tourId && !isTourCompleted(tourId)) {
      // Add delay to ensure page is loaded
      const timer = setTimeout(() => {
        // Check if we're on expenses page and there are no expenses
        if (location.pathname === '/expenses') {
          // For now, we'll let the AddExpense dialog trigger the tour
          // This could be enhanced to check if user has 0 expenses and show a hint
          return;
        }

        // For other pages, trigger the tour directly
        startTour(tourId);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [location.pathname, isTourCompleted, startTour]);

  // This component doesn't render anything
  return null;
}