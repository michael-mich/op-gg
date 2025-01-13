'use client'

import { isServer, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TEN_MINUTES } from '@/app/_constants/timeUnits';

const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: TEN_MINUTES,
        gcTime: TEN_MINUTES,
        refetchOnWindowFocus: false,
        retry: 1,
      }
    }
  });
}

let browserQueryClient: QueryClient | undefined;

const getQueryClient = () => {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
}

const ReactQueryProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const queryClient = getQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

export default ReactQueryProvider;