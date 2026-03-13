export interface IFlightAirplane {
	image: string
	name: string
}

export interface IFlightRoute {
	speed: number
	altitude: number
}

export interface IFlightLocation {
	city: string
	country: string
	countryCode: string
	timezone: string
	code: string
}

export interface IFlightAirline {
	name: string
	country: string
}

export interface IFlight {
	id: string
	route: IFlightRoute
	airline: IFlightAirline
	airplane: IFlightAirplane
	logo: string
	colorGradient: [string, string]
	aircraftReg: string
	from: IFlightLocation
	to: IFlightLocation
	progress: number
}
