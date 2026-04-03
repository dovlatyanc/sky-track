import { Plane } from 'lucide-react'
import { useMemo } from 'react'

import { getAirportAdditionalData } from '../map/get-airport-coortinates-by-icao'

import { getUtcOffsetFromTimezone } from './getAirportUtc'
import type { IFlightData } from '@/services/external/aviation/aviation.types'

export function FlightRoute({ flight }: { flight: IFlightData }) {
	const departureAirport = useMemo(
		() => getAirportAdditionalData(flight.departure.icao),
		[flight.departure.icao]
	)

	const arrivalAirport = useMemo(
		() => getAirportAdditionalData(flight.arrival.icao),
		[flight.arrival.icao]
	)

	return (
		<div className='relative mb-1 grid grid-cols-2 gap-1'>
			<div className='bg-card p-element xs:p-4 rounded-tl-xl text-center'>
				<h3 className='xs:text-3xl mb-1.5 text-4xl font-semibold'>
					{flight.departure.iata}
				</h3>
				<p className='xs:text-base text-foreground/80 mb-1 text-lg font-medium'>
					{departureAirport?.city}
				</p>
				<p className='xs:text-xs text-foreground/60 text-sm font-medium'>
					{getUtcOffsetFromTimezone(flight.departure.timezone)}
				</p>
			</div>

			<div className='xs:size-10 bg-popover absolute top-1/2 left-1/2 mb-2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full'>
				<Plane className='xs:size-5 text-amber-400' size={22} />
			</div>

			<div className='bg-card p-element xs:p-4 rounded-tr-xl text-center'>
				<h3 className='xs:text-3xl mb-1.5 text-4xl font-semibold'>
					{flight.arrival.iata}
				</h3>
				<p className='xs:text-base text-foreground/80 mb-1 text-lg font-medium'>
					{arrivalAirport?.city}
				</p>
				<p className='xs:text-xs text-foreground/60 text-sm font-medium'>
					{getUtcOffsetFromTimezone(flight.arrival.timezone)}
				</p>
			</div>
		</div>
	)
}
