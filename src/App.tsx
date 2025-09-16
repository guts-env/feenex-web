import { lazy, Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '@/api/queryClient';
import { ThemeProvider } from '@/components/theme/theme-provider';

const delayedSplash = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1200);
  });
};

const AppRoutes = lazy(async () => {
  await delayedSplash();
  return import('@/components/routes/AppRoutes');
});

export const Splash = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <img src="/logo.webp" alt="Logo" className="size-12" />
      <p className="ml-2 text-3xl font-medium text-primary dark:text-white">Feenex</p>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="WEB_THEME">
      <QueryClientProvider client={queryClient}>
        <Router>
          <Suspense fallback={<Splash />}>
            <AppRoutes />
          </Suspense>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
