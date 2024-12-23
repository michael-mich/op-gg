'use client';

import { ThemeProvider as Provider } from 'next-themes';

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider
      disableTransitionOnChange
      attribute='class'
      defaultTheme='system'
      enableSystem
    >
      {children}
    </Provider>
  );
}

export default ThemeProvider;