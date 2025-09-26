import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CreditCard,
  Plus,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  Bell,
  BarChart3,
  AlertCircle,
  FileImage,
  Pause,
  Play,
} from 'lucide-react';

interface GuideStep {
  id: number;
  title: string;
  description: string;
  imageSlot?: string;
  tips?: string[];
  warning?: string;
}

interface SubscriptionGuide {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  steps: GuideStep[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const subscriptionGuides: SubscriptionGuide[] = [
  {
    id: 'add-subscription',
    title: 'Adding a New Subscription',
    description: 'Track recurring subscriptions and services',
    icon: Plus,
    difficulty: 'Beginner',
    steps: [
      {
        id: 1,
        title: 'Navigate to Subscriptions',
        description: 'Click on "Subscriptions" in the sidebar navigation to access your subscription management page.',
        imageSlot: '/help/subscriptions-nav.png',
        tips: [
          'Subscriptions help track recurring expenses automatically',
          'You can access this from any page using the sidebar',
        ],
      },
      {
        id: 2,
        title: 'Click "Add Subscription"',
        description: 'Find and click the "Add Subscription" button to start adding a new recurring service.',
        imageSlot: '/help/add-subscription-button.png',
      },
      {
        id: 3,
        title: 'Enter Subscription Details',
        description: 'Fill in the service name, cost, billing frequency, and start date.',
        imageSlot: '/help/subscription-form.png',
        tips: [
          'Choose the correct billing cycle (monthly, yearly, etc.)',
          'Add a clear description to identify the service',
          'Set the correct start date for accurate tracking',
        ],
      },
      {
        id: 4,
        title: 'Set Payment Method',
        description: 'Select or add the payment method used for this subscription.',
        imageSlot: '/help/subscription-payment.png',
        tips: [
          'Link to the credit card or account used for payment',
          'This helps with expense categorization',
        ],
      },
      {
        id: 5,
        title: 'Configure Notifications',
        description: 'Set up alerts for upcoming payments and renewals.',
        imageSlot: '/help/subscription-notifications.png',
        tips: [
          'Get notified before charges occur',
          'Set reminders for subscription reviews',
        ],
      },
      {
        id: 6,
        title: 'Save and Activate',
        description: 'Review all details and save your subscription to start tracking.',
        imageSlot: '/help/save-subscription.png',
      },
    ],
  },
  {
    id: 'manage-subscriptions',
    title: 'Managing Active Subscriptions',
    description: 'Edit, pause, or cancel your recurring subscriptions',
    icon: Edit,
    difficulty: 'Beginner',
    steps: [
      {
        id: 1,
        title: 'View Subscription List',
        description: 'See all your active, paused, and cancelled subscriptions in one organized view.',
        imageSlot: '/help/subscription-list.png',
        tips: [
          'Use filters to find specific subscriptions',
          'Sort by cost, renewal date, or status',
        ],
      },
      {
        id: 2,
        title: 'Edit Subscription Details',
        description: 'Click on any subscription to modify its details, cost, or billing frequency.',
        imageSlot: '/help/edit-subscription.png',
        tips: [
          'Update pricing when services change rates',
          'Modify billing cycles if plans change',
        ],
      },
      {
        id: 3,
        title: 'Pause Subscriptions',
        description: 'Temporarily pause subscriptions without losing historical data.',
        imageSlot: '/help/pause-subscription.png',
        tips: [
          'Useful for seasonal services',
          'Preserves all historical tracking data',
        ],
        warning: 'Pausing only stops tracking - you must cancel with the actual service provider',
      },
      {
        id: 4,
        title: 'Cancel Subscriptions',
        description: 'Mark subscriptions as cancelled when you no longer use them.',
        imageSlot: '/help/cancel-subscription.png',
        warning: 'This only removes from tracking - cancel with the service provider separately',
      },
    ],
  },
  {
    id: 'subscription-analytics',
    title: 'Analyzing Subscription Costs',
    description: 'Track spending patterns and optimize your subscriptions',
    icon: BarChart3,
    difficulty: 'Intermediate',
    steps: [
      {
        id: 1,
        title: 'Access Analytics Dashboard',
        description: 'View your subscription analytics from the main subscriptions page.',
        imageSlot: '/help/subscription-analytics.png',
      },
      {
        id: 2,
        title: 'Review Monthly Spending',
        description: 'See your total monthly recurring costs and how they trend over time.',
        imageSlot: '/help/monthly-spending.png',
        tips: [
          'Identify spending spikes and patterns',
          'Compare costs across different time periods',
        ],
      },
      {
        id: 3,
        title: 'Analyze by Category',
        description: 'Break down your subscriptions by type: software, entertainment, utilities, etc.',
        imageSlot: '/help/category-breakdown.png',
        tips: [
          'Identify which categories consume most of your budget',
          'Find opportunities for consolidation',
        ],
      },
      {
        id: 4,
        title: 'Identify Unused Services',
        description: 'Find subscriptions that might not provide value anymore.',
        imageSlot: '/help/unused-subscriptions.png',
        tips: [
          'Review services you haven\'t actively used',
          'Consider cancelling or downgrading plans',
        ],
      },
      {
        id: 5,
        title: 'Generate Reports',
        description: 'Create detailed reports for budgeting and expense planning.',
        imageSlot: '/help/subscription-reports.png',
        tips: [
          'Export data for external analysis',
          'Share reports with finance teams',
        ],
      },
    ],
  },
  {
    id: 'subscription-alerts',
    title: 'Setting Up Smart Notifications',
    description: 'Configure alerts for renewals, price changes, and reviews',
    icon: Bell,
    difficulty: 'Intermediate',
    steps: [
      {
        id: 1,
        title: 'Access Notification Settings',
        description: 'Go to subscription settings to configure your alert preferences.',
        imageSlot: '/help/notification-settings.png',
      },
      {
        id: 2,
        title: 'Set Renewal Reminders',
        description: 'Choose how far in advance you want to be notified of upcoming renewals.',
        imageSlot: '/help/renewal-reminders.png',
        tips: [
          'Set different lead times for different services',
          'Get early warnings for expensive renewals',
        ],
      },
      {
        id: 3,
        title: 'Configure Price Change Alerts',
        description: 'Get notified when subscription prices increase or decrease.',
        imageSlot: '/help/price-alerts.png',
        tips: [
          'Stay informed about rate changes',
          'Review value proposition when prices increase',
        ],
      },
      {
        id: 4,
        title: 'Set Review Reminders',
        description: 'Schedule periodic reviews to evaluate subscription necessity.',
        imageSlot: '/help/review-reminders.png',
        tips: [
          'Regular reviews help optimize spending',
          'Set quarterly or yearly review cycles',
        ],
      },
      {
        id: 5,
        title: 'Choose Delivery Methods',
        description: 'Select how you want to receive notifications: email, in-app, or both.',
        imageSlot: '/help/delivery-methods.png',
      },
    ],
  },
];

export function SubscriptionGuides() {
  const [selectedGuide, setSelectedGuide] = useState<SubscriptionGuide>(subscriptionGuides[0]);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Subscription Management Guides</h2>
        <p className="text-muted-foreground text-sm">
          Learn how to track and optimize your recurring subscriptions
        </p>
      </div>

      <div className="flex gap-8 h-[calc(100vh-200px)] w-full">
        {/* Sidebar Navigation */}
        <div className="w-64 flex-shrink-0">
          <nav className="overflow-y-auto h-full pr-2 pl-4">
            <div className="space-y-1 border-l-2 border-l-primary pl-4">
              {subscriptionGuides.map((guide) => {
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