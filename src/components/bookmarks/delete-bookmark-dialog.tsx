import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { Bookmark } from '@/types/models'

export function DeleteBookmarkDialog({
  bookmark,
  open,
  pending,
  onOpenChange,
  onConfirm,
}: {
  bookmark: Bookmark | null
  open: boolean
  pending: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void>
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete bookmark</AlertDialogTitle>
          <AlertDialogDescription>
            {bookmark
              ? `This will permanently remove "${bookmark.title}" from your dashboard.`
              : 'This action will permanently remove the bookmark.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={pending} onClick={() => void onConfirm()}>
            Delete bookmark
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
