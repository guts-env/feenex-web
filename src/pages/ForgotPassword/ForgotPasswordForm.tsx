import { useState } from 'react';
import { Link } from 'react-router-dom';
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
import { Input } from '@/components/ui/input';
import { useForgotPasswordForm } from '@/forms/hooks/useAuthForm';
import { useForgotPassword } from '@/api/services/AuthService/mutation';
import { type IForgotPasswordFormValues } from '@/forms/schema/auth';

export default function ForgotPasswordForm({ className, ...props }: React.ComponentProps<'form'>) {
  const form = useForgotPasswordForm();
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = (data: IForgotPasswordFormValues) => {
    setError(null);
    setSuccess(null);

    forgotPassword(data, {
      onSuccess: () => {
        form.reset();
        setSuccess('A reset link has been sent to your email');
      },
      onError: (error) => {
        setError(error.message);
      },
    });
  };

  return (
    <Form {...form}>
      <form
        className={cn('flex flex-col gap-6', className)}
        {...props}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Forgot Password</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && <p className="text-green-500 text-sm text-center">{success}</p>}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Sending reset link...' : 'Send reset link'}
          </Button>
        </div>
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
