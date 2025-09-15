import React from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useCreateInviteForm } from '@/forms/hooks/useInviteForm';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCreateInvite } from '@/api/services/InviteService/mutation';

interface InviteMemberDialogProps {
  open: boolean;
  onClose: () => void;
}

const InviteMemberDialog: React.FC<InviteMemberDialogProps> = ({ open, onClose }) => {
  const form = useCreateInviteForm();

  const { mutate: createInvite, isPending } = useCreateInvite();

  const handleDialogClose = () => {
    onClose();
    setTimeout(() => {
      form.reset();
    }, 300);
  };

  const onSubmit = (values: { email: string }) => {
    createInvite(values, {
      onSuccess: () => {
        onClose();
        form.reset();
        toast.success('Invite has been sent! 🎉');
      },
      onError: (error) => {
        form.setError('email', { message: error.message });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      autoFocus
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleDialogClose}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                Invite
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteMemberDialog;
