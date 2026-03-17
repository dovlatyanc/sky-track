import { useSearchParams } from 'react-router'

import type { IFlight } from '@/types/flight.types'

import { X } from '../animate-ui/icons/x'
import { QUERY_PARAM_FLIGHT } from '../flight-list/flights.constants'

export function FlightHeader({ flight }: { flight: IFlight }) {
	const [searchParams, setSearchParams] = useSearchParams()

	return (
		<div className='xs:rounded-lg absolute top-3.5 left-1/2 flex h-max w-11/12 -translate-x-1/2 items-center justify-between rounded-xl bg-[#1a1a1a] px-4 py-3'>
			<div>
				<h2 className='text-xl font-medium text-amber-400'>{flight.id}</h2>
				<p className='text-sm text-gray-300'>{flight.airline.name}</p>
			</div>
			<button
				onClick={() => {
					searchParams.delete(QUERY_PARAM_FLIGHT)
					setSearchParams(searchParams)
				}}
				className='rounded-full bg-neutral-700 p-1 text-gray-400 transition-colors hover:text-white'
			>
				<X animateOnHover animateOnTap size={20} />
			</button>
		</div>
	)
}
