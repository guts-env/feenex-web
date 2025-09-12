import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'

function DeleteExpenseDialog({
  deleteExpenseId,
  setDeleteExpenseId,
  handleDelete,
}: {
  deleteExpenseId: string | undefined
  setDeleteExpenseId: (id: string | undefined) => void
  handleDelete: (id: string) => void
}) {
  return (
    <AlertDialog open={!!deleteExpenseId} onOpenChange={(open) => !open && setDeleteExpenseId(undefined)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Expense</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this expense? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="destructive"
            onClick={() => {
              if (deleteExpenseId) {
                handleDelete(deleteExpenseId)
                setDeleteExpenseId(undefined)
              }
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteExpenseDialog
