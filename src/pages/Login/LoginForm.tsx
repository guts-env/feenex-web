import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
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
import { useLoginForm } from '@/forms/hooks/useAuthForm';
import { useLogin } from '@/api/services/AuthService/mutation';
import { useUserStore } from '@/stores/useUserStore';
import { type ILoginFormValues } from '@/forms/schema/auth';
import { type ILoginRes } from '@/types/api';

export default function LoginForm({ className, ...props }: React.ComponentProps<'form'>) {
  const navigate = useNavigate();

  const { setUser, setToken } = useUserStore(
    useShallow((state) => ({
      user: state.user,
      token: state.token,
      setUser: state.setUser,
      setToken: state.setToken,
    })),
  );

  const form = useLoginForm();
  const { mutate: login, isPending } = useLogin();

  const [error, setError] = useState<string | null>(null);

  const onSubmit = (data: ILoginFormValues) => {
    setError(null);

    login(data, {
      onSuccess: (data: ILoginRes) => {
        const { user } = data;

        setUser({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          middleName: user.middleName,
          profilePhoto: user.profilePhoto,
          organization: user.organization,
          role: user.role,
        });
        setToken(data.accessToken);
        navigate('/');
      },
      onError: (error) => {
        console.log(error);
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
          <h1 className="text-2xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground text-sm text-balance">Login to your FeeNex account</p>
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
          <div className="grid gap-3">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center">
                    <FormLabel>Password</FormLabel>
                    <Link
                      to="/forgot-password"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Logging in...' : 'Login'}
          </Button>
        </div>
        <div className="text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </form>
    </Form>
  );
}
