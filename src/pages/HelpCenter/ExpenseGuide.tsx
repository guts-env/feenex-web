import { useParams, useNavigate, Link } from 'react-router-dom';
import { GuideLayout } from '@/components/features/GuideLayout';
import { GuideContent } from '@/components/features/GuideContent';

const expenseGuides = [
  {
    id: 'auto-expense',
    title: 'Creating an Auto Expense',
    description: 'Upload receipts and let Feenex process them automatically',
    steps: [
      {
        id: 1,
        title: 'Navigate to Expenses',
        description: 'Click on "Expenses" in the sidebar navigation to access the expenses page.',
        image: '/help/expenses-nav.webp',
      },
      {
        id: 2,
        title: 'Click "Add Expense" Button',
        description:
          'Find and click the "Add Expense" button in the top right corner of the expenses page.',
        image: '/help/add-expense-button.webp',
      },
      {
        id: 3,
        title: 'Select "Auto"',
        description: 'Choose the "Auto" option to let Feenex process your receipts automatically.',
        image: '/help/auto-expense-option.webp',
        tips: ['Auto Expense works best with clear, readable receipts'],
      },
      {
        id: 4,
        title: 'Upload Receipt Images',
        description:
          'Drag and drop receipt imags or click to browse and select an image from your device.',
        image: '/help/upload-receipts.webp',
        tips: [
          'Maximum of 5 images per expense',
          'Supported formats: JPG, PNG, PDF, WEBP, HEIC, HEIF',
          'Maximum file size: 5MB per image',
        ],
        info: 'Ensure receipts are clear and not blurry for best processing results',
      },
      {
        id: 5,
        title: 'Click "Process Expense" Button',
        description:
          'After uploading the receipts, click the "Process Expense" button to let Feenex process the receipts.',
        image: '/help/process-expense-button.webp',
      },
      {
        id: 6,
        title: 'Expense Processing',
        description:
          'After clicking the "Process Expense" button, the receipts will be processed in the background.',
        image: '/help/expense-processing.webp',
        info: 'Expenses are initially saved as "Pending" and needs verification.',
      },
      {
        id: 7,
        title: 'Review Expense',
        description: (
          <p>
            Review the expense and make any necessary adjustments (see{' '}
            <Link to="/help-center/expenses/edit-expense" className="underline">
              Editing an Expense
            </Link>
            ).
          </p>
        ),
        image: '/help/review-expense.webp',
      },
      {
        id: 8,
        title: 'Verify Expense',
        description: 'Quickly verify the expense by clicking the "Verify" button.',
        image: '/help/verify-expense-button.webp',
      },
    ],
  },
  {
    id: 'manual-expense',
    title: 'Creating a Manual Expense',
    description: 'Manually enter and save expense details',
    steps: [
      {
        id: 1,
        title: 'Navigate to Expenses',
        description: 'Click on "Expenses" in the sidebar navigation to access the expenses page.',
        image: '/help/expenses-nav.webp',
      },
      {
        id: 2,
        title: 'Click "Add Expense" Button',
        description:
          'Find and click the "Add Expense" button in the top right corner of the expenses page.',
        image: '/help/add-expense-button.webp',
      },
      {
        id: 3,
        title: 'Select "Manual"',
        description: 'Choose "Manual" and input all the required details for your expense.',
        image: '/help/manual-entry-option.webp',
      },
      {
        id: 5,
        title: 'Attach Receipt (Optional)',
        description: 'You can still attach a receipt image even for manual entries.',
        image: '/help/attach-receipt-manual.webp',
        tips: [
          'Maximum of 5 images per expense',
          'Supported formats: JPG, PNG, PDF, WEBP, HEIC, HEIF',
          'Maximum file size: 5MB per image',
        ],
      },
      {
        id: 6,
        title: 'Save the Expense',
        description: 'Review the details and click "Create Expense" to save the expense.',
        image: '/help/save-manual-expense.webp',
      },
    ],
  },
  {
    id: 'multiple-auto',
    title: 'Processing Multiple Auto Expenses',
    description: 'Efficiently handle multiple receipts at once',
    steps: [
      {
        id: 1,
        title: 'Navigate to Expenses',
        description: 'Click on "Expenses" in the sidebar navigation to access the expenses page.',
        image: '/help/expenses-nav.webp',
      },
      {
        id: 2,
        title: 'Click "Process Multiple Expenses" Button',
        description:
          'Click the arrow beside the "Add Expense" button to show the "Process Multiple Expenses" button.',
        image: '/help/process-multiple-expenses-button.webp',
      },
      {
        id: 3,
        title: 'Upload Receipt Images',
        description:
          'Drag and drop receipt imags or click to browse and select an image from your device for each expense.',
        image: '/help/multiple-expenses-upload.webp',
        tips: [
          'You can add up to 5 expenses at once',
          'Each collapsible will create a separate expense',
          'Maximum of 5 images per expense',
          'Supported formats: JPG, PNG, PDF, WEBP, HEIC, HEIF',
          'Maximum file size: 5MB per image',
        ],
        info: 'Add images for existing expenses first before adding new expenses.',
      },
      {
        id: 4,
        title: 'Process Multiple Expenses',
        description: 'Click the "Process All Expenses" button to process all the expenses.',
        image: '/help/process-all-expenses-button.webp',
      },
      {
        id: 5,
        title: 'Multiple Expense Processing',
        description:
          'Feenex will process all the expenses in the background. Processing happens in parallel.',
        image: '/help/multiple-processing-progress.webp',
        info: 'Large batches may take up to a few minutes to process completely depending on the complexity of the receipts.',
      },
      {
        id: 6,
        title: 'Review Expense',
        description: (
          <p>
            Review the expense and make any necessary adjustments (see{' '}
            <Link to="/help-center/expenses/edit-expense" className="underline">
              Editing an Expense
            </Link>
            ).
          </p>
        ),
        image: '/help/review-multiple-expense.webp',
      },
      {
        id: 7,
        title: 'Verify Expense',
        description: 'Quickly verify the expense by clicking the "Verify" button.',
        image: '/help/verify-expense-button.webp',
      },
    ],
  },
  {
    id: 'expense-list',
    title: 'Understanding the Expense List',
    description: 'Navigate and manage your expenses effectively',
    steps: [
      {
        id: 1,
        title: 'Expense List Overview',
        description: 'The expense list shows all your expenses with key information at a glance.',
        image: '/help/expense-list.webp',
        info: 'Expenses are sorted by date created by default',
      },
      {
        id: 2,
        title: 'Understanding Status Badges',
        description:
          'Each expense has a status: Draft (gray), Pending (yellow), Verified (green), or Rejected (red).',
        image: '/help/list-status-badges.webp',
        tips: [
          'Draft: Incomplete expense entry',
          'Pending: Awaiting verification',
          'Verified: Approved and confirmed',
          'Rejected: Needs review or correction',
        ],
      },
      {
        id: 3,
        title: 'Using Filters',
        description:
          'Filter expenses by date range, category, amount, or status to find what you need.',
        image: '/help/expense-filters.webp',
        info: 'Combine multiple filters for precise results.',
      },
      {
        id: 4,
        title: 'Column Visibility',
        description: 'Toggle the visibility of columns to show or hide them.',
        image: '/help/column-visibility.webp',
      },
      {
        id: 5,
        title: 'Search Functionality',
        description:
          'Use the search bar to find expenses by merchant name or OR number. Keyword search can be combined with filters.',
        image: '/help/expense-search.webp',
      },
      {
        id: 6,
        title: 'Sorting Options',
        description: 'Click column headers to sort in ascending or descending order.',
        image: '/help/expense-sorting.webp',
      },
      {
        id: 7,
        title: 'Pagination',
        description: 'Navigate through pages when you have many expenses.',
        image: '/help/expense-pagination.webp',
      },
    ],
  },
  {
    id: 'view-expense',
    title: 'Viewing Expense Details',
    description: 'View the complete details of an expense',
    steps: [
      {
        id: 1,
        title: 'Click "View" Button',
        description: 'Click the "View" action button to view the expense details.',
        image: '/help/view-from-list.webp',
      },
      {
        id: 2,
        title: 'View Expense Details',
        description: 'See complete expense information including receipt images.',
        image: '/help/view-expense-detail.webp',
      },
      {
        id: 3,
        title: 'Check Audit Trail',
        description: 'View history of changes and who made them.',
        image: '/help/expense-audit-trail.webp',
      },
      {
        id: 4,
        title: 'Quick Verify',
        description:
          'You can also quickly verify the expense from expense detail view by clicking the "Verify" button.',
        image: '/help/verify-expense-button.webp',
      },
    ],
  },
  {
    id: 'verify-expense',
    title: 'Verifying Expenses',
    description: 'Different ways to verify pending expenses',
    steps: [
      {
        id: 1,
        title: 'Verify From Expense List',
        description:
          'Click the "Verify" action button to quickly verify the expense from the expense list.',
        image: '/help/verify-from-list.webp',
      },
      {
        id: 2,
        title: 'Verify From Expense Detail',
        description:
          'Click the "Verify" button to quickly verify the expense from the expense detail view.',
        image: '/help/verify-expense-button.webp',
      },
      {
        id: 3,
        title: 'Verify or Reject From Edit Expense',
        description:
          'Select "Verify" to approve or "Reject" if corrections are needed from the status dropdown in the edit expense form then click the "Update Expense" button to save changes.',
        image: '/help/verify-from-edit.webp',
      },
    ],
  },
  {
    id: 'edit-expense',
    title: 'Editing an Expense',
    description: 'Modify expense details after creation',
    steps: [
      {
        id: 1,
        title: 'Click "Edit" Button',
        description: 'Click the "Edit" action button to edit the expense from the expense list.',
        image: '/help/edit-from-list.webp',
      },
      {
        id: 2,
        title: 'Edit Expense Details',
        description:
          'Change any field including the photos, OR number, merchant name, total amount, VAT, dates, status, and category.',
        image: '/help/edit-expense-details.webp',
      },
      {
        id: 5,
        title: 'Save Changes',
        description: 'Click "Update Expense" to save changes.',
        image: '/help/save-changes-expense.webp',
        info: 'Audit log shows who made the most recent changes.',
      },
    ],
  },
  {
    id: 'delete-expense',
    title: 'Deleting an Expense',
    description: 'Remove unwanted or duplicate expenses',
    steps: [
      {
        id: 1,
        title: 'Click "Delete" Button',
        description:
          'Click the "Delete" action button to delete the expense from the expense list.',
        image: '/help/delete-from-list.webp',
      },
      {
        id: 2,
        title: 'Confirm Deletion',
        description: 'Confirm your intent to delete in the popup dialog.',
        image: '/help/delete-expense-confirmation.webp',
        warning: 'Deleting is permanent and cannot be undone',
      },
    ],
  },
];

export default function ExpenseGuide() {
  const { guideId } = useParams<{ guideId: string }>();
  const navigate = useNavigate();

  // Find the current guide or default to first
  const currentGuide = guideId
    ? expenseGuides.find((g) => g.id === guideId) || expenseGuides[0]
    : expenseGuides[0];

  const handleGuideSelect = (selectedGuideId: string) => {
    navigate(`/help-center/expenses/${selectedGuideId}`);
  };

  const guideList = expenseGuides.map((g) => ({
    id: g.id,
    title: g.title,
  }));

  return (
    <GuideLayout
      title="Expense Management Guides"
      description="Learn how to create, manage, and process expenses in Feenex"
      guides={guideList}
      selectedGuideId={currentGuide.id}
      onGuideSelect={handleGuideSelect}
    >
      <GuideContent guide={currentGuide} />
    </GuideLayout>
  );
}
