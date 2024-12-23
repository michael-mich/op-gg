'use client'

import { isServer, QueryClient, QueryClientProvider } from '@tanstack/react-query'

const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 3_600_000, // 1 hour
        gcTime: 600_000, // 10 minutes
        refetchOnWindowFocus: false,
      }
    }
  });
}

let browserQueryClient: QueryClient | undefined;

const getQueryClient = () => {
  if (isServer) {
    return makeQueryClient();
  }
  else {
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