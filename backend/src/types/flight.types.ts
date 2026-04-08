import type { ICoordinate } from './types'

export interface IFlightAirplane {
	image: string | null
	name: string
}

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
	country: string
}

export interface IFlight {
	id: string
	route: IFlightRoute
	airline: IFlightAirline
	airplane: IFlightAirplane | null
	logo: string | null
	colorGradient: [string, string] | null
	aircraftReg: string
	from: IFlightLocation
	to: IFlightLocation
	progress: number
	currentLocation: Pick<IFlightLocation, 'coordinates'>
}
