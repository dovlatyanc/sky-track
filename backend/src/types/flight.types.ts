import type { TAirlineAssets } from '../data/airline-assets.data'

import type { ICoordinate } from './types'

export interface IFlightRoute {
	speed: number
	altitude: number
}

export interface IFlightLocation {
	city: string | null
	country: string | null
	countryCode: string
	timezone: string
	code: string
	coordinates: ICoordinate | null
}

export interface IFlightAirline {
	name: string
}

export interface IFlight {
	id: string
	number: string
	icao: string
	assets: TAirlineAssets
	route: IFlightRoute
	airline: IFlightAirline
	from: IFlightLocation
	to: IFlightLocation
	progress: number
	currentLocation: Pick<IFlightLocation, 'coordinates'>
}
