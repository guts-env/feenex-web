import React, { useMemo } from 'react';
import {
  LayoutGridIcon,
  CommandIcon,
  ReceiptTextIcon,
  Settings2Icon,
  Building2Icon,
  BanknoteArrowDownIcon,
  SendIcon,
  HelpCircleIcon,
} from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import capitalize from 'lodash/capitalize';
import { NavMain } from '@/components/layout/nav-main';
// import { NavProjects } from "@/components/layout/nav-projects"
import { NavSecondary } from '@/components/layout/nav-secondary';
import { NavUser } from '@/components/layout/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useUserStore } from '@/stores/useUserStore';
import { RoleEnum } from '@/constants/enums';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Dashboard',
      url: '/',
      icon: LayoutGridIcon,
      allowedRoles: [RoleEnum.BUSINESS_ADMIN, RoleEnum.PERSONAL_ADMIN],
    },
    {
      title: 'Expenses',
      url: '/expenses',
      icon: ReceiptTextIcon,
    },
    {
      title: 'Subscriptions',
      url: '/subscriptions',
      icon: BanknoteArrowDownIcon,
      allowedRoles: [RoleEnum.BUSINESS_ADMIN, RoleEnum.PERSONAL_ADMIN],
    },
    {
      title: 'Organization',
      url: '/organization',
      icon: Building2Icon,
      allowedRoles: [RoleEnum.BUSINESS_ADMIN],
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: Settings2Icon,
      allowedRoles: [RoleEnum.BUSINESS_ADMIN, RoleEnum.PERSONAL_ADMIN],
    },
  ],
  navSecondary: [
    {
      title: 'Support',
      url: '/support',
      icon: SendIcon,
    },
    {
      title: 'Help Center',
      url: '/help-center',
      icon: HelpCircleIcon,
    },
  ],
  projects: [
    // {
    //   name: "Design Engineering",
    //   url: "#",
    //   icon: Frame,
    // },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUserStore(useShallow((state) => ({ user: state.user })));

  const filteredNavMain = useMemo(
    () =>
      data.navMain.filter((item) => {
        if (!item.allowedRoles) return true;
        return item.allowedRoles?.includes(user?.role.name || RoleEnum.MEMBER);
      }),
    [user],
  );

  return (
    <Sidebar className="top-(--header-height) h-[calc(100svh-var(--header-height))]!" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-transparent active:bg-transparent"
              asChild
            >
              <div>
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <CommandIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.organization?.name || 'No Organization'}</span>
                  <span className="truncate text-xs">{user?.organization?.type ? capitalize(user.organization.type) : 'Unknown'}</span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredNavMain} />
        {/* <NavProjects projects={data.projects} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
