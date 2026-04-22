import { z } from 'zod'

import aviationService from '../../services/aviationstack/aviation.service'
import { mapAviationToFlight } from '../../utils/map-aviation-stack'
import { publicProcedure, router } from '../trpc'

export const flightsRouter = router({
	getLive: publicProcedure
		.input(
			z
				.object({
					limit: z.number().min(1).max(100),
					airlineName: z.string().optional()
				})
				.optional()
		)
		.query(async ({ input }) => {
			const limit = (input?.limit ?? 0) + 3
			const data = await aviationService.fetchLiveFlights(
				limit,
				input?.airlineName
			)
			const newData = data?.data
				.filter(f => !!f.flight.iata && !!f.departure.icao && !!f.arrival.icao)
				.map(mapAviationToFlight)
			return newData
		})
})
