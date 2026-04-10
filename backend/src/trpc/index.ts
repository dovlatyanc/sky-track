import type { inferRouterOutputs } from '@trpc/server'

import { flightsRouter } from './routers/flights.router'
import { router } from './trpc'

export const appRouter = router({
	flights: flightsRouter
})

export type TAppRouter = typeof appRouter
export type TRouterOutput = inferRouterOutputs<TAppRouter>
