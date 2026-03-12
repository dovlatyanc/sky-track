import { useSearchParams } from 'react-router'
import type { IFlight } from '../../types/flight.types'

import { cn } from '@/lib/utils'
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
			className={cn(
				'rounded-lg p-0.5 w-full transition-colors ease-in',
				isActive
					? 'bg-gradient-to-r from-rose-500 to-orange-400'
					: 'bg-transparent'
			)}
		>
			<button
				onClick={() => {
					setSearchParams({
						[QUERY_PARAM_FLIGHT]: flight.id
					})
				}}
				className={cn('bg-neutral-900 rounded-lg p-5 block w-full h-full')}
			>
				<div className="flex justify-between items-center mb-7">
					<div className="flex items-center gap-3">
						<img
							src={flight.logo}
							alt={flight.airline.name}
							width={40}
							height={40}
							className="rounded-full bg-white"
						/>
						<span>{flight.id}</span>
					</div>
					<div>
						<span className="bg-neutral-800 rounded-xl py-1 px-2">
							{flight.aircraftReg}
						</span>
					</div>
				</div>

				<div className="flex justify-between items-center">
					<div className="space-y-0.5">
						<div>{flight.from.city}</div>
						<div className="font-semibold text-3xl">{flight.from.code}</div>
					</div>

					<div>{/* PROGRESS BAR */}</div>

					<div>
						<div>{flight.to.city}</div>
						<div className="font-semibold text-3xl">{flight.to.code}</div>
					</div>
				</div>
			</button>
		</div>
	)
}
