import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider as ThemeProviderImpl } from 'next-themes'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
})

export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProviderImpl attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProviderImpl>
    </QueryClientProvider>
  )
}
