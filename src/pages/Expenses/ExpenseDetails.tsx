import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import ExpenseStatusBadge from '@/components/features/ExpenseStatusBadge'
import ExpensePhotos from '@/pages/Expenses/ExpensePhotos'
import ExpenseItems from '@/pages/Expenses/ExpenseItems'
import ExpenseOtherDetails from '@/pages/Expenses/ExpenseOtherDetails'
import { useDownloadPresigned } from '@/api/services/UploadService/mutation'
import type { IExpenseRes } from '@/types/api'

function ExpenseDetailsContent({ title, content }: { title: string; content: string | React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs text-primary">{title}</p>
      <div className="text-md">{content}</div>
    </div>
  )
}

export function ExpenseDetails({
  expense,
  open,
  onOpenChange,
}: {
  expense: IExpenseRes | undefined
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [internalData, setinternalData] = useState<IExpenseRes | undefined>(undefined)

  const { mutate: getDownloadPresigned } = useDownloadPresigned()

  useEffect(() => {
    if (open) {
      if (expense?.photos && expense.photos.length > 0) {
        getDownloadPresigned(
          { keys: expense.photos },
          {
            onSuccess: (data) => {
              setinternalData({ ...expense, photos: data.map((item) => item.url) })
            },
          },
        )
      } else {
        setinternalData(expense)
      }
    }
  }, [expense, open, getDownloadPresigned])

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setTimeout(() => {
            setinternalData(undefined)
          }, 500)
        }

        onOpenChange(isOpen)
      }}
    >
      <DialogContent className="max-h-[90vh] p-0 overflow-auto sm:max-w-3xl md:max-w-5xl">
        <div className="sticky top-0 bg-background border-b p-6 z-10">
          <DialogHeader>
            <DialogTitle>Expense Details</DialogTitle>
            {/* <ExpenseDetailsHeader>
              <DialogDescription>Created By: {internalData?.createdBy?.firstName}</DialogDescription>
              <DialogDescription>
                {internalData?.createdAt ? format(new Date(internalData.createdAt), 'MMM dd, yyyy hh:mm a') : ''}
              </DialogDescription>
            </ExpenseDetailsHeader>
            <ExpenseDetailsHeader>
              <DialogDescription>Updated By: {internalData?.updatedBy?.firstName}</DialogDescription>
              <DialogDescription>
                {internalData?.updatedAt ? format(new Date(internalData.updatedAt), 'MMM dd, yyyy hh:mm a') : ''}
              </DialogDescription>
            </ExpenseDetailsHeader>
            {internalData?.verifiedBy && (
              <ExpenseDetailsHeader>
                <DialogDescription>Verified By: {internalData?.verifiedBy?.firstName}</DialogDescription>
                <DialogDescription>
                  {internalData?.updatedAt ? format(new Date(internalData.updatedAt), 'MMM dd, yyyy hh:mm a') : ''}
                </DialogDescription>
              </ExpenseDetailsHeader>
            )} */}
          </DialogHeader>
        </div>
        <div className="flex flex-col md:flex-row flex-1 px-6 overflow-hidden gap-8">
          <div className="md:w-1/2 flex-shrink-0">
            {internalData?.photos ? <ExpensePhotos photos={internalData?.photos} /> : 'Placeholder: Photo Upload'}
          </div>

          <div className="md:w-1/2 overflow-y-auto flex flex-col gap-6">
            <ExpenseDetailsContent title="Merchant Name" content={internalData?.merchantName ?? '-'} />
            <ExpenseDetailsContent title="Status" content={<ExpenseStatusBadge status={internalData?.status} />} />
            <ExpenseDetailsContent title="Category" content={internalData?.category?.name ?? '-'} />
            <ExpenseDetailsContent
              title="Date"
              content={internalData?.date ? format(new Date(internalData?.date), 'MMM dd, yyyy') : '-'}
            />
            <ExpenseDetailsContent
              title="Total Amount"
              content={Intl.NumberFormat('ph-PH', { style: 'currency', currency: 'PHP' }).format(
                internalData?.amount ?? 0,
              )}
            />
            <ExpenseDetailsContent title="Items" content={<ExpenseItems items={internalData?.items ?? []} />} />
            <ExpenseDetailsContent
              title="Other Details"
              content={<ExpenseOtherDetails otherDetails={internalData?.otherDetails ?? []} />}
            />
          </div>
        </div>
        <div className="sticky bottom-0 z-10 bg-background border-t p-6">
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
