import { useMemo } from 'react'
import { useSearchParams } from 'react-router'

import { QUERY_PARAM_FLIGHT } from '../flight-list/flights.constants'
import { FLIGHTS } from '../flight-list/flights.data'

import { FlightActions } from './FlightActions'
import { FlightHeader } from './FlightHeader'
import { FlightImage } from './FlightImage'
import { FlightInformation } from './FlightInformation'
import { FlightRoute } from './FlightRoute'
import { FlightSchedule } from './FlightSchedule'
import { FlightStatus } from './FlightStatus'

export function FlightDetails() {
	const [searchParams] = useSearchParams()
	const selectedFlight = searchParams.get(QUERY_PARAM_FLIGHT)

	const flight = useMemo(
		() => FLIGHTS.find(flight => flight.id === selectedFlight),
		[selectedFlight]
	)

	if (!flight) return null

	return (
		<aside
			className='absolute top-7 right-7 w-sm overflow-hidden rounded-xl bg-[#101010]'
			// style={{
			// 	height: 'calc(100% - 56px)'
			// }}
		>
			<FlightHeader flight={flight} />
			<FlightImage flight={flight} />

			<div className='p-3.5'>
				<FlightRoute flight={flight} />
				<FlightStatus progress={flight.progress} />
				<FlightSchedule />

				<FlightInformation flight={flight} />

				<FlightActions
					onRoute={() => {}}
					onFollow={() => {}}
					onShare={() => {}}
					onMore={() => {}}
				/>
			</div>
		</aside>
	)
}
