import { z } from 'zod'
import aviationService from '../../services/aviationstack/aviation.service'
import { mapAviationToFlight } from '../../utils/map-aviation-stack'
import { publicProcedure, router } from '../trpc'
import { MOCK_FLIGHTS } from '../../data/mock-flights'

export const flightsRouter = router({
	getLive: publicProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(100).nullish(),
				cursor: z.number().min(0).nullish(),
				airlineName: z.string().optional()
			})
		)
		.query(async ({ input }) => {
			const limit = input.limit ?? 10
			const offset = input.cursor ?? 0

			try {
				const data = await aviationService.fetchLiveFlights(
					limit,
					offset,
					input.airlineName
				)

				// Если API вернул пустой ответ или нет данных
				if (!data?.data || data.data.length === 0) {
					console.log('⚠️ No flights from API, using mock data')
					return getMockFlightsResponse(limit, offset, input.airlineName)
				}

				const newData = data?.data
					.filter(f => !!f.flight.iata && !!f.departure.icao && !!f.arrival.icao)
					.map(mapAviationToFlight)
					.filter(f => f !== null && f.progress > 0 && f.progress < 100)

				const uniqueFlights = Array.from(
					new Map(newData.map(f => [f?.id, f])).values()
				)

				// Если после фильтрации нет рейсов — используем моки
				if (uniqueFlights.length === 0) {
					console.log('⚠️ No flights in air, using mock data')
					return getMockFlightsResponse(limit, offset, input.airlineName)
				}

				return {
					items: uniqueFlights,
					nextCursor: offset + limit
				}
			} catch (error) {
				console.error('❌ AviationStack API error, using mock data:', error)
				return getMockFlightsResponse(limit, offset, input.airlineName)
			}
		})
})

// Helper функция для возврата моковых данных
function getMockFlightsResponse(limit: number, offset: number, airlineName?: string) {
	let filteredFlights = [...MOCK_FLIGHTS]
	
	// Фильтрация по авиакомпании если указана
	if (airlineName) {
		filteredFlights = filteredFlights.filter(
			f => f.airline.name.toLowerCase() === airlineName.toLowerCase()
		)
	}
	
	// Пагинация
	const paginatedFlights = filteredFlights.slice(offset, offset + limit)
	
	return {
		items: paginatedFlights,
		nextCursor: offset + limit < filteredFlights.length ? offset + limit : null
	}
}