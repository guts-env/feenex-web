import { format } from 'date-fns';
import { MoreHorizontal, UserRoundPenIcon, Check, X } from 'lucide-react';
import startCase from 'lodash/startCase';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type IOrganizationMemberRes } from '@/types/api';
import { RoleEnum } from '@/constants/enums';

interface OrganizationCardProps {
  member: IOrganizationMemberRes;
  onEdit: () => void;
  isEditing: boolean;
  editingRole: RoleEnum | undefined;
  onRoleChange: (role: RoleEnum) => void;
  onCommitEdit: () => void;
  onCancelEdit: () => void;
}

export function OrganizationCard({
  member,
  onEdit,
  isEditing,
  editingRole,
  onRoleChange,
  onCommitEdit,
  onCancelEdit,
}: OrganizationCardProps) {
  const role = member.role.name.split('_').join(' ');

  return (
    <div className="border rounded-lg p-4 bg-card">
      {/* Top Row - Name and Actions */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="font-medium text-base">{member.firstName}</h3>
        </div>

        {/* Actions */}
        {isEditing ? (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onCommitEdit}
              disabled={!editingRole}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onCancelEdit}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open member actions</span>
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <UserRoundPenIcon className="mr-2 h-4 w-4" />
                Edit Role
              </DropdownMenuItem>
              {/* Uncomment when remove functionality is needed
              <DropdownMenuItem onClick={onRemove}>
                <UserRoundXIcon className="mr-2 h-4 w-4" />
                Remove
              </DropdownMenuItem>
              */}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Content */}
      <div className="space-y-1 text-sm text-muted-foreground">
        <div className="flex items-baseline gap-2">
          Role: {isEditing ? (
            <Select
              value={editingRole}
              onValueChange={(value) => onRoleChange(value as RoleEnum)}
            >
              <SelectTrigger className="border-accent w-auto">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={RoleEnum.BUSINESS_ADMIN}>Business Admin</SelectItem>
                <SelectItem value={RoleEnum.MANAGER}>Manager</SelectItem>
                <SelectItem value={RoleEnum.MEMBER}>Member</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Badge variant="secondary" className="text-xs">
              {startCase(role)}
            </Badge>
          )}
        </div>
        <div>Email: {member.email}</div>
        <div>Joined: {format(new Date(member.joinedAt), 'MMM dd, yyyy')}</div>
      </div>
    </div>
  );
}