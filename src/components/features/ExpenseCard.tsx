import { useState, useEffect, useRef } from 'react';
import { MoreHorizontal, Loader2, Receipt } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useShallow } from 'zustand/react/shallow';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ExpenseStatusBadge from '@/pages/Expenses/ExpenseStatusBadge';
import { ExpenseStatusEnum, RoleEnum } from '@/constants/enums';
import { type IExpenseRes } from '@/types/api';
import { useUserStore } from '@/stores/useUserStore';
import { useDownloadPresigned } from '@/api/services/UploadService/mutation';

interface ExpenseCardProps {
  expense: IExpenseRes;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onVerify: () => void;
}

export function ExpenseCard({ expense, onView, onEdit, onDelete, onVerify }: ExpenseCardProps) {
  const isProcessing = expense.processingStatus === 'processing';
  const { user } = useUserStore(useShallow((state) => ({ user: state.user })));
  const cardRef = useRef<HTMLDivElement>(null);
  const [isInViewport, setIsInViewport] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const { mutate: getDownloadPresigned } = useDownloadPresigned();

  const userRole = user?.role.name;
  const isAdmin = userRole === RoleEnum.BUSINESS_ADMIN || userRole === RoleEnum.PERSONAL_ADMIN;
  const isManager = userRole === RoleEnum.MANAGER;
  const isMember = userRole === RoleEnum.MEMBER;

  const canVerify = isAdmin || isManager;
  const canDelete =
    isAdmin || isManager || (isMember && expense.status !== ExpenseStatusEnum.VERIFIED);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInViewport(entry.isIntersecting);
      },
      { threshold: 0.1 },
    );

    const currentRef = cardRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  useEffect(() => {
    if (isInViewport && expense.photos && expense.photos.length > 0 && imageUrls.length === 0) {
      getDownloadPresigned(
        { keys: expense.photos },
        {
          onSuccess: (data) => {
            setImageUrls(data.map((item) => item.url));
          },
          onError: (error) => {
            console.error('Failed to fetch images:', error);
          },
        },
      );
    }
  }, [isInViewport, expense.photos, imageUrls.length, getDownloadPresigned]);

  return (
    <div ref={cardRef} className="border rounded-lg p-4 bg-card">
      {/* Top Row - Badges and Actions */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isProcessing ? (
            <>
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
            </>
          ) : (
            <>
              {expense.status && <ExpenseStatusBadge status={expense.status} />}
              {expense.category?.name ? (
                <Badge variant="secondary" className="text-xs">
                  {expense.category.name}
                </Badge>
              ) : (
                <span className="text-xs text-muted-foreground">No category</span>
              )}
            </>
          )}
        </div>

        {/* Actions Dropdown */}
        {isProcessing ? (
          <Skeleton className="h-5 w-5 rounded" />
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open expense actions</span>
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onView}>View</DropdownMenuItem>
              {canVerify && expense.status !== ExpenseStatusEnum.VERIFIED && (
                <DropdownMenuItem onClick={onVerify}>Verify</DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
              {canDelete && <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3">
          <>
            {/* Content Row */}
            <div className="flex gap-3">
              {/* Image Thumbnail */}
              <div className="relative w-16 h-16 flex-shrink-0">
                {isProcessing ? (
                  <Skeleton className="w-full h-full rounded-lg" />
                ) : expense.photos && expense.photos.length > 0 ? (
                  <>
                    {imageUrls.length > 0 ? (
                      <img
                        src={imageUrls[0]}
                        alt="Receipt thumbnail"
                        className="w-full h-full object-cover rounded-lg border"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted rounded-lg border flex items-center justify-center">
                        <Loader2 className="size-4 animate-spin text-muted-foreground" />
                      </div>
                    )}
                    {expense.photos.length > 1 && (
                      <Badge className="absolute -bottom-1 -left-1 w-5 h-5 rounded-full text-center z-10 p-0 flex items-center justify-center">
                        {expense.photos.length}
                      </Badge>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                    <Receipt className="size-8 text-primary" />
                  </div>
                )}
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                {/* Amount and Merchant Name */}
                <div>
                  {isProcessing ? (
                    <div className="text-lg font-semibold text-muted-foreground">Processing...</div>
                  ) : (
                    <div className="text-lg font-semibold text-white">
                      {Intl.NumberFormat('ph-PH', { style: 'currency', currency: 'PHP' }).format(
                        expense.amount,
                      )}
                    </div>
                  )}
                  {isProcessing ? (
                    <Skeleton className="h-5 w-32 mt-1" />
                  ) : (
                    <h3 className="font-medium text-base line-clamp-1 text-muted-foreground mt-1">
                      {expense.merchantName}
                    </h3>
                  )}
                </div>
              </div>
            </div>

            {/* Separator */}
            <div className="border-t mt-3 pt-3 -mx-4">
              {/* OR Number and VAT at Bottom */}
              <div className="flex justify-between text-sm text-muted-foreground px-4">
                {isProcessing ? (
                  <>
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </>
                ) : (
                  <>
                    <span>OR: {expense.orNumber || '-'}</span>
                    <span>
                      VAT:{' '}
                      {expense.vat
                        ? Intl.NumberFormat('ph-PH', { style: 'currency', currency: 'PHP' }).format(
                            expense.vat,
                          )
                        : '-'}
                    </span>
                  </>
                )}
              </div>
            </div>
        </>
      </div>
    </div>
  );
}
