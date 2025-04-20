import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ChakraProvider, extendTheme, ThemeConfig } from '@chakra-ui/react'
import { PostHogProvider } from 'posthog-js/react'
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { PostHogConfig } from 'posthog-js'

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const colors = {
  config,
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
}

const theme = extendTheme({ colors })

const queryClient = new QueryClient()

const options = {
  api_host: import.meta.env.VITE_APP_POSTHOG_HOST as string,
  person_profiles: 'always',
  capture_exceptions: true,
} satisfies Partial<PostHogConfig>

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <PostHogProvider apiKey={import.meta.env.VITE_APP_POSTHOG_KEY} options={options}>
        <ChakraProvider theme={theme}>
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen />
        </ChakraProvider>
      </PostHogProvider>
    </QueryClientProvider>
  </StrictMode>,
)
