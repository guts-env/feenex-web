import { useState, useCallback } from 'react';
import { type PaginationState } from '@tanstack/react-table';

interface UsePaginationOnDeleteProps {
  initialPagination: PaginationState;
}

export function usePaginationOnDelete({ initialPagination }: UsePaginationOnDeleteProps) {
  const [pagination, setPagination] = useState<PaginationState>(initialPagination);

  const handleDeleteWithPagination = useCallback(
    ({
      currentPageData,
      onSuccess,
      onError,
    }: {
      currentPageData: unknown[];
      onSuccess?: () => void;
      onError?: (error: { message: string }) => void;
    }) => {
      return {
        onSuccess: () => {
          onSuccess?.();

          const isLastItemOnPage = currentPageData.length === 1;
          const isNotFirstPage = pagination.pageIndex > 0;

          if (isLastItemOnPage && isNotFirstPage) {
            setPagination((prev) => ({
              ...prev,
              pageIndex: prev.pageIndex - 1,
            }));
          }
        },
        onError,
      };
    },
    [pagination.pageIndex],
  );

  return {
    pagination,
    setPagination,
    handleDeleteWithPagination,
  };
}
