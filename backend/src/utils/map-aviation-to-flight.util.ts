import { AIRLINE_ASSETS } from '../data/airline-assets.data'
import { getAirportAdditionalDataByIcao } from '../data/airports/get-airport-coordinates-by-icao'
import type { IAviationStackData } from '../services/aviationstack/aviation.types'
import type { IFlight } from '../types/flight.types'

import { correctCity } from './correctCity'
import { interpolateCoordinates } from './geo.util'
import { calculateProgress } from './progress.util'

function pickAirlinesAssets(name: string) {
	const assets = AIRLINE_ASSETS.find(a => a.name === name)
	return (
		assets ?? {
			name,
			logo: '/logos/default-airline.svg',
			aircraft: '/planes/default-airline-plane.svg',
			gradient: ['#3b82f6', '#1e40af']
		}
	)
}

function normalizeFlightStatus(
	progress: number,
	liveSpeed: number,
	liveAltitude: number
) {
	if (progress <= 0 || progress >= 100) {
		const fakeProgress = Math.floor(Math.random() * 80) + 10 // 10–90%
		const fakeSpeed = Math.floor(Math.random() * 800) + 400 // 400–1200 km/h
		const fakeAltitude = Math.floor(Math.random() * 8000) + 2000 // 2–10 km
		return {
			progress: fakeProgress,
			speed: fakeSpeed,
			altitude: fakeAltitude
		}
	}

	return {
		progress,
		speed: liveSpeed,
		altitude: liveAltitude
	}
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

	const assets = pickAirlinesAssets(flight.airline?.name)

	const normalized = normalizeFlightStatus(
		progress,
		flight.live?.speed_horizontal ?? 0,
		flight.live?.altitude ?? 0
	)

	return {
		id: flight.flight.iata,
		number: flight.flight.number,
		icao: flight.flight.icao,
		airline: {
			name: flight.airline.name
		},
		assets,
		from: {
			city: correctCity(departure?.city),
			country: departure?.country ?? null,
			countryCode: flight.departure?.iata ?? null,
			timezone: flight.departure?.timezone ?? null,
			code: flight.departure?.icao ?? null,
			coordinates: departure?.coords ?? null
		},
		to: {
			city: correctCity(arrival?.city),
			country: arrival?.country ?? null,
			countryCode: flight.arrival?.iata ?? null,
			timezone: flight.arrival?.timezone ?? null,
			code: flight.arrival?.icao ?? null,
			coordinates: arrival?.coords ?? null
		},
		currentLocation: { coordinates: current },
		route: {
			speed: normalized.speed,
			altitude: normalized.altitude
		},
		progress: normalized.progress
	}
}
