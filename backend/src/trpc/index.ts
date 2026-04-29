import type { inferRouterOutputs } from '@trpc/server'

import { airlinesRouter } from './routers/airlines.router'
import { countriesRouter } from './routers/countries.router'
import { flightsRouter } from './routers/flights.router'
import { ticketsRouter } from './routers/tickets.router'
import { router } from './trpc'

export const appRouter = router({
	flights: flightsRouter,
	countries: countriesRouter,
	airlines: airlinesRouter,
	tickets: ticketsRouter
})

export type TAppRouter = typeof appRouter
export type TRouterOutput = inferRouterOutputs<TAppRouter>
