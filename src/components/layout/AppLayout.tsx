import { Outlet } from 'react-router-dom';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SiteHeader } from '@/components/layout/site-header';
import { useTheme } from '@/components/theme/theme-provider';
import { Toaster, type ToasterProps } from 'sonner';

function AppLayout() {
  const { theme = 'system' } = useTheme();

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset className="p-4 relative">
            <Outlet />
            <Toaster
              richColors
              closeButton
              theme={theme as ToasterProps['theme']}
              position="bottom-left"
              className="!fixed !bottom-4 !left-[calc(var(--sidebar-width)+1rem)]"
            />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}

export default AppLayout;
