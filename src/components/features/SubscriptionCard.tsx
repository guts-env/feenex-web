import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import SubscriptionStatusBadge from '@/pages/Subscriptions/SubscriptionStatusBadge';
import { type ISubscriptionRes } from '@/types/api';

interface SubscriptionCardProps {
  subscription: ISubscriptionRes;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function SubscriptionCard({ subscription, onView, onEdit, onDelete }: SubscriptionCardProps) {
  return (
    <div className="border rounded-lg p-4 bg-card">
      {/* Top Row - Badges and Actions */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <SubscriptionStatusBadge status={subscription.status} />
          {subscription.category?.name ? (
            <Badge variant="secondary" className="text-xs">
              {subscription.category.name}
            </Badge>
          ) : (
            <span className="text-xs text-muted-foreground">No category</span>
          )}
        </div>

        {/* Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open subscription actions</span>
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onView}>View</DropdownMenuItem>
            <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Amount and Merchant Name */}
        <div>
          <div className="text-lg font-semibold text-white">
            {Intl.NumberFormat('ph-PH', { style: 'currency', currency: 'PHP' }).format(
              subscription.amount,
            )}
          </div>
          <h3 className="font-medium text-base line-clamp-1 text-muted-foreground mt-1">
            {subscription.merchantName}
          </h3>
        </div>

        {/* Separator */}
        <div className="border-t mt-3 pt-3 -mx-4">
          {/* Next Billing and VAT */}
          <div className="flex justify-between text-sm text-muted-foreground px-4">
            <span>Next Billing: {format(new Date(subscription.billingDate), 'MMM dd')}</span>
            <span>VAT: {subscription.vat ? Intl.NumberFormat('ph-PH', { style: 'currency', currency: 'PHP' }).format(subscription.vat) : '-'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}