import { Outlet } from 'react-router-dom';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SiteHeader } from '@/components/layout/site-header';
import { useTheme } from '@/components/theme/theme-provider';
import { Toaster, type ToasterProps } from 'sonner';
import { OnboardingProvider } from '@/components/help-center/OnboardingProvider';
import { OnboardingTour } from '@/components/help-center/OnboardingTour';
import { AuthIntegration } from '@/components/help-center/AuthIntegration';
import { ContextualOnboarding } from '@/components/help-center/ContextualOnboarding';

function AppLayout() {
  const { theme = 'system' } = useTheme();

  return (
    <OnboardingProvider>
      {/* Auth integration for automatic role setting */}
      <AuthIntegration />

      {/* Contextual onboarding based on current page - DISABLED FOR PRODUCTION */}
      {/* <ContextualOnboarding /> */}

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

      {/* Global onboarding tour */}
      <OnboardingTour />
    </OnboardingProvider>
  );
}

export default AppLayout;
