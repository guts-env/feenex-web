import { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '@/api/queryClient';
import AppRoutes from '@/components/routes/AppRoutes';
import { ThemeProvider } from '@/components/theme/theme-provider';

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const splashTimeout = setTimeout(() => {
      setShowSplash(false);
    }, 1500);

    return () => {
      clearTimeout(splashTimeout);
    };
  }, []);

  return (
    <ThemeProvider defaultTheme='system' storageKey='feenex-web-theme'>
      <QueryClientProvider client={queryClient}>
        <Router>
          {showSplash ? (
            <p>Replace with splash</p>
          ) : (
            <>
              <Suspense fallback={<p>Replace with splash</p>}>
                <AppRoutes />
              </Suspense>
            </>
          )}
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
