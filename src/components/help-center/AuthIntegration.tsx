import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useUserStore } from '@/stores/useUserStore';
import { useOnboarding } from './OnboardingProvider';
import { RoleEnum } from '@/constants/enums';

/**
 * Component that integrates the onboarding system with the authentication system.
 * Automatically sets the user role and triggers onboarding for new users.
 */
export function AuthIntegration() {
  const { user } = useUserStore(
    useShallow((state) => ({
      user: state.user,
    })),
  );

  const { setUserRole, shouldShowOnboarding, startTour } = useOnboarding();

  // Ref to prevent multiple auto-starts
  const hasAutoStartedRef = useRef(false);

  // Set user role when user changes
  useEffect(() => {
    if (user?.role?.name) {
      setUserRole(user.role.name as RoleEnum);
    } else {
      setUserRole(null);
    }
  }, [user?.role?.name, setUserRole]);

  // Auto-start onboarding for new users (optional - can be triggered manually)
  useEffect(() => {
    // Only auto-start if user exists, has a role, should show onboarding, and hasn't already started
    if (user?.role?.name && shouldShowOnboarding() && !hasAutoStartedRef.current) {
      const roleToTourMap = {
        [RoleEnum.BUSINESS_ADMIN]: 'business-admin-getting-started',
        [RoleEnum.PERSONAL_ADMIN]: 'personal-admin-getting-started',
        [RoleEnum.MANAGER]: 'manager-getting-started',
        [RoleEnum.MEMBER]: 'member-getting-started',
      };

      const tourId = roleToTourMap[user.role.name as RoleEnum];

      // Auto-start tour for users who haven't completed onboarding
      // DISABLED FOR PRODUCTION
      // if (tourId) {
      //   hasAutoStartedRef.current = true; // Mark as started to prevent re-runs

      //   // Add a small delay to ensure page is fully loaded
      //   const timer = setTimeout(() => {
      //     startTour(tourId);
      //   }, 2000);

      //   return () => clearTimeout(timer);
      // }
    }
  }, [user?.role?.name, shouldShowOnboarding, startTour]);

  // This component doesn't render anything
  return null;
}