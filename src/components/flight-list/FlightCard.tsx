import { useSearchParams } from 'react-router'

import { cn } from '@/lib/utils'

import { FlightCardActions } from './actions/FlightCardActions'
import { QUERY_PARAM_FLIGHT } from './flights.constants'
import { AIRLINE_IMAGES } from '@/data/airline-images.data'
import type { IFlightData } from '@/services/external/aviation/aviation.types'

interface Props {
	flight: IFlightData
}

export function FlightCard({ flight }: Props) {
	const [searchParams, setSearchParams] = useSearchParams()
	const selectedFlight = searchParams.get(QUERY_PARAM_FLIGHT)

	const isActive = selectedFlight === flight.flight.number

	const images = AIRLINE_IMAGES.find(i => i.name === flight.airline.name)

	return (
		<div
			// TODO: add this gradient to tailwind css variables
			className={cn(
				'group animate-fadeIn relative w-full rounded-lg p-0.5 shadow-xl transition-colors ease-in',
				isActive
					? 'bg-gradient-to-r from-rose-500 to-orange-400'
					: 'bg-flight-card'
			)}
		>
			<FlightCardActions flightId={flight.flight.number} />
			<button
				onClick={() => {
					setSearchParams({
						[QUERY_PARAM_FLIGHT]: flight.flight.number
					})
				}}
				className={cn('bg-flight-card block h-full w-full rounded-lg p-4')}
			>
				<div className='mb-7 flex items-center justify-between'>
					<div className='flex items-center gap-3'>
						<img
							src={images?.logo || ''}
							alt={flight.airline.name}
							width={40}
							height={40}
							className='rounded-full bg-white'
						/>
						<span>{flight.flight.number}</span>
					</div>
					<div>
						<span className='bg-card rounded-xl px-2 py-1'>
							{flight?.aircraft?.registration}
						</span>
					</div>
				</div>

				<div className='grid grid-cols-[1fr_5fr_1fr] items-end gap-4'>
					<div className='space-y-0.5 text-left'>
						{/* TODO: need to add city names */}
						{/* <div>{flight.from.city}</div> */}
						<div className='text-3xl font-semibold'>
							{flight.departure.iata}
						</div>
					</div>

					<div className='mb-4'>
						{/* TODO: Need calculate */}
						{/* <ProgressBar percentage={flight.progress} /> */}
					</div>

					<div>
						{/* <div>{flight.to.city}</div> */}
						<div className='text-3xl font-semibold'>{flight.arrival.iata}</div>
					</div>
				</div>
			</button>
		</div>
	)
}
