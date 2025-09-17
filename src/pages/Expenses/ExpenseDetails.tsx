import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ImageIcon } from 'lucide-react';
import ExpenseStatusBadge from '@/pages/Expenses/ExpenseStatusBadge';
import ExpensePhotos from '@/pages/Expenses/ExpensePhotos';
import ExpenseItems from '@/pages/Expenses/ExpenseItems';
import ExpenseOtherDetails from '@/pages/Expenses/ExpenseOtherDetails';
import { useDownloadPresigned } from '@/api/services/UploadService/mutation';
import { ExpenseStatusEnum } from '@/constants/enums';
import type { IExpenseRes } from '@/types/api';

function ExpenseDetailsContent({
  title,
  content,
}: {
  title: string;
  content: string | React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs text-primary">{title}</p>
      <div className="text-md">{content}</div>
    </div>
  );
}

function AuditTrailItem({ label, user, date }: { label: string; user?: string; date?: string }) {
  return (
    <div className="flex flex-col gap-1 p-3 bg-background rounded-md border">
      <div className="text-xs text-primary font-medium">{label}</div>
      <div className="text-sm text-foreground">{user || '-'}</div>
      {date && <div className="text-xs text-muted-foreground">{date}</div>}
    </div>
  );
}

export default function ExpenseDetails({
  expense,
  open,
  onOpenChange,
}: {
  expense: IExpenseRes | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [internalData, setinternalData] = useState<IExpenseRes | undefined>(undefined);
  const [photosDialogOpen, setPhotosDialogOpen] = useState(false);

  const { mutate: getDownloadPresigned } = useDownloadPresigned();

  useEffect(() => {
    if (open) {
      if (expense?.photos && expense.photos.length > 0) {
        getDownloadPresigned(
          { keys: expense.photos },
          {
            onSuccess: (data) => {
              setinternalData({ ...expense, photos: data.map((item) => item.url) });
            },
          },
        );
      } else {
        setinternalData(expense);
      }
    }
  }, [expense, open, getDownloadPresigned]);

  return (
    <Sheet
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setTimeout(() => {
            setinternalData(undefined);
            setPhotosDialogOpen(false);
          }, 500);
        }

        onOpenChange(isOpen);
      }}
    >
      <SheetContent
        side="right"
        className="w-full sm:max-w-4xl overflow-hidden p-0 flex flex-col gap-0"
      >
        <div className="flex flex-1 overflow-hidden">
          <div className="hidden md:flex w-1/2 flex-col border-r">
            <SheetHeader className="border-b p-6 flex-shrink-0">
              <SheetTitle>Photos</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-6">
              {internalData?.photos && internalData?.photos.length > 0 ? (
                <ExpensePhotos photos={internalData?.photos} />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  No photos available
                </div>
              )}
            </div>
          </div>

          <div className="w-full md:w-1/2 flex flex-col">
            <SheetHeader className="border-b p-6 flex-shrink-0">
              <SheetTitle>Expense Details</SheetTitle>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex flex-col gap-6">
                {internalData?.photos && internalData?.photos.length > 0 && (
                  <div className="md:hidden">
                    <ExpenseDetailsContent
                      title="Photos"
                      content={
                        <Dialog open={photosDialogOpen} onOpenChange={setPhotosDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="w-fit">
                              <ImageIcon className="h-4 w-4 mr-2" />
                              View Photos ({internalData.photos.length})
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl w-[calc(100vw-3rem)] h-[80vh]">
                            <DialogHeader>
                              <DialogTitle>Expense Photos</DialogTitle>
                            </DialogHeader>
                            <div className="flex-1 overflow-y-auto">
                              <ExpensePhotos photos={internalData.photos} />
                            </div>
                          </DialogContent>
                        </Dialog>
                      }
                    />
                  </div>
                )}

                <ExpenseDetailsContent
                  title="Merchant Name"
                  content={internalData?.merchantName ?? '-'}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ExpenseDetailsContent
                    title="Total Amount"
                    content={Intl.NumberFormat('ph-PH', {
                      style: 'currency',
                      currency: 'PHP',
                    }).format(internalData?.amount ?? 0)}
                  />
                  <ExpenseDetailsContent
                    title="Date"
                    content={
                      internalData?.date
                        ? format(new Date(internalData?.date), 'MMM dd, yyyy')
                        : '-'
                    }
                  />
                </div>

                {/* Status and Category in same row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ExpenseDetailsContent
                    title="Status"
                    content={
                      <ExpenseStatusBadge
                        status={internalData?.status || ExpenseStatusEnum.DRAFT}
                      />
                    }
                  />
                  <ExpenseDetailsContent
                    title="Category"
                    content={internalData?.category?.name ?? '-'}
                  />
                </div>

                {internalData?.items && internalData?.items.length > 0 && (
                  <ExpenseDetailsContent
                    title="Items"
                    content={<ExpenseItems items={internalData?.items} />}
                  />
                )}
                {internalData?.otherDetails && internalData?.otherDetails.length > 0 && (
                  <ExpenseDetailsContent
                    title="Other Details"
                    content={<ExpenseOtherDetails otherDetails={internalData?.otherDetails} />}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="border-t p-4 flex-shrink-0">
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <AuditTrailItem
                label="Created"
                user={internalData?.createdBy?.firstName}
                date={
                  internalData?.createdAt
                    ? format(new Date(internalData.createdAt), 'MMM dd, yyyy hh:mm a')
                    : undefined
                }
              />
              <AuditTrailItem
                label="Updated"
                user={internalData?.updatedBy?.firstName}
                date={
                  internalData?.updatedAt
                    ? format(new Date(internalData.updatedAt), 'MMM dd, yyyy hh:mm a')
                    : undefined
                }
              />
              {internalData?.verifiedBy ? (
                <AuditTrailItem
                  label="Verified"
                  user={internalData?.verifiedBy?.firstName}
                  date={
                    internalData?.verifiedAt
                      ? format(new Date(internalData.verifiedAt), 'MMM dd, yyyy hh:mm a')
                      : undefined
                  }
                />
              ) : (
                <AuditTrailItem label="Unverified" user="-" date="-" />
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
