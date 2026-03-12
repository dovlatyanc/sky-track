import type { IFlight } from '@/types/flight.types'
import { useSearchParams } from 'react-router'
import { X } from '../animate-ui/icons/x'
import { QUERY_PARAM_FLIGHT } from '../flight-list/flights.constants'

export function FlightHeader({ flight }: { flight: IFlight }) {
	const [searchParams, setSearchParams] = useSearchParams()

	return (
		<div className="bg-[#1a1a1a] px-4 py-3 flex items-center justify-between absolute top-3.5 left-1/2 -translate-x-1/2 w-11/12 rounded-xl h-max">
			<div>
				<h2 className="text-amber-400 text-xl font-medium">{flight.id}</h2>
				<p className="text-gray-300 text-sm">{flight.airline.name}</p>
			</div>
			<button
				onClick={() => {
					searchParams.delete(QUERY_PARAM_FLIGHT)
					setSearchParams(searchParams)
				}}
				className="text-gray-400 hover:text-white transition-colors bg-neutral-700 p-1 rounded-full"
			>
				<X
					animateOnHover
					animateOnTap
					size={20}
				/>
			</button>
		</div>
	)
}
