import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RoleEnum } from '@/constants/enums';
import { useOnboarding } from './OnboardingProvider';

export function OnboardingTestPanel() {
  const {
    userRole,
    setUserRole,
    getAvailableTours,
    startTour,
    isActive,
    currentTour,
    skipTour,
    pauseTour,
    resumeTour,
  } = useOnboarding();

  const availableTours = getAvailableTours();

  const roleLabels = {
    [RoleEnum.BUSINESS_ADMIN]: 'Business Admin',
    [RoleEnum.PERSONAL_ADMIN]: 'Personal Admin',
    [RoleEnum.MANAGER]: 'Manager',
    [RoleEnum.MEMBER]: 'Member',
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🧪 Onboarding Tour Test Panel
        </CardTitle>
        <CardDescription>
          Test the role-based onboarding tours with different user roles
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Role Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Select User Role:</label>
          <Select
            value={userRole || ''}
            onValueChange={(value) => setUserRole(value as RoleEnum)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a role to test..." />
            </SelectTrigger>
            <SelectContent>
              {Object.values(RoleEnum).map((role) => (
                <SelectItem key={role} value={role}>
                  {roleLabels[role]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {userRole && (
            <Badge variant="outline" className="mt-2">
              Current Role: {roleLabels[userRole]}
            </Badge>
          )}
        </div>

        {/* Available Tours */}
        {userRole && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Available Tours for {roleLabels[userRole]}:</h3>
              <Badge variant="secondary">
                {availableTours.length} tour{availableTours.length !== 1 ? 's' : ''}
              </Badge>
            </div>

            {availableTours.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                No tours available for this role.
              </p>
            ) : (
              <div className="grid gap-3">
                {availableTours.map((tour) => (
                  <Card key={tour.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{tour.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {tour.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {tour.steps.length} steps
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {tour.category}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => startTour(tour.id)}
                        disabled={isActive}
                      >
                        Start Tour
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Current Tour Status */}
        {isActive && currentTour && (
          <div className="space-y-3 border-t pt-4">
            <h3 className="font-medium text-green-700">🟢 Tour Active</h3>
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-sm text-green-800">
                    {currentTour.title}
                  </h4>
                  <p className="text-xs text-green-600 mt-1">
                    Currently running tour with {currentTour.steps.length} steps
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={pauseTour}>
                    Pause
                  </Button>
                  <Button size="sm" variant="outline" onClick={skipTour}>
                    Stop
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-800 text-sm mb-2">How to Test:</h4>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>1. Select a user role from the dropdown above</li>
            <li>2. Available tours will show based on role permissions</li>
            <li>3. Click "Start Tour" to begin an onboarding tour</li>
            <li>4. Tours will highlight elements and show tooltips</li>
            <li>5. Switch roles to see different available tours</li>
          </ul>

          <div className="mt-3 pt-2 border-t border-blue-300">
            <h5 className="font-medium text-blue-800 text-xs mb-1">Role Differences:</h5>
            <ul className="text-xs text-blue-600 space-y-1">
              <li><strong>Business Admin:</strong> Full access including organization setup</li>
              <li><strong>Personal Admin:</strong> Personal expense management only</li>
              <li><strong>Manager:</strong> Expense approval and team management</li>
              <li><strong>Member:</strong> Basic expense creation and tracking</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}