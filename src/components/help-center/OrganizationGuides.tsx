import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Building2,
  UserPlus,
  Users,
  Settings,
  Shield,
  Crown,
  FileText,
  Mail,
  AlertCircle,
  FileImage,
} from 'lucide-react';

interface GuideStep {
  id: number;
  title: string;
  description: string;
  imageSlot?: string;
  tips?: string[];
  warning?: string;
}

interface OrganizationGuide {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  steps: GuideStep[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const organizationGuides: OrganizationGuide[] = [
  {
    id: 'create-organization',
    title: 'Setting Up Your Organization',
    description: 'Create and configure your organization profile',
    icon: Building2,
    difficulty: 'Beginner',
    steps: [
      {
        id: 1,
        title: 'Access Organization Settings',
        description: 'Navigate to the Organization section in the main sidebar to access your organization management tools.',
        imageSlot: '/help/org-nav.png',
        tips: [
          'Organization settings are only available to Admin users',
          'You can access this from any page using the sidebar',
        ],
      },
      {
        id: 2,
        title: 'Complete Organization Profile',
        description: 'Fill in your organization name, description, and contact information.',
        imageSlot: '/help/org-profile.png',
        tips: [
          'Organization name will appear on all expense reports',
          'Add a clear description to help team members understand your organization',
        ],
      },
      {
        id: 3,
        title: 'Upload Organization Logo',
        description: 'Add your company logo to personalize reports and the interface.',
        imageSlot: '/help/org-logo.png',
        tips: [
          'Recommended size: 300x300 pixels',
          'Supported formats: PNG, JPG, SVG',
        ],
      },
      {
        id: 4,
        title: 'Configure Organization Settings',
        description: 'Set up expense policies, approval workflows, and default categories.',
        imageSlot: '/help/org-settings.png',
        warning: 'Changing these settings will affect all organization members',
      },
    ],
  },
  {
    id: 'invite-members',
    title: 'Inviting Team Members',
    description: 'Add and manage team members in your organization',
    icon: UserPlus,
    difficulty: 'Beginner',
    steps: [
      {
        id: 1,
        title: 'Access Member Management',
        description: 'Go to the Members tab within your Organization settings.',
        imageSlot: '/help/members-tab.png',
      },
      {
        id: 2,
        title: 'Send Invitations',
        description: 'Click "Invite Members" and enter email addresses of people you want to add.',
        imageSlot: '/help/invite-form.png',
        tips: [
          'You can invite multiple people at once',
          'Invitations expire after 7 days',
        ],
      },
      {
        id: 3,
        title: 'Set Member Roles',
        description: 'Assign appropriate roles: Admin, Manager, or Member to each invitee.',
        imageSlot: '/help/member-roles.png',
        tips: [
          'Admins can manage organization settings',
          'Managers can approve expenses',
          'Members can create and submit expenses',
        ],
      },
      {
        id: 4,
        title: 'Track Invitation Status',
        description: 'Monitor pending invitations and resend if necessary.',
        imageSlot: '/help/invitation-status.png',
      },
    ],
  },
  {
    id: 'manage-roles',
    title: 'Managing User Roles & Permissions',
    description: 'Control what team members can do in your organization',
    icon: Shield,
    difficulty: 'Intermediate',
    steps: [
      {
        id: 1,
        title: 'Understand Role Types',
        description: 'Learn about the three main roles: Admin, Manager, and Member.',
        imageSlot: '/help/role-types.png',
        tips: [
          'Admin: Full access to all features',
          'Manager: Can approve expenses and view reports',
          'Member: Can create and submit expenses only',
        ],
      },
      {
        id: 2,
        title: 'Modify User Roles',
        description: 'Change roles for existing members from the Members management page.',
        imageSlot: '/help/modify-roles.png',
        warning: 'Removing Admin privileges may lock you out of certain features',
      },
      {
        id: 3,
        title: 'Set Department Permissions',
        description: 'Configure which departments users can access and manage.',
        imageSlot: '/help/department-permissions.png',
      },
      {
        id: 4,
        title: 'Configure Approval Workflows',
        description: 'Set up expense approval chains based on user roles and amounts.',
        imageSlot: '/help/approval-workflows.png',
        tips: [
          'Different approval levels for different expense amounts',
          'Managers can approve up to their set limit',
        ],
      },
    ],
  },
  {
    id: 'departments',
    title: 'Creating and Managing Departments',
    description: 'Organize your team into departments for better expense tracking',
    icon: Users,
    difficulty: 'Intermediate',
    steps: [
      {
        id: 1,
        title: 'Access Department Settings',
        description: 'Navigate to the Departments section in Organization settings.',
        imageSlot: '/help/departments-nav.png',
      },
      {
        id: 2,
        title: 'Create New Departments',
        description: 'Add departments that match your organization structure.',
        imageSlot: '/help/create-department.png',
        tips: [
          'Use clear, descriptive department names',
          'Consider your organization chart structure',
        ],
      },
      {
        id: 3,
        title: 'Assign Department Managers',
        description: 'Designate managers who can approve expenses for each department.',
        imageSlot: '/help/department-managers.png',
      },
      {
        id: 4,
        title: 'Move Members to Departments',
        description: 'Assign team members to their appropriate departments.',
        imageSlot: '/help/assign-departments.png',
        tips: [
          'Members can belong to multiple departments',
          'Department assignment affects expense approval workflow',
        ],
      },
    ],
  },
];

interface OrganizationGuidesProps {
  initialGuideId?: string | null;
}

export function OrganizationGuides({ initialGuideId }: OrganizationGuidesProps) {
  // Find the guide based on initialGuideId or default to first guide
  const getInitialGuide = (guideId?: string | null) => {
    if (guideId) {
      const foundGuide = organizationGuides.find(guide => guide.id === guideId);
      if (foundGuide) return foundGuide;
    }
    return organizationGuides[0];
  };

  const [selectedGuide, setSelectedGuide] = useState<OrganizationGuide>(() => getInitialGuide(initialGuideId));
  const contentRef = useRef<HTMLDivElement>(null);

  // Update selected guide when initialGuideId changes
  useEffect(() => {
    const newGuide = getInitialGuide(initialGuideId);
    setSelectedGuide(newGuide);
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [initialGuideId]);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Organization Management Guides</h2>
        <p className="text-muted-foreground text-sm">
          Learn how to set up and manage your organization in Feenex
        </p>
      </div>

      <div className="flex gap-8 h-[calc(100vh-200px)] w-full">
        {/* Sidebar Navigation */}
        <div className="w-64 flex-shrink-0">
          <nav className="overflow-y-auto h-full pr-2 pl-4">
            <div className="space-y-1 border-l-2 border-l-primary pl-4">
              {organizationGuides.map((guide) => {
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