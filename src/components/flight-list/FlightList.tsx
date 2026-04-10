import type { TRouterOutput } from 'backend/src/trpc'
import { useState } from 'react'

import { RefreshCw } from '../animate-ui/icons/refresh-cw'
import { SkeletonLoader } from '../custom-ui/SkeletonLoader'
import { Filters } from '../filters/Filters'
import { Button } from '../ui/button'

import { FlightCard } from './FlightCard'
import { formatDate } from './format-date'

interface Props {
	flights: TRouterOutput['flights']['getLive']
	refetch: () => void
	isRefetching: boolean
	isPending: boolean
	lastUpdate: Date | null
}

export function FlightList({
	flights,
	isRefetching,
	isPending,
	lastUpdate,
	refetch
}: Props) {
	const [fromCountry, setFromCountry] = useState<string | null>(null)
	const [currentAirline, setCurrentAirline] = useState<string | null>(null)

	return (
		<div className='relative z-10 w-sm sm:w-full md:w-xs'>
			<Filters
				fromCountry={fromCountry}
				setFromCountry={setFromCountry}
				currentAirline={currentAirline}
				setCurrentAirline={setCurrentAirline}
			/>

			<div className='absolute top-0 -right-12.5'>
				<Button
					onClick={() => refetch()}
					disabled={isRefetching}
					variant='secondary'
				>
					<RefreshCw animateOnHover />
				</Button>
			</div>

			{lastUpdate && (
				<div className='text-muted-foreground mt-3 text-center text-xs italic opacity-50'>
					{isRefetching ? (
						<>Updating...</>
					) : (
						<>Last update: {formatDate(lastUpdate)}</>
					)}
				</div>
			)}

			<div className='max-h-[calc(100vh-4rem)] min-h-[calc(100vh-4rem)] space-y-4 overflow-x-hidden overflow-y-auto pt-3 pb-8'>
				{isPending ? (
					<SkeletonLoader count={5} className='mb-4 h-40' />
				) : (
					!!flights?.length &&
					flights.map(flight => <FlightCard key={flight.id} flight={flight} />)
				)}
			</div>
		</div>
	)
}
