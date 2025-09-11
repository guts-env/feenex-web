import { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '@/api/queryClient';
import AppRoutes from '@/components/routes/AppRoutes';
import { ThemeProvider } from '@/components/theme/theme-provider';

const App = () => {

  return (
    <ThemeProvider defaultTheme='system' storageKey='feenex-web-theme'>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Suspense fallback={<p>Replace with splash</p>}>
            <AppRoutes />
          </Suspense>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
