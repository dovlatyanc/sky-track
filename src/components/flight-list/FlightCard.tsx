import { useSearchParams } from 'react-router'

import { cn } from '@/lib/utils'

import type { IFlight } from '../../types/flight.types'
import { ProgressBar } from '../custom-ui/ProgressBar'

import { FlightCardActions } from './actions/FlightCardActions'
import { QUERY_PARAM_FLIGHT } from './flights.constants'

interface Props {
	flight: IFlight
}

export function FlightCard({ flight }: Props) {
	const [searchParams, setSearchParams] = useSearchParams()
	const selectedFlight = searchParams.get(QUERY_PARAM_FLIGHT)

	const isActive = selectedFlight === flight.id

	return (
		<div
			// TODO: add this gradient to tailwind css variables
			className={cn(
				'group relative w-full rounded-lg p-0.5 transition-colors ease-in',
				isActive
					? 'bg-gradient-to-r from-rose-500 to-orange-400'
					: 'bg-transparent'
			)}
		>
			<FlightCardActions flightId={flight.id} />
			<button
				onClick={() => {
					setSearchParams({
						[QUERY_PARAM_FLIGHT]: flight.id
					})
				}}
				className={cn('block h-full w-full rounded-lg bg-neutral-900 p-5')}
			>
				<div className='mb-7 flex items-center justify-between'>
					<div className='flex items-center gap-3'>
						<img
							src={flight.logo}
							alt={flight.airline.name}
							width={40}
							height={40}
							className='rounded-full bg-white'
						/>
						<span>{flight.id}</span>
					</div>
					<div>
						<span className='rounded-xl bg-neutral-800 px-2 py-1'>
							{flight.aircraftReg}
						</span>
					</div>
				</div>

				<div className='grid grid-cols-[1fr_5fr_1fr] items-end gap-4'>
					<div className='space-y-0.5 text-left'>
						<div>{flight.from.city}</div>
						<div className='text-3xl font-semibold'>{flight.from.code}</div>
					</div>

					<div className='mb-4'>
						<ProgressBar percentage={flight.progress} />
					</div>

					<div>
						<div>{flight.to.city}</div>
						<div className='text-3xl font-semibold'>{flight.to.code}</div>
					</div>
				</div>
			</button>
		</div>
	)
}
