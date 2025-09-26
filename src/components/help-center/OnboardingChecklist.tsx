import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, Play, RotateCcw } from 'lucide-react';
import { RoleEnum } from '@/constants/enums';
import { useOnboarding } from './OnboardingProvider';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  tourId: string;
  optional?: boolean;
  category: string;
}

const roleBasedChecklists: Record<RoleEnum, ChecklistItem[]> = {
  [RoleEnum.BUSINESS_ADMIN]: [
    {
      id: 'business-welcome',
      title: 'Complete Getting Started Tour',
      description: 'Learn the basics of managing your organization',
      tourId: 'business-admin-getting-started',
      category: 'Setup',
    },
    {
      id: 'org-setup',
      title: 'Set Up Your Organization',
      description: 'Configure organization profile and invite team members',
      tourId: 'organization-setup',
      category: 'Organization',
    },
    {
      id: 'expense-creation',
      title: 'Create Your First Expense',
      description: 'Learn how to create and manage expenses',
      tourId: 'expense-creation',
      category: 'Expenses',
      optional: true,
    },
  ],
  [RoleEnum.PERSONAL_ADMIN]: [
    {
      id: 'personal-welcome',
      title: 'Complete Getting Started Tour',
      description: 'Learn the basics of personal expense management',
      tourId: 'personal-admin-getting-started',
      category: 'Setup',
    },
    {
      id: 'expense-creation',
      title: 'Create Your First Expense',
      description: 'Learn how to create and manage your personal expenses',
      tourId: 'expense-creation',
      category: 'Expenses',
    },
  ],
  [RoleEnum.MANAGER]: [
    {
      id: 'manager-welcome',
      title: 'Complete Getting Started Tour',
      description: 'Learn how to manage and approve team expenses',
      tourId: 'manager-getting-started',
      category: 'Setup',
    },
    {
      id: 'expense-creation',
      title: 'Learn Expense Management',
      description: 'Understand the expense approval workflow',
      tourId: 'expense-creation',
      category: 'Expenses',
      optional: true,
    },
  ],
  [RoleEnum.MEMBER]: [
    {
      id: 'member-welcome',
      title: 'Complete Getting Started Tour',
      description: 'Learn how to submit expenses to your team',
      tourId: 'member-getting-started',
      category: 'Setup',
    },
    {
      id: 'expense-creation',
      title: 'Create Your First Expense',
      description: 'Learn how to create and submit expenses for approval',
      tourId: 'expense-creation',
      category: 'Expenses',
    },
  ],
};

export function OnboardingChecklist() {
  const {
    userRole,
    completedTours,
    startTour,
    isTourCompleted,
    shouldShowOnboarding,
  } = useOnboarding();

  if (!userRole || !shouldShowOnboarding()) {
    return null;
  }

  const checklist = roleBasedChecklists[userRole] || [];
  const completedCount = checklist.filter(item => isTourCompleted(item.tourId)).length;
  const totalCount = checklist.length;
  const progress = (completedCount / totalCount) * 100;

  const categories = [...new Set(checklist.map(item => item.category))];

  const handleStartTour = (tourId: string) => {
    startTour(tourId);
  };

  const handleRestartTour = (tourId: string) => {
    startTour(tourId, true);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              📋 Onboarding Progress
            </CardTitle>
            <CardDescription>
              Complete these steps to get the most out of Feenex
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-sm">
            {completedCount}/{totalCount}
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>

      <CardContent className="space-y-6">
        {categories.map(category => (
          <div key={category} className="space-y-3">
            <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
              {category}
            </h3>
            <div className="space-y-2">
              {checklist
                .filter(item => item.category === category)
                .map(item => {
                  const isCompleted = isTourCompleted(item.tourId);
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                        isCompleted
                          ? 'bg-green-50 border-green-200'
                          : 'bg-muted/30 border-muted-foreground/20'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className={`font-medium text-sm ${
                            isCompleted ? 'text-green-800' : 'text-foreground'
                          }`}>
                            {item.title}
                          </h4>
                          {item.optional && (
                            <Badge variant="secondary" className="text-xs">
                              Optional
                            </Badge>
                          )}
                        </div>
                        <p className={`text-xs mt-1 ${
                          isCompleted ? 'text-green-600' : 'text-muted-foreground'
                        }`}>
                          {item.description}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        {isCompleted ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRestartTour(item.tourId)}
                            className="h-8 text-xs"
                          >
                            <RotateCcw className="h-3 w-3 mr-1" />
                            Restart
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleStartTour(item.tourId)}
                            className="h-8 text-xs"
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Start
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}

        {progress === 100 && (
          <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-green-800 mb-1">
              Congratulations! 🎉
            </h3>
            <p className="text-sm text-green-600">
              You've completed all onboarding steps. You're ready to make the most of Feenex!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}