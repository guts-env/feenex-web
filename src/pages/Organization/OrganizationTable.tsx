import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  type ColumnDef,
  type SortingState,
  type PaginationState,
  type Updater,
} from '@tanstack/react-table';
import debounce from 'lodash/debounce';
import startCase from 'lodash/startCase';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Plus, UserRoundPenIcon, Check, X } from 'lucide-react';
import queryClient from '@/api/queryClient';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OrganizationQueryKeys } from '@/api/services/OrganizationService/config';
import OrganizationQuery from '@/api/services/OrganizationService/query';
import InviteMember from '@/pages/Organization/InviteMember';
import RemoveMember from '@/pages/Organization/RemoveMember';
import { useRemoveMember, useUpdateMemberRole } from '@/api/services/OrganizationService/mutation';
import { type IOrganizationMemberRes } from '@/types/api';
import { RoleEnum } from '@/constants/enums';

function OrganizationTable() {
  /* Table State */
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState('');
  /* Modals and Sheets */
  const [inviteMemberModalOpen, setInviteMemberModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<string | undefined>(undefined);
  const [removeMemberId, setRemoveMemberId] = useState<string | undefined>(undefined);
  const [editingRole, setEditingRole] = useState<RoleEnum | undefined>(undefined);

  const { data, isLoading, isError } = useQuery({
    queryKey: OrganizationQueryKeys.members({
      offset: pagination.pageIndex * pagination.pageSize,
      limit: pagination.pageSize,
      search,
    }),
    queryFn: async () => {
      const result = await OrganizationQuery.getMembers({
        offset: pagination.pageIndex * pagination.pageSize,
        limit: pagination.pageSize,
        search,
      });

      await new Promise((resolve) => setTimeout(resolve, 300));
      return result;
    },
  });

  const { mutate: removeMember } = useRemoveMember();
  const { mutate: updateMemberRole } = useUpdateMemberRole();

  const handleSearch = debounce((search: Updater<string>) => {
    setSearch(search);
    setPagination({ ...pagination, pageIndex: 0 });
  }, 500);

  const invalidateOrganizationMemberList = () => {
    queryClient.invalidateQueries({
      queryKey: OrganizationQueryKeys.members({
        offset: pagination.pageIndex * pagination.pageSize,
        limit: pagination.pageSize,
        search,
      }),
    });
  };

  const handleRemove = (id: string) => {
    removeMember(id, {
      onSuccess: () => {
        invalidateOrganizationMemberList();
        toast.success('Organization member removed!');
        setRemoveMemberId(undefined);
      },
      onError: (error) => {
        toast.error('Failed to remove organization member', {
          description: error.message,
        });
      },
    });
  };

  const handleCommitEdit = (memberId: string) => {
    if (!editingRole) return;

    updateMemberRole(
      { id: memberId, data: { role: editingRole } },
      {
        onSuccess: () => {
          invalidateOrganizationMemberList();
          toast.success('Role updated successfully!');
          setMemberToEdit(undefined);
          setEditingRole(undefined);
        },
        onError: (error) => {
          toast.error('Failed to update member role', {
            description: error.message,
          });
        },
      },
    );
  };

  const handleCancelEdit = () => {
    setMemberToEdit(undefined);
    setEditingRole(undefined);
  };

  const columns: ColumnDef<IOrganizationMemberRes>[] = [
    {
      id: 'Name',
      header: 'Name',
      accessorKey: 'firstName',
    },
    {
      id: 'Role',
      header: 'Role',
      cell: ({ row }) => {
        const isEditing = memberToEdit === row.original.id;

        if (isEditing) {
          return (
            <Select
              value={editingRole}
              onValueChange={(value) => setEditingRole(value as RoleEnum)}
            >
              <SelectTrigger className="border-accent">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={RoleEnum.BUSINESS_ADMIN}>Business Admin</SelectItem>
                <SelectItem value={RoleEnum.MANAGER}>Manager</SelectItem>
                <SelectItem value={RoleEnum.MEMBER}>Member</SelectItem>
              </SelectContent>
            </Select>
          );
        }

        const role = row.original.role.name.split('_').join(' ');
        return startCase(role);
      },
    },
    {
      id: 'Email',
      header: 'Email',
      accessorKey: 'email',
    },
    {
      id: 'Joined At',
      header: 'Joined At',
      cell: ({ row }) => format(row.original.joinedAt, 'MMM dd, yyyy'),
    },
  ];

  const columnsWithActions = columns.concat({
    id: 'Actions',
    header: 'Actions',
    accessorKey: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const id = row.original.id;
      const isEditing = memberToEdit === id;

      if (isEditing) {
        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCommitEdit(id)}
              disabled={!editingRole}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleCancelEdit}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        );
      }

      return (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setMemberToEdit(id);
              setEditingRole(row.original.role.name);
            }}
          >
            <UserRoundPenIcon />
          </Button>
          {/* <Button variant="ghostDestructive" size="icon" onClick={() => setRemoveMemberId(id)}>
            <UserRoundXIcon />
          </Button> */}
        </div>
      );
    },
  });

  const emptyState = (
    <div className="flex flex-col items-center justify-center h-full py-8">
      <p className="text-lg text-muted-foreground pb-1">No organization members found.</p>
      <p className="text-sm text-muted-foreground">
        Click "Invite Member" to start inviting members or check the filters
      </p>
      <Button variant="link" onClick={() => setInviteMemberModalOpen(true)} className="mt-4">
        <Plus className="size-4" />
        Invite Member
      </Button>{' '}
    </div>
  );

  return (
    <>
      <DataTable<IOrganizationMemberRes, unknown>
        loading={isLoading}
        error={isError ? 'Failed to fetch organization members' : ''}
        emptyState={emptyState}
        columns={columnsWithActions}
        data={data?.data ?? []}
        pageCount={data?.count ? Math.ceil(data.count / pagination.pageSize) : 0}
        sorting={sorting}
        onSortingChange={setSorting}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        pagination={pagination}
        onPaginationChange={setPagination}
        onSearchChange={(search) => handleSearch(search)}
        searchValue={search}
        searchPlaceholder="Search members..."
        rightSlot={
          <Button onClick={() => setInviteMemberModalOpen(true)}>
            <Plus />
            Invite Member
          </Button>
        }
        hideColumnFilter
      />
      <InviteMember open={inviteMemberModalOpen} onClose={() => setInviteMemberModalOpen(false)} />
      <RemoveMember
        removeMemberId={removeMemberId}
        handleRemove={handleRemove}
        onClose={() => setRemoveMemberId(undefined)}
      />
    </>
  );
}

export default OrganizationTable;
