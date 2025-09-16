import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { cn } from "@/lib/utils"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAcceptInviteForm } from '@/forms/hooks/useAuthForm'
import { useAcceptInvite } from '@/api/services/AuthService/mutation';
import { type IAcceptInviteFormValues } from '@/forms/schema/auth';

export default function AcceptInviteForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [searchParams] = useSearchParams();

  const form = useAcceptInviteForm();
  const { mutate: acceptInvite, isPending } = useAcceptInvite();

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = (data: IAcceptInviteFormValues) => {
    setError(null);
    setSuccess(null);

    acceptInvite({
      inviteToken: searchParams.get('inviteToken')!,
      ...data,
    }, {
      onSuccess: () => {
        form.reset();
        setSuccess('You have joined the organization!');
      },
      onError: (error) => {
        if (Array.isArray(error.message)) {
          const errorMessages = [...new Set(error.message)];
          setError(errorMessages.join(' '));
        } else {
          setError(error.message);
        }
      },
    });
  };

  return (
    <Form {...form}>
      <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Join Organization</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Create your Feenex account to join the organization
          </p>
        </div>
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid gap-3 items-start">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-3 items-start">
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-3 items-start">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-3 items-start">
              <FormField
                control={form.control}
                name="middleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Middle Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-3 items-start">
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && <p className="text-green-500 text-sm text-center">{success}</p>}
          <Button type="submit" className="w-1/2 mx-auto" disabled={isPending}>
            {isPending ? 'Joining...' : 'Join Organization'}
          </Button>
        </div>
        <div className="text-center text-sm">
          Already registered?{" "}
          <Link to="/login" className="underline underline-offset-4">
            Login
          </Link>
        </div>
      </form>
    </Form>
  )
}
