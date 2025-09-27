import { useParams, useNavigate } from 'react-router-dom';
import { GuideLayout } from '@/components/features/GuideLayout';
import { GuideContent } from '@/components/features/GuideContent';

const subscriptionGuides = [
  {
    id: 'add-subscription',
    title: 'Adding a New Subscription',
    description: 'Track recurring subscriptions and services',
    steps: [
      {
        id: 1,
        title: 'Navigate to Subscriptions',
        description:
          'Click on "Subscriptions" in the sidebar navigation to access your subscription management page.',
        image: '/help/subscriptions-nav.png',
        tips: [
          'Subscriptions help track recurring expenses automatically',
          'You can access this from any page using the sidebar',
        ],
      },
      {
        id: 2,
        title: 'Click "Add Subscription"',
        description:
          'Find and click the "Add Subscription" button to start adding a new recurring service.',
        image: '/help/add-subscription-button.png',
      },
      {
        id: 3,
        title: 'Enter Subscription Details',
        description: 'Fill in the service name, cost, billing frequency, and start date.',
        image: '/help/subscription-form.png',
        tips: [
          'Choose the correct billing cycle (monthly, yearly, etc.)',
          'Add a clear description to identify the service',
          'Set the correct start date for accurate tracking',
        ],
      },
    ],
  },
  {
    id: 'manage-subscriptions',
    title: 'Managing Active Subscriptions',
    description: 'Edit, pause, or cancel your recurring subscriptions',
    steps: [
      {
        id: 1,
        title: 'View Subscription List',
        description:
          'See all your active, paused, and cancelled subscriptions in one organized view.',
        image: '/help/subscription-list.png',
        tips: [
          'Use filters to find specific subscriptions',
          'Sort by cost, renewal date, or status',
        ],
      },
      {
        id: 2,
        title: 'Edit Subscription Details',
        description: 'Click on any subscription to modify its details, cost, or billing frequency.',
        image: '/help/edit-subscription.png',
        tips: [
          'Update pricing when services change rates',
          'Modify billing cycles if plans change',
        ],
      },
      {
        id: 3,
        title: 'Pause Subscriptions',
        description: 'Temporarily pause subscriptions without losing historical data.',
        image: '/help/pause-subscription.png',
        tips: ['Useful for seasonal services', 'Preserves all historical tracking data'],
        warning: 'Pausing only stops tracking - you must cancel with the actual service provider',
      },
      {
        id: 4,
        title: 'Cancel Subscriptions',
        description: 'Mark subscriptions as cancelled when you no longer use them.',
        image: '/help/cancel-subscription.png',
        warning: 'This only removes from tracking - cancel with the service provider separately',
      },
    ],
  },
];

export default function SubscriptionGuide() {
  const { guideId } = useParams<{ guideId: string }>();
  const navigate = useNavigate();

  // Find the current guide or default to first
  const currentGuide = guideId
    ? subscriptionGuides.find(g => g.id === guideId) || subscriptionGuides[0]
    : subscriptionGuides[0];

  const handleGuideSelect = (selectedGuideId: string) => {
    navigate(`/help-center/subscriptions/${selectedGuideId}`);
  };

  const guideList = subscriptionGuides.map(g => ({
    id: g.id,
    title: g.title
  }));

  return (
    <GuideLayout
      title="Subscription Management Guides"
      description="Learn how to track and manage your recurring subscriptions"
      guides={guideList}
      selectedGuideId={currentGuide.id}
      onGuideSelect={handleGuideSelect}
    >
      <GuideContent guide={currentGuide} />
    </GuideLayout>
  );
}