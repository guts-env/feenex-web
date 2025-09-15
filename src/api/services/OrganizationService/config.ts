import type { IOrganizationMembersListParams } from '@/types/api';

export const OrganizationQueryKeys = {
  all: 'organization',
  organization: (id: string) => [...OrganizationQueryKeys.all, 'organization', id],
  members: (params: IOrganizationMembersListParams) => [
    ...OrganizationQueryKeys.all,
    'members',
    params,
  ],
  // member: (id: string) => [...OrganizationQueryKeys.all, 'member', id],
};

export const OrganizationEndpoints = {
  get: (id: string) => `/organizations/${id}`,
  update: (id: string) => `/organizations/${id}`,
  getMembers: () => '/organizations/members',
  updateMemberRole: (id: string) => `/organizations/${id}/member-role`,
  // getMember: (id: string) => `/organizations/${id}/members`,
  removeMember: (id: string) => `/organizations/${id}/members`,
};
