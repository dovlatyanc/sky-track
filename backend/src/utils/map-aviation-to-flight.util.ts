import { AIRLINE_IMAGES } from '../data/airline-images.data'
import { getAirportAdditionalDataByIcao } from '../data/airports/get-airport-coortinates-by-icao'
import type { IAviationStackData } from '../services/aviationstack/aviation.types'
import type { IFlight } from '../types/flight.types'

import { interpolateCoordinates } from './geo.util'
import { calculateProgress } from './progress.util'

function pickAirlinesAssets(name: string) {
	const assets = AIRLINE_IMAGES.find(a => a.name === name)
	return assets ?? null
}

export function mapAviationToFlight(flight: IAviationStackData): IFlight {
	const departure = getAirportAdditionalDataByIcao(flight.departure?.icao)
	const arrival = getAirportAdditionalDataByIcao(flight.arrival?.icao)

	const progress =
		flight.departure.scheduled && flight.arrival.scheduled
			? calculateProgress(flight.departure.scheduled, flight.arrival.scheduled)
			: 0

	const current =
		departure?.coords && arrival?.coords
			? interpolateCoordinates(departure.coords, arrival.coords, progress)
			: null

	const assets = pickAirlinesAssets(flight.airline?.name || '')

	return {
		id:
			flight.flight?.icao ??
			flight.flight?.iata ??
			flight.flight?.number ??
			'UNKNOWN',
		airline: {
			name: flight.airline?.name ?? 'Unknown',
			country: arrival?.country ?? departure?.country ?? 'Unknown'
		},
		logo: assets?.logo ?? null,
		airplane: {
			image: assets?.aircraft ?? null,
			name: flight.aircraft?.icao ?? flight.aircraft?.iata ?? 'Unknown'
		},
		aircraftReg: flight.aircraft?.registration ?? 'N/A',
		colorGradient: ['#cbd5e1', '#64748b'], // Default
		route: {
			speed: flight.live?.speed_horizontal ?? 0,
			altitude: flight.live?.altitude ?? 0
		},
		from: {
			city: departure?.city ?? null,
			country: departure?.country ?? null,
			countryCode: flight.departure?.iata ?? null,
			timezone: flight.departure?.timezone ?? null,
			code: flight.departure?.icao ?? null,
			coordinates: departure?.coords ?? null
		},
		to: {
			city: arrival?.city ?? null,
			country: arrival?.country ?? null,
			countryCode: flight.arrival?.iata ?? null,
			timezone: flight.arrival?.timezone ?? null,
			code: flight.arrival?.icao ?? null,
			coordinates: arrival?.coords ?? null
		},
		progress,
		currentLocation: { coordinates: current }
	}
}
