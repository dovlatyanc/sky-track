import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { type ReactNode, useState } from 'react'
import superjson from 'superjson'

import { trpc } from '@/lib/trpc'

// Получаем URL из переменной окружения
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5174'

export function TrpcProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: false,
            staleTime: 1000 * 60 * 2 // 2 minutes
          }
        }
      })
  )

  const [client] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${BACKEND_URL}/trpc`,
          transformer: superjson,
          headers() {
            const token = localStorage.getItem('token')
            return token ? { Authorization: `Bearer ${token}` } : {}
          },
        })
      ]
    })
  )

  return (
    <trpc.Provider client={client} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}