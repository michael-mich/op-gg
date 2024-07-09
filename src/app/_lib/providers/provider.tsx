'use client';

import { ThemeProvider } from 'next-themes';

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      disableTransitionOnChange
      attribute='class'
      defaultTheme='system'
      enableSystem
    >
      {children}
    </ThemeProvider>
  );
}

export default Provider;