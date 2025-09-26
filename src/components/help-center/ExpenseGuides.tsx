import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Upload,
  Plus,
  FileText,
  CheckCircle,
  Edit,
  Trash2,
  Eye,
  Camera,
  DollarSign,
  Calendar,
  Tag,
  Building,
  FileImage,
  AlertCircle,
  ListFilter,
  Search,
  Download,
  ArrowLeft,
} from 'lucide-react';

interface GuideStep {
  id: number;
  title: string;
  description: string;
  imageSlot?: string;
  tips?: string[];
  warning?: string;
}

interface ExpenseGuide {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  steps: GuideStep[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const expenseGuides: ExpenseGuide[] = [
  {
    id: 'auto-expense',
    title: 'Creating an Auto Expense',
    description: 'Upload receipts and let AI process them automatically',
    icon: Upload,
    difficulty: 'Beginner',
    steps: [
      {
        id: 1,
        title: 'Navigate to Expenses',
        description: 'Click on "Expenses" in the sidebar navigation to access the expenses page.',
        imageSlot: '/help/expenses-nav.png',
        tips: [
          'The Expenses menu is available to all users',
          'You can also use the keyboard shortcut Ctrl+E',
        ],
      },
      {
        id: 2,
        title: 'Click "New Expense" Button',
        description:
          'Find and click the "New Expense" button in the top right corner of the expenses page.',
        imageSlot: '/help/new-expense-button.png',
      },
      {
        id: 3,
        title: 'Select "Auto Expense"',
        description:
          'Choose the "Auto Expense" option to let AI process your receipts automatically.',
        imageSlot: '/help/auto-expense-option.png',
        tips: ['Auto Expense works best with clear, readable receipts'],
      },
      {
        id: 4,
        title: 'Upload Receipt Images',
        description:
          'Drag and drop receipt images or click to browse and select files from your device.',
        imageSlot: '/help/upload-receipts.png',
        tips: [
          'You can upload multiple receipts at once',
          'Supported formats: JPG, PNG, PDF',
          'Maximum file size: 10MB per image',
        ],
        warning: 'Ensure receipts are clear and not blurry for best AI processing results',
      },
      {
        id: 5,
        title: 'Review AI-Extracted Data',
        description:
          'Check the automatically extracted information including merchant, amount, date, and items.',
        imageSlot: '/help/review-extracted.png',
        tips: [
          'You can edit any incorrectly extracted information',
          'Add categories to help organize expenses',
        ],
      },
      {
        id: 6,
        title: 'Save the Expense',
        description: 'Once reviewed, click "Save Expense" to add it to your expense list.',
        imageSlot: '/help/save-expense.png',
        warning: 'Expenses are initially saved as "Pending" and need verification',
      },
    ],
  },
  {
    id: 'manual-expense',
    title: 'Creating a Manual Expense',
    description: "Manually enter expense details when you don't have a receipt",
    icon: Plus,
    difficulty: 'Beginner',
    steps: [
      {
        id: 1,
        title: 'Navigate to Expenses',
        description: 'Click on "Expenses" in the sidebar navigation.',
        imageSlot: '/help/expenses-nav.png',
      },
      {
        id: 2,
        title: 'Click "New Expense"',
        description: 'Click the "New Expense" button in the top right corner.',
        imageSlot: '/help/new-expense-button.png',
      },
      {
        id: 3,
        title: 'Select "Manual Entry"',
        description: 'Choose "Manual Entry" to input expense details yourself.',
        imageSlot: '/help/manual-entry-option.png',
      },
      {
        id: 4,
        title: 'Fill in Expense Details',
        description: 'Enter merchant name, amount, date, and category for your expense.',
        imageSlot: '/help/manual-expense-form.png',
        tips: [
          'Merchant name is required',
          'Select the appropriate category for better organization',
          'Add a description for future reference',
        ],
      },
      {
        id: 5,
        title: 'Add Line Items (Optional)',
        description: 'Break down your expense into individual items if needed.',
        imageSlot: '/help/add-line-items.png',
        tips: [
          'Useful for itemizing business meals or supplies',
          'Each item can have its own category',
        ],
      },
      {
        id: 6,
        title: 'Attach Receipt (Optional)',
        description: 'You can still attach a receipt image even for manual entries.',
        imageSlot: '/help/attach-receipt-manual.png',
      },
      {
        id: 7,
        title: 'Save the Expense',
        description: 'Review your entries and click "Save Expense" to complete.',
        imageSlot: '/help/save-manual-expense.png',
      },
    ],
  },
  {
    id: 'multiple-auto',
    title: 'Processing Multiple Auto Expenses',
    description: 'Efficiently handle multiple receipts at once',
    icon: FileImage,
    difficulty: 'Intermediate',
    steps: [
      {
        id: 1,
        title: 'Prepare Your Receipts',
        description: 'Gather all receipts you want to process. Ensure they are clear and readable.',
        imageSlot: '/help/prepare-receipts.png',
        tips: [
          'Organize receipts by date or category beforehand',
          'Check image quality before uploading',
        ],
      },
      {
        id: 2,
        title: 'Bulk Upload',
        description: 'Select multiple receipt files at once or drag them all into the upload area.',
        imageSlot: '/help/bulk-upload.png',
        tips: [
          'You can upload up to 20 receipts at once',
          'Each receipt will create a separate expense',
        ],
      },
      {
        id: 3,
        title: 'Monitor Processing',
        description:
          'Watch the progress as AI processes each receipt. Processing happens in parallel.',
        imageSlot: '/help/processing-progress.png',
        warning: 'Large batches may take a few minutes to process completely',
      },
      {
        id: 4,
        title: 'Review Each Expense',
        description:
          'Review and edit each processed expense. Use the navigation arrows to move between them.',
        imageSlot: '/help/review-multiple.png',
        tips: ['Check for duplicate expenses', 'Verify amounts and dates are correct'],
      },
      {
        id: 5,
        title: 'Batch Actions',
        description:
          'Select multiple expenses to perform batch actions like categorization or deletion.',
        imageSlot: '/help/batch-actions.png',
      },
    ],
  },
  {
    id: 'expense-list',
    title: 'Understanding the Expense List',
    description: 'Navigate and manage your expenses effectively',
    icon: ListFilter,
    difficulty: 'Beginner',
    steps: [
      {
        id: 1,
        title: 'Expense List Overview',
        description: 'The expense list shows all your expenses with key information at a glance.',
        imageSlot: '/help/expense-list-overview.png',
        tips: [
          'Expenses are sorted by date by default',
          'Status badges show expense verification state',
        ],
      },
      {
        id: 2,
        title: 'Understanding Status Badges',
        description:
          'Each expense has a status: Draft (gray), Pending (yellow), Verified (green), or Rejected (red).',
        imageSlot: '/help/status-badges.png',
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
        imageSlot: '/help/expense-filters.png',
        tips: ['Combine multiple filters for precise results', 'Save frequently used filters'],
      },
      {
        id: 4,
        title: 'Search Functionality',
        description: 'Use the search bar to find expenses by merchant name or description.',
        imageSlot: '/help/expense-search.png',
      },
      {
        id: 5,
        title: 'Sorting Options',
        description: 'Click column headers to sort by date, amount, merchant, or status.',
        imageSlot: '/help/sorting-options.png',
      },
      {
        id: 6,
        title: 'Pagination',
        description: 'Navigate through pages when you have many expenses.',
        imageSlot: '/help/pagination.png',
        tips: ['Adjust items per page in settings', 'Use keyboard shortcuts for faster navigation'],
      },
    ],
  },
  {
    id: 'view-expense',
    title: 'Viewing Expense Details',
    description: 'Access complete information about any expense',
    icon: Eye,
    difficulty: 'Beginner',
    steps: [
      {
        id: 1,
        title: 'Click on an Expense',
        description: 'Click any expense row in the list to view its details.',
        imageSlot: '/help/click-expense.png',
      },
      {
        id: 2,
        title: 'Expense Detail View',
        description: 'See complete information including receipt image, line items, and metadata.',
        imageSlot: '/help/expense-detail.png',
        tips: ['Click receipt image to view full size', 'Download receipt for your records'],
      },
      {
        id: 3,
        title: 'View Line Items',
        description: 'See itemized breakdown of the expense if available.',
        imageSlot: '/help/view-line-items.png',
      },
      {
        id: 4,
        title: 'Check Audit Trail',
        description: 'View history of changes and who made them.',
        imageSlot: '/help/audit-trail.png',
      },
    ],
  },
  {
    id: 'verify-expense',
    title: 'Verifying and Approving Expenses',
    description: 'Review and approve pending expenses',
    icon: CheckCircle,
    difficulty: 'Intermediate',
    steps: [
      {
        id: 1,
        title: 'Filter Pending Expenses',
        description:
          'Use the status filter to show only "Pending" expenses that need verification.',
        imageSlot: '/help/filter-pending.png',
      },
      {
        id: 2,
        title: 'Review Expense Details',
        description: 'Click on a pending expense to review all details and receipt.',
        imageSlot: '/help/review-for-verification.png',
        tips: ['Check receipt matches the entered amount', 'Verify expense is business-related'],
      },
      {
        id: 3,
        title: 'Verify or Reject',
        description: 'Click "Verify" to approve or "Reject" if corrections are needed.',
        imageSlot: '/help/verify-reject-buttons.png',
      },
      {
        id: 4,
        title: 'Add Verification Notes',
        description: 'Optionally add notes explaining your verification decision.',
        imageSlot: '/help/verification-notes.png',
        tips: ['Notes are helpful for rejected expenses', 'Explain what needs correction'],
      },
      {
        id: 5,
        title: 'Bulk Verification',
        description: 'Select multiple expenses to verify them all at once.',
        imageSlot: '/help/bulk-verify.png',
        warning: "Only bulk verify expenses you've thoroughly reviewed",
      },
    ],
  },
  {
    id: 'edit-expense',
    title: 'Editing an Expense',
    description: 'Modify expense details after creation',
    icon: Edit,
    difficulty: 'Beginner',
    steps: [
      {
        id: 1,
        title: 'Open Expense Details',
        description: 'Click on the expense you want to edit from the list.',
        imageSlot: '/help/open-expense-edit.png',
      },
      {
        id: 2,
        title: 'Click Edit Button',
        description: 'Click the "Edit" button in the expense detail view.',
        imageSlot: '/help/edit-button.png',
        warning: 'Verified expenses may require re-verification after editing',
      },
      {
        id: 3,
        title: 'Modify Details',
        description: 'Change any field including amount, date, category, or description.',
        imageSlot: '/help/edit-form.png',
      },
      {
        id: 4,
        title: 'Update Line Items',
        description: 'Add, remove, or modify individual line items.',
        imageSlot: '/help/edit-line-items.png',
      },
      {
        id: 5,
        title: 'Save Changes',
        description: 'Click "Save Changes" to update the expense.',
        imageSlot: '/help/save-edits.png',
        tips: [
          'Changes are tracked in the audit log',
          'Notification sent if expense was previously verified',
        ],
      },
    ],
  },
  {
    id: 'delete-expense',
    title: 'Deleting an Expense',
    description: 'Remove unwanted or duplicate expenses',
    icon: Trash2,
    difficulty: 'Beginner',
    steps: [
      {
        id: 1,
        title: 'Select Expense',
        description: 'Find and click on the expense you want to delete.',
        imageSlot: '/help/select-for-delete.png',
      },
      {
        id: 2,
        title: 'Click Delete Button',
        description: 'Click the "Delete" button in the expense detail view.',
        imageSlot: '/help/delete-button.png',
        warning: 'Deleting is permanent and cannot be undone',
      },
      {
        id: 3,
        title: 'Confirm Deletion',
        description: 'Confirm your intent to delete in the popup dialog.',
        imageSlot: '/help/confirm-delete.png',
      },
      {
        id: 4,
        title: 'Bulk Delete',
        description: 'Select multiple expenses and use bulk delete action.',
        imageSlot: '/help/bulk-delete.png',
        tips: [
          'Useful for removing duplicate entries',
          'Archive instead of delete for record keeping',
        ],
      },
    ],
  },
];

interface ExpenseGuidesProps {
  initialGuideId?: string | null;
}

export function ExpenseGuides({ initialGuideId }: ExpenseGuidesProps) {
  // Find the guide based on initialGuideId or default to first guide
  const getInitialGuide = (guideId?: string | null) => {
    if (guideId) {
      const foundGuide = expenseGuides.find(guide => guide.id === guideId);
      if (foundGuide) return foundGuide;
    }
    return expenseGuides[0];
  };

  const [selectedGuide, setSelectedGuide] = useState<ExpenseGuide>(() => getInitialGuide(initialGuideId));
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
        <h2 className="text-2xl font-bold mb-2">Expense Management Guides</h2>
        <p className="text-muted-foreground text-sm">
          Learn how to create, manage, and process expenses in Feenex
        </p>
      </div>

      <div className="flex gap-8 h-[calc(100vh-200px)] w-full">
        {/* Sidebar Navigation */}
        <div className="w-64 flex-shrink-0">
          <nav className="overflow-y-auto h-full pr-2 pl-4">
            <div className="space-y-1 border-l-2 border-l-primary pl-4">
              {expenseGuides.map((guide) => {
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
