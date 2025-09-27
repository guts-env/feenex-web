import { useParams, useNavigate, Link } from 'react-router-dom';
import { GuideLayout } from '@/components/features/GuideLayout';
import { GuideContent } from '@/components/features/GuideContent';

const organizationGuides = [
  {
    id: 'who-can-manage-organization',
    title: 'Who Can Manage an Organization?',
    description: 'For business accounts, only business admins can manage the organization.',
    steps: [],
  },
  {
    id: 'invite-members',
    title: 'Inviting Team Members',
    description: 'Add and manage team members in your organization',
    steps: [
      {
        id: 1,
        title: 'Navigate to Organization',
        description:
          'Click on "Organization" in the sidebar navigation to access the organization page.',
        image: '/help/org-nav.webp',
      },
      {
        id: 2,
        title: 'Click "Invite Member" button',
        description:
          'Find and click the "Invite Member" button in the top right corner of the organization page.',
        image: '/help/invite-member-button.webp',
      },
      {
        id: 3,
        title: 'Send Invite',
        description:
          'Enter the email address of the member you want to invite and click the "Invite" button.',
        image: '/help/invite-member-form.webp',
        info: 'Invitations expire after 7 days.',
      },
      {
        id: 4,
        title: 'Accepting Invitation',
        description:
          'The invited member will receive an email with a link to accept the invitation. Clicking the link will redirect them to the signup page where they can create an account and join the organization.',
        image: '/help/accept-invite-email.webp',
      },
      {
        id: 5,
        title: 'Set Member Roles',
        description:
          'Once an invitation is accepted, the Member role will be assigned by default. You can change the role from the organization page.',
        info: (
          <p>
            See{' '}
            <Link to="/help-center/organization/understand-roles" className="underline">
              Understanding User Roles & Permissions
            </Link>{' '}
            for more information on the different roles and permissions.
          </p>
        ),
      },
    ],
  },
  {
    id: 'understand-roles',
    title: 'Understanding User Roles & Permissions',
    description: 'Understand the different roles and permissions in your organization',
    steps: [
      {
        id: 1,
        title: 'Admin Role',
        description: 'Admin role has all permissions.',
        tips: [
          'Admins can manage organization settings',
          'Admins can invite members',
          'Admins can modify user roles',
          'Admins have full expense and subscription management capabilities',
          'Admins can access the organization dashboard and expense reports',
        ],
      },
      {
        id: 2,
        title: 'Manager Role',
        description: 'Manager role has full expense management capabilities.',
        tips: [
          'Managers can verify expenses',
          'Managers can only view verified expenses for the current date',
          'Managers cannot view verified expenses for the previous days',
        ],
        info: 'Managers need to make sure that the verified expenses for the current date are finalized before the end of the day because they will not be able to access said expenses on the next day. If you encounter cases where your managers need to access expenses from the previous days but does not need to have admin privileges, please contact support.',
      },
      {
        id: 3,
        title: 'Member Role',
        description: 'Member role has the least permissions.',
        tips: [
          'Members can create and update expenses',
          'Members can delete unverified expenses',
          'Members cannot access verified expenses',
        ],
      },
    ],
  },
  {
    id: 'updating-roles',
    title: 'Updating User Roles',
    description: 'Update the role of a user in your organization',
    steps: [
      {
        id: 1,
        title: 'Navigate to organization',
        description:
          'Click on "Organization" in the sidebar navigation to access the organization page.',
        image: '/help/org-nav.webp',
      },
      {
        id: 2,
        title: 'Click "Manage Member" button',
        description: 'Click the "Manage Member" button to toggle in-row editing mode.',
        image: '/help/manage-member.webp',
      },
      {
        id: 3,
        title: 'Select the Role',
        description: 'Select the role you want to assign to the member from the role dropdown.',
        image: '/help/select-role.webp',
      },
      {
        id: 4,
        title: 'Save or Cancel',
        description:
          'Click the checkmark button to save the changes or the "X" button to cancel the changes.',
        image: '/help/save-or-cancel-role.webp',
      },
    ],
  },
  {
    id: 'remove-members',
    title: 'Removing Team Members',
    description:
      'You cannot remove members from the app at the moment. If you need to remove a member, please contact support.',
    steps: [],
  },
  {
    id: 'role-requests',
    title: 'Role Requests',
    description:
      'If you have suggestions for new roles or want to request a role permission change, please contact support.',
    steps: [],
  },
];

export default function OrganizationGuide() {
  const { guideId } = useParams<{ guideId: string }>();
  const navigate = useNavigate();

  // Find the current guide or default to first
  const currentGuide = guideId
    ? organizationGuides.find((g) => g.id === guideId) || organizationGuides[0]
    : organizationGuides[0];

  const handleGuideSelect = (selectedGuideId: string) => {
    navigate(`/help-center/organization/${selectedGuideId}`);
  };

  const guideList = organizationGuides.map((g) => ({
    id: g.id,
    title: g.title,
  }));

  return (
    <GuideLayout
      title="Organization Management Guides"
      description="Learn how to set up and manage your organization in Feenex"
      guides={guideList}
      selectedGuideId={currentGuide.id}
      onGuideSelect={handleGuideSelect}
    >
      <GuideContent guide={currentGuide} />
    </GuideLayout>
  );
}
