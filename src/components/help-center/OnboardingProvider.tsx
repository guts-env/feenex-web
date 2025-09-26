import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { RoleEnum } from '@/constants/enums';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target: string; // CSS selector for the element to highlight
  position: 'top' | 'bottom' | 'left' | 'right';
  category: string;
  roles: RoleEnum[]; // Which roles can see this step
}

interface OnboardingTour {
  id: string;
  title: string;
  description: string;
  steps: OnboardingStep[];
  category: string;
  roles: RoleEnum[]; // Which roles can access this tour
}

interface OnboardingContextType {
  isActive: boolean;
  currentTour: OnboardingTour | null;
  currentStepIndex: number;
  userRole: RoleEnum | null;
  completedTours: string[];
  startTour: (tourId: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  completeTour: () => void;
  pauseTour: () => void;
  resumeTour: () => void;
  getAvailableTours: () => OnboardingTour[];
  setUserRole: (role: RoleEnum) => void;
  isTourCompleted: (tourId: string) => boolean;
  shouldShowOnboarding: () => boolean;
  markTourCompleted: (tourId: string) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

// Predefined onboarding tours
const onboardingTours: OnboardingTour[] = [
  // Business Admin-specific tour
  {
    id: 'business-admin-getting-started',
    title: 'Welcome to Feenex - Business Admin Tour',
    description: 'Complete setup guide for business administrators',
    category: 'getting-started',
    roles: [RoleEnum.BUSINESS_ADMIN],
    steps: [
      {
        id: 'business-admin-welcome',
        title: 'Welcome, Business Administrator!',
        description: 'As a business admin, you have full access to configure and manage your organization.',
        target: '[data-tour="dashboard"]',
        position: 'bottom',
        category: 'overview',
        roles: [RoleEnum.BUSINESS_ADMIN],
      },
      {
        id: 'business-admin-sidebar',
        title: 'Admin Navigation',
        description: 'Access all sections: Dashboard, Expenses, Organization, Settings, and more.',
        target: '[data-tour="sidebar"]',
        position: 'right',
        category: 'navigation',
        roles: [RoleEnum.BUSINESS_ADMIN],
      },
      {
        id: 'organization-setup',
        title: 'Set Up Your Organization',
        description: 'Configure your organization profile, invite members, and set permissions.',
        target: '[data-tour="organization-nav"]',
        position: 'bottom',
        category: 'organization',
        roles: [RoleEnum.BUSINESS_ADMIN],
      },
      {
        id: 'business-admin-settings',
        title: 'System Settings',
        description: 'Configure system-wide settings, expense policies, and approval workflows.',
        target: '[data-tour="settings-nav"]',
        position: 'bottom',
        category: 'settings',
        roles: [RoleEnum.BUSINESS_ADMIN],
      },
    ],
  },
  // Personal Admin-specific tour
  {
    id: 'personal-admin-getting-started',
    title: 'Welcome to Feenex - Personal Account',
    description: 'Get started with personal expense management',
    category: 'getting-started',
    roles: [RoleEnum.PERSONAL_ADMIN],
    steps: [
      {
        id: 'personal-admin-welcome',
        title: 'Welcome to Personal Feenex!',
        description: 'Manage your personal expenses, receipts, and financial tracking.',
        target: '[data-tour="dashboard"]',
        position: 'bottom',
        category: 'overview',
        roles: [RoleEnum.PERSONAL_ADMIN],
      },
      {
        id: 'personal-admin-expenses',
        title: 'Personal Expense Tracking',
        description: 'Create and manage your personal expenses and receipts.',
        target: '[data-tour="expenses-nav"]',
        position: 'right',
        category: 'expenses',
        roles: [RoleEnum.PERSONAL_ADMIN],
      },
      {
        id: 'personal-admin-settings',
        title: 'Personal Settings',
        description: 'Configure your personal account settings and preferences.',
        target: '[data-tour="settings-nav"]',
        position: 'bottom',
        category: 'settings',
        roles: [RoleEnum.PERSONAL_ADMIN],
      },
    ],
  },
  // Manager-specific tour
  {
    id: 'manager-getting-started',
    title: 'Welcome to Feenex - Manager Tour',
    description: 'Learn to approve expenses and manage your team',
    category: 'getting-started',
    roles: [RoleEnum.MANAGER],
    steps: [
      {
        id: 'manager-welcome',
        title: 'Welcome, Manager!',
        description: 'You can approve expenses, view reports, and manage your team\'s expense workflow.',
        target: '[data-tour="expenses-nav"]',
        position: 'bottom',
        category: 'overview',
        roles: [RoleEnum.MANAGER],
      },
      {
        id: 'manager-expenses',
        title: 'Expense Management',
        description: 'Review, approve, or reject expense submissions from your team members.',
        target: '[data-tour="expense-approval"]',
        position: 'right',
        category: 'expenses',
        roles: [RoleEnum.MANAGER],
      },
      {
        id: 'manager-reports',
        title: 'View Reports',
        description: 'Access expense reports and analytics for your team and organization.',
        target: '[data-tour="reports-section"]',
        position: 'bottom',
        category: 'reports',
        roles: [RoleEnum.MANAGER],
      },
    ],
  },
  // Member-specific tour
  {
    id: 'member-getting-started',
    title: 'Welcome to Feenex - Member Tour',
    description: 'Learn to create and submit expenses',
    category: 'getting-started',
    roles: [RoleEnum.MEMBER],
    steps: [
      {
        id: 'member-welcome',
        title: 'Welcome, Team Member!',
        description: 'You can create expenses, upload receipts, and track your submissions.',
        target: '[data-tour="expenses-nav"]',
        position: 'bottom',
        category: 'overview',
        roles: [RoleEnum.MEMBER],
      },
      {
        id: 'member-create-expense',
        title: 'Create Your First Expense',
        description: 'Click here to create a new expense. Upload receipts or enter details manually.',
        target: '[data-tour="new-expense-btn"]',
        position: 'bottom',
        category: 'expenses',
        roles: [RoleEnum.MEMBER],
      },
      {
        id: 'member-expense-list',
        title: 'Track Your Expenses',
        description: 'View all your submitted expenses and their approval status here.',
        target: '[data-tour="expense-list"]',
        position: 'right',
        category: 'expenses',
        roles: [RoleEnum.MEMBER],
      },
    ],
  },
  {
    id: 'expense-creation',
    title: 'Creating Your First Expense',
    description: 'Learn how to create and manage expenses effectively',
    category: 'expenses',
    roles: [RoleEnum.BUSINESS_ADMIN, RoleEnum.MANAGER, RoleEnum.MEMBER, RoleEnum.PERSONAL_ADMIN],
    steps: [
      {
        id: 'expense-types',
        title: 'Choose Expense Type',
        description: 'Select between Auto Expense (AI-powered) or Manual Entry based on your needs.',
        target: '[data-tour="expense-type-selector"]',
        position: 'right',
        category: 'expenses',
        roles: [RoleEnum.BUSINESS_ADMIN, RoleEnum.MANAGER, RoleEnum.MEMBER, RoleEnum.PERSONAL_ADMIN],
      },
      {
        id: 'upload-receipt',
        title: 'Upload Your Receipt',
        description: 'Drag and drop or click to upload receipt images. Our AI will extract the details automatically.',
        target: '[data-tour="receipt-upload"]',
        position: 'top',
        category: 'expenses',
        roles: [RoleEnum.BUSINESS_ADMIN, RoleEnum.MANAGER, RoleEnum.MEMBER, RoleEnum.PERSONAL_ADMIN],
      },
      {
        id: 'review-details',
        title: 'Review and Edit',
        description: 'Check the extracted information and make any necessary corrections before saving.',
        target: '[data-tour="expense-form"]',
        position: 'left',
        category: 'expenses',
        roles: [RoleEnum.BUSINESS_ADMIN, RoleEnum.MANAGER, RoleEnum.MEMBER, RoleEnum.PERSONAL_ADMIN],
      },
      {
        id: 'save-expense',
        title: 'Save Your Expense',
        description: 'Once everything looks good, save your expense. It will be added to your expense list.',
        target: '[data-tour="save-expense-btn"]',
        position: 'top',
        category: 'expenses',
        roles: [RoleEnum.BUSINESS_ADMIN, RoleEnum.MANAGER, RoleEnum.MEMBER, RoleEnum.PERSONAL_ADMIN],
      },
    ],
  },
  {
    id: 'organization-setup',
    title: 'Set Up Your Organization',
    description: 'Configure your organization and invite team members',
    category: 'organization',
    roles: [RoleEnum.BUSINESS_ADMIN], // Only business admins can set up organization
    steps: [
      {
        id: 'org-profile',
        title: 'Complete Organization Profile',
        description: 'Add your organization details, logo, and contact information to get started.',
        target: '[data-tour="org-profile-form"]',
        position: 'right',
        category: 'organization',
        roles: [RoleEnum.BUSINESS_ADMIN],
      },
      {
        id: 'invite-members',
        title: 'Invite Your Team',
        description: 'Add team members to your organization and assign them appropriate roles.',
        target: '[data-tour="invite-members-btn"]',
        position: 'bottom',
        category: 'organization',
        roles: [RoleEnum.BUSINESS_ADMIN],
      },
      {
        id: 'set-permissions',
        title: 'Configure Roles & Permissions',
        description: 'Define what each team member can do: create expenses, approve expenses, or manage settings.',
        target: '[data-tour="roles-settings"]',
        position: 'left',
        category: 'organization',
        roles: [RoleEnum.BUSINESS_ADMIN],
      },
    ],
  },
];

interface OnboardingProviderProps {
  children: ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentTour, setCurrentTour] = useState<OnboardingTour | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [userRole, setUserRole] = useState<RoleEnum | null>(null);
  const [completedTours, setCompletedTours] = useState<string[]>([]);

  // Load completed tours from localStorage on mount
  useEffect(() => {
    const savedCompletedTours = localStorage.getItem('feenex-completed-tours');
    if (savedCompletedTours) {
      try {
        setCompletedTours(JSON.parse(savedCompletedTours));
      } catch (error) {
        console.warn('Failed to parse completed tours from localStorage:', error);
      }
    }
  }, []);

  // Save completed tours to localStorage when they change
  useEffect(() => {
    if (completedTours.length > 0) {
      localStorage.setItem('feenex-completed-tours', JSON.stringify(completedTours));
    }
  }, [completedTours]);

  const getAvailableTours = useCallback(() => {
    if (!userRole) return [];
    return onboardingTours.filter(tour => tour.roles.includes(userRole));
  }, [userRole]);

  const getFilteredSteps = useCallback((tour: OnboardingTour) => {
    if (!userRole) return [];
    return tour.steps.filter(step => step.roles.includes(userRole));
  }, [userRole]);

  const isTourCompleted = useCallback((tourId: string) => {
    return completedTours.includes(tourId);
  }, [completedTours]);

  const startTour = useCallback((tourId: string, force = false) => {
    // Skip if tour already completed (unless forced)
    if (!force && isTourCompleted(tourId)) {
      console.info(`Tour ${tourId} already completed. Use force=true to restart.`);
      return;
    }

    const tour = onboardingTours.find(t => t.id === tourId);
    if (tour && userRole && tour.roles.includes(userRole)) {
      const filteredTour = {
        ...tour,
        steps: getFilteredSteps(tour)
      };
      setCurrentTour(filteredTour);
      setCurrentStepIndex(0);
      setIsActive(true);
    }
  }, [userRole, isTourCompleted, getFilteredSteps]);

  const markTourCompleted = useCallback((tourId: string) => {
    if (!completedTours.includes(tourId)) {
      setCompletedTours(prev => [...prev, tourId]);
    }
  }, [completedTours]);

  const completeTour = useCallback(() => {
    if (currentTour) {
      markTourCompleted(currentTour.id);
    }
    setIsActive(false);
    setCurrentTour(null);
    setCurrentStepIndex(0);
  }, [currentTour, markTourCompleted]);

  const nextStep = useCallback(() => {
    if (currentTour && currentStepIndex < currentTour.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      completeTour();
    }
  }, [currentTour, currentStepIndex, completeTour]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  const skipTour = useCallback(() => {
    setIsActive(false);
    setCurrentTour(null);
    setCurrentStepIndex(0);
  }, []);

  const shouldShowOnboarding = useCallback(() => {
    if (!userRole) return false;

    // Check if user has any incomplete tours for their role
    const availableTours = getAvailableTours();
    const incompleteTours = availableTours.filter(tour => !isTourCompleted(tour.id));

    return incompleteTours.length > 0;
  }, [userRole, getAvailableTours, isTourCompleted]);

  const pauseTour = useCallback(() => {
    setIsActive(false);
  }, []);

  const resumeTour = useCallback(() => {
    if (currentTour) {
      setIsActive(true);
    }
  }, [currentTour]);

  const value: OnboardingContextType = {
    isActive,
    currentTour,
    currentStepIndex,
    userRole,
    completedTours,
    startTour,
    nextStep,
    prevStep,
    skipTour,
    completeTour,
    pauseTour,
    resumeTour,
    getAvailableTours,
    setUserRole,
    isTourCompleted,
    shouldShowOnboarding,
    markTourCompleted,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}

export { onboardingTours };
export type { OnboardingTour, OnboardingStep };