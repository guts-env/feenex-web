import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useShallow } from 'zustand/react/shallow';
import { cn } from '@/lib/utils';
import { formatUserName } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useUserStore } from '@/stores/useUserStore';
import { useSendSupportEmail } from '@/api/services/EmailService/mutation';
import { type ISupportEmailFormValues, SupportEmailSchema } from '@/forms/schema/email';

const SUBJECT_OPTIONS = [
  { value: 'bug_report', label: 'Bug Report' },
  { value: 'feature_request', label: 'Feature Request' },
  { value: 'account_issue', label: 'Account Issue' },
  { value: 'other', label: 'Other' },
] as const;

export default function SupportForm({ className, ...props }: React.ComponentProps<'form'>) {
  const { user } = useUserStore(useShallow((state) => ({ user: state.user })));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const form = useForm<ISupportEmailFormValues>({
    resolver: zodResolver(SupportEmailSchema),
    defaultValues: {
      name: user ? formatUserName(user.firstName, user.lastName, user.middleName) : '',
      email: user?.email || '',
      subject: '',
      customSubject: '',
      message: '',
    },
  });

  const watchedSubject = form.watch('subject');
  const watchedMessage = form.watch('message');

  const { mutate: sendSupportEmail, isPending } = useSendSupportEmail();

  const onSubmit = async (data: ISupportEmailFormValues) => {
    setError(null);
    setSuccess(null);

    sendSupportEmail(data, {
      onSuccess: () => {
        form.reset();
        setSuccess('Support email sent successfully');
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

  if (success) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="text-green-600 text-lg font-medium">Thank you for contacting us!</div>
            <p className="text-muted-foreground">
              We've received your message and will get back to you as soon as possible.
            </p>
            <Button onClick={() => setSuccess(null)} variant="outline">
              Send Another Message
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <p className="text-red-500 text-sm text-center">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form
            className={cn('space-y-6', className)}
            {...props}
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SUBJECT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchedSubject === 'other' && (
              <FormField
                control={form.control}
                name="customSubject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Custom Subject</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Please specify the subject" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Message
                    <span className="text-xs text-muted-foreground ml-2">
                      ({watchedMessage?.length || 0}/2000 characters)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Please describe your issue or question in detail..."
                      className="min-h-[120px]"
                      maxLength={2000}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
