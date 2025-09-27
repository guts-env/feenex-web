import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/password-input';
import { useResetPasswordForm } from '@/forms/hooks/useAuthForm';
import { useResetPassword } from '@/api/services/AuthService/mutation';
import { type IResetPasswordFormValues } from '@/forms/schema/auth';

export default function ResetPasswordForm({ className, ...props }: React.ComponentProps<'form'>) {
  const [searchParams] = useSearchParams();

  const form = useResetPasswordForm();
  const { mutate: resetPassword, isPending } = useResetPassword();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = (data: IResetPasswordFormValues) => {
    setError(null);
    setSuccess(null);

    resetPassword(
      {
        ...data,
        resetToken: searchParams.get('prt')!,
      },
      {
        onSuccess: () => {
          form.reset();
          setSuccess('Your password has been updated.');
        },
        onError: (error) => {
          if (Array.isArray(error.message)) {
            const errorMessages = [...new Set(error.message)];
            setError(errorMessages.join(' '));
          } else {
            setError(error.message);
          }
        },
      },
    );
  };

  if (success) {
    return (
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold">Success!</h1>
        <p className="text-green-500 text-sm text-center text-balance">{success}</p>
        <p className="text-sm">
          Go to{' '}
          <Link to="/login" className="underline underline-offset-4">
            Login
          </Link>
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        className={cn('flex flex-col gap-6', className)}
        {...props}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Reset Password</h1>
        </div>
        <div className="grid gap-3">
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <PasswordInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-3">
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <PasswordInput {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm text-center">{success}</p>}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Resetting password...' : 'Reset password'}
        </Button>
        <div className="text-center text-sm">
          Remember your password?{' '}
          <Link to="/login" className="underline underline-offset-4">
            Login
          </Link>
        </div>
      </form>
    </Form>
  );
}
