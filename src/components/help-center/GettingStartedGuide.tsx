import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Book,
  UserCheck,
  Building2,
  CreditCard,
  Users,
  Settings,
  FileText,
  BarChart3,
  AlertCircle,
  FileImage,
  CheckCircle,
  Zap,
} from 'lucide-react';

interface GuideStep {
  id: number;
  title: string;
  description: string;
  imageSlot?: string;
  tips?: string[];
  warning?: string;
}

interface GettingStartedGuide {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  steps: GuideStep[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const gettingStartedGuides: GettingStartedGuide[] = [
  {
    id: 'first-steps',
    title: 'Your First Steps with Feenex',
    description: 'Essential setup to get started with expense management',
    icon: Zap,
    difficulty: 'Beginner',
    steps: [
      {
        id: 1,
        title: 'Complete Your Profile',
        description: 'Add your personal information, profile picture, and contact details to personalize your account.',
        imageSlot: '/help/complete-profile.png',
        tips: [
          'Upload a professional profile picture',
          'Ensure your email is verified for notifications',
          'Add your full name for proper expense attribution',
        ],
      },
      {
        id: 2,
        title: 'Join or Create an Organization',
        description: 'Either join an existing organization using an invite code or create your own organization.',
        imageSlot: '/help/join-create-org.png',
        tips: [
          'If you received an invite email, use that link to join',
          'When creating an organization, choose a clear, descriptive name',
          'You can always change organization details later',
        ],
      },
      {
        id: 3,
        title: 'Understand Your Role',
        description: 'Learn about your assigned role and what permissions you have in the organization.',
        imageSlot: '/help/understand-role.png',
        tips: [
          'Admin: Full access to all features and settings',
          'Manager: Can approve expenses and view reports',
          'Member: Can create and submit expenses',
        ],
      },
      {
        id: 4,
        title: 'Take a Quick Tour',
        description: 'Familiarize yourself with the main navigation and key features of Feenex.',
        imageSlot: '/help/interface-tour.png',
        tips: [
          'Explore the sidebar navigation',
          'Check out the dashboard for an overview',
          'Look for help tooltips throughout the interface',
        ],
      },
      {
        id: 5,
        title: 'Create Your First Expense',
        description: 'Try creating a simple expense to get comfortable with the process.',
        imageSlot: '/help/first-expense.png',
        tips: [
          'Start with a manual expense for simplicity',
          'Use a recent receipt or transaction',
          'Don\'t worry about perfection - you can edit later',
        ],
      },
    ],
  },
  {
    id: 'organization-setup',
    title: 'Setting Up Your Organization',
    description: 'Complete guide for administrators to configure their organization',
    icon: Building2,
    difficulty: 'Intermediate',
    steps: [
      {
        id: 1,
        title: 'Organization Profile Setup',
        description: 'Complete your organization profile with logo, description, and contact information.',
        imageSlot: '/help/org-profile-setup.png',
        tips: [
          'Add your company logo for branded reports',
          'Include a description that helps team members understand the organization',
          'Set up billing and contact information',
        ],
      },
      {
        id: 2,
        title: 'Configure Expense Categories',
        description: 'Set up expense categories that match your business needs and accounting structure.',
        imageSlot: '/help/expense-categories.png',
        tips: [
          'Align categories with your chart of accounts',
          'Include both common and industry-specific categories',
          'Consider tax implications when setting up categories',
        ],
      },
      {
        id: 3,
        title: 'Set Up Approval Workflows',
        description: 'Configure expense approval processes based on amounts, categories, or departments.',
        imageSlot: '/help/approval-workflows.png',
        tips: [
          'Set different approval limits for different roles',
          'Consider department-based approval chains',
          'Define what requires additional documentation',
        ],
        warning: 'Changes to approval workflows affect all pending expenses',
      },
      {
        id: 4,
        title: 'Create Departments',
        description: 'Organize your team into departments for better expense tracking and reporting.',
        imageSlot: '/help/create-departments.png',
        tips: [
          'Match your actual organizational structure',
          'Assign department managers for approval workflows',
          'Consider cost center alignment',
        ],
      },
      {
        id: 5,
        title: 'Invite Team Members',
        description: 'Add your team members and assign them to appropriate roles and departments.',
        imageSlot: '/help/invite-team.png',
        tips: [
          'Prepare a list of email addresses in advance',
          'Assign roles based on responsibilities',
          'Include a welcoming message in invitations',
        ],
      },
    ],
  },
  {
    id: 'daily-workflow',
    title: 'Daily Expense Management Workflow',
    description: 'Best practices for efficient daily expense handling',
    icon: CheckCircle,
    difficulty: 'Beginner',
    steps: [
      {
        id: 1,
        title: 'Morning Review',
        description: 'Start your day by reviewing any pending expenses or notifications.',
        imageSlot: '/help/morning-review.png',
        tips: [
          'Check for expenses needing approval',
          'Review any flagged or rejected expenses',
          'Clear notification badges',
        ],
      },
      {
        id: 2,
        title: 'Process New Receipts',
        description: 'Upload and process receipts as soon as possible after purchases.',
        imageSlot: '/help/process-receipts.png',
        tips: [
          'Take clear photos immediately after purchase',
          'Use auto-expense for quick processing',
          'Add context notes while details are fresh',
        ],
      },
      {
        id: 3,
        title: 'Review and Verify',
        description: 'Check auto-processed expenses for accuracy and make corrections as needed.',
        imageSlot: '/help/review-verify.png',
        tips: [
          'Verify amounts and dates are correct',
          'Ensure proper categorization',
          'Add business purpose descriptions',
        ],
      },
      {
        id: 4,
        title: 'Approve Team Expenses',
        description: 'If you\'re a manager, regularly review and approve your team\'s expenses.',
        imageSlot: '/help/approve-expenses.png',
        tips: [
          'Set aside dedicated time for approvals',
          'Ask for clarification on unclear expenses',
          'Provide feedback on rejected expenses',
        ],
      },
      {
        id: 5,
        title: 'Weekly Reconciliation',
        description: 'Do a weekly review to ensure all expenses are captured and processed.',
        imageSlot: '/help/weekly-reconciliation.png',
        tips: [
          'Check bank and credit card statements',
          'Look for any missing receipts or expenses',
          'Review monthly spending against budgets',
        ],
      },
    ],
  },
  {
    id: 'best-practices',
    title: 'Best Practices and Tips',
    description: 'Expert tips to maximize efficiency and compliance',
    icon: Settings,
    difficulty: 'Intermediate',
    steps: [
      {
        id: 1,
        title: 'Receipt Management',
        description: 'Develop good habits for capturing and storing receipts.',
        imageSlot: '/help/receipt-management.png',
        tips: [
          'Take photos immediately - don\'t let receipts pile up',
          'Ensure receipts are flat and well-lit',
          'Keep digital backups of important receipts',
        ],
      },
      {
        id: 2,
        title: 'Consistent Categorization',
        description: 'Use categories consistently to improve reporting and tax compliance.',
        imageSlot: '/help/consistent-categorization.png',
        tips: [
          'Create guidelines for common expense types',
          'Train team members on category usage',
          'Regular review and standardization',
        ],
      },
      {
        id: 3,
        title: 'Detailed Descriptions',
        description: 'Add meaningful descriptions that explain business purpose.',
        imageSlot: '/help/detailed-descriptions.png',
        tips: [
          'Include who, what, where, and why',
          'Mention client names or project codes when relevant',
          'Be specific about business justification',
        ],
      },
      {
        id: 4,
        title: 'Regular Reconciliation',
        description: 'Establish routines for matching expenses with bank statements.',
        imageSlot: '/help/regular-reconciliation.png',
        tips: [
          'Set weekly or monthly reconciliation schedules',
          'Use expense reports for statement matching',
          'Address discrepancies promptly',
        ],
      },
      {
        id: 5,
        title: 'Compliance and Audit Readiness',
        description: 'Maintain practices that support easy auditing and compliance.',
        imageSlot: '/help/compliance-audit.png',
        tips: [
          'Ensure all expenses have proper documentation',
          'Maintain approval trails for all expenses',
          'Keep expense policies up to date',
        ],
        warning: 'Poor expense documentation can lead to tax compliance issues',
      },
    ],
  },
];

export function GettingStartedGuide() {
  const [selectedGuide, setSelectedGuide] = useState<GettingStartedGuide>(gettingStartedGuides[0]);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Getting Started with Feenex</h2>
        <p className="text-muted-foreground text-sm">
          Complete guides to help you get up and running quickly
        </p>
      </div>

      <div className="flex gap-8 h-[calc(100vh-200px)] w-full">
        {/* Sidebar Navigation */}
        <div className="w-64 flex-shrink-0">
          <nav className="overflow-y-auto h-full pr-2 pl-4">
            <div className="space-y-1 border-l-2 border-l-primary pl-4">
              {gettingStartedGuides.map((guide) => {
                const isSelected = selectedGuide.id === guide.id;

                return (
                  <button
                    key={guide.id}
                    onClick={() => {
                      setSelectedGuide(guide);
                      contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${
                      isSelected
                        ? 'text-primary bg-primary/5'
                        : 'hover:bg-muted text-foreground'
                    }`}
                  >
                    {guide.title}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 overflow-y-auto h-full" ref={contentRef}>
          <div className="space-y-6 pb-8">
            {/* Guide Header */}
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {selectedGuide.title}
              </h3>
              <p className="text-muted-foreground">{selectedGuide.description}</p>
            </div>

            {/* Article Content */}
            <div className="space-y-8">
              {selectedGuide.steps.map((step, index) => (
                <div key={step.id} className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg mb-2">
                      {index + 1}. {step.title}
                    </h4>
                    <p className="text-muted-foreground text-sm">{step.description}</p>
                  </div>

                  {/* Image Placeholder */}
                  {step.imageSlot && (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center bg-muted/5 aspect-[2/1] max-w-[1200px] w-full">
                      <div className="text-center space-y-2">
                        <FileImage className="h-12 w-12 text-muted-foreground/50 mx-auto" />
                        <p className="text-sm text-muted-foreground">
                          Screenshot: {step.imageSlot}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Tips */}
                  {step.tips && step.tips.length > 0 && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Tips:</strong>
                        <ul className="mt-1 ml-4 list-disc space-y-1">
                          {step.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="text-sm">
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Warning */}
                  {step.warning && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Warning:</strong> {step.warning}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}