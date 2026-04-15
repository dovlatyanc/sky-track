import { z } from 'zod'

import aviationService from '../../services/aviationstack/aviation.service'
import { mapAviationToFlight } from '../../utils/map-aviation-stack'
import { publicProcedure, router } from '../trpc'

export const flightsRouter = router({
	getLive: publicProcedure
		.input(
			z
				.object({
					limit: z.number().min(1).max(100)
				})
				.optional()
		)
		.query(async ({ input }) => {
			const data = await aviationService.fetchLiveFlights(input?.limit ?? 0 + 3)
			const newData = data?.data
				.filter(f => !!f.flight.iata)
				.map(mapAviationToFlight)
			return newData
		})
})
