import { useState } from 'react';
import { format } from 'date-fns';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { History } from 'lucide-react';
import SubscriptionStatusBadge from '@/pages/Subscriptions/SubscriptionStatusBadge';
import capitalize from 'lodash/capitalize';
import type { ISubscriptionDetailsProps } from '@/types/subscriptions';

function SubscriptionDetailsContent({
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

export default function SubscriptionDetails({
  subscription,
  open,
  onOpenChange,
}: ISubscriptionDetailsProps) {
  const [auditTrailDrawerOpen, setAuditTrailDrawerOpen] = useState(false);

  return (
    <Sheet
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setTimeout(() => {
            setAuditTrailDrawerOpen(false);
          }, 500);
        }
        onOpenChange(isOpen);
      }}
    >
      <SheetContent
        side="right"
        className="w-full sm:max-w-[600px] overflow-hidden p-0 flex flex-col gap-0"
      >
        <div className="flex flex-1 overflow-hidden">
          <div className="w-full flex flex-col">
            <SheetHeader className="border-b p-6 flex-shrink-0">
              <div className="flex items-center gap-2">
                <SheetTitle>Subscription Details</SheetTitle>
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex flex-col gap-6">
                <SubscriptionDetailsContent
                  title="Subscription"
                  content={subscription?.merchantName ?? '-'}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SubscriptionDetailsContent
                    title="Amount"
                    content={Intl.NumberFormat('ph-PH', {
                      style: 'currency',
                      currency: 'PHP',
                    }).format(subscription?.amount ?? 0)}
                  />
                  <SubscriptionDetailsContent
                    title="VAT"
                    content={
                      subscription?.isVat
                        ? Intl.NumberFormat('ph-PH', {
                            style: 'currency',
                            currency: 'PHP',
                          }).format(subscription?.vat ?? 0)
                        : 'Non-VAT'
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SubscriptionDetailsContent
                    title="Status"
                    content={
                      subscription?.status ? (
                        <SubscriptionStatusBadge status={subscription.status} />
                      ) : (
                        '-'
                      )
                    }
                  />
                  <SubscriptionDetailsContent
                    title="Category"
                    content={
                      subscription?.category?.name ? (
                        <Badge variant="secondary">{subscription.category.name}</Badge>
                      ) : (
                        '-'
                      )
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SubscriptionDetailsContent
                    title="Start Date"
                    content={
                      subscription?.startDate
                        ? format(new Date(subscription.startDate), 'MMM dd, yyyy')
                        : '-'
                    }
                  />
                  <SubscriptionDetailsContent
                    title="End Date"
                    content={
                      subscription?.endDate
                        ? format(new Date(subscription.endDate), 'MMM dd, yyyy')
                        : '-'
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <SubscriptionDetailsContent
                    title="Frequency"
                    content={subscription?.frequency ? capitalize(subscription.frequency) : '-'}
                  />
                  <SubscriptionDetailsContent
                    title="Next Billing"
                    content={
                      subscription?.billingDate
                        ? format(new Date(subscription.billingDate), 'MMM dd, yyyy')
                        : '-'
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:block border-t p-4 flex-shrink-0">
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <AuditTrailItem
                label="Created"
                user={subscription?.createdBy?.firstName}
                date={
                  subscription?.createdAt
                    ? format(new Date(subscription.createdAt), 'MMM dd, yyyy hh:mm a')
                    : undefined
                }
              />
              <AuditTrailItem
                label="Updated"
                user={subscription?.updatedBy?.firstName}
                date={
                  subscription?.updatedAt
                    ? format(new Date(subscription.updatedAt), 'MMM dd, yyyy hh:mm a')
                    : undefined
                }
              />
            </div>
          </div>
        </div>

        <div className="md:hidden border-t flex-shrink-0">
          <Drawer open={auditTrailDrawerOpen} onOpenChange={setAuditTrailDrawerOpen}>
            <DrawerTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-4 h-auto font-normal">
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  <span className="text-sm font-medium">View Audit Trail</span>
                </div>
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="p-4 pb-8">
                <div className="flex flex-col gap-3">
                  <AuditTrailItem
                    label="Created"
                    user={subscription?.createdBy?.firstName}
                    date={
                      subscription?.createdAt
                        ? format(new Date(subscription.createdAt), 'MMM dd, yyyy hh:mm a')
                        : undefined
                    }
                  />
                  <AuditTrailItem
                    label="Updated"
                    user={subscription?.updatedBy?.firstName}
                    date={
                      subscription?.updatedAt
                        ? format(new Date(subscription.updatedAt), 'MMM dd, yyyy hh:mm a')
                        : undefined
                    }
                  />
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </SheetContent>
    </Sheet>
  );
}