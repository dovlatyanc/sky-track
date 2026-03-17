import { Plane } from 'lucide-react'

import type { IFlight } from '@/types/flight.types'

export function FlightRoute({ flight }: { flight: IFlight }) {
	return (
		<div className='relative mb-1 grid grid-cols-2 gap-1'>
			<div className='bg-card p-element xs:p-4 rounded-tl-xl text-center'>
				<h3 className='xs:text-3xl mb-1.5 text-4xl font-semibold text-white'>
					{flight.from.code}
				</h3>
				<p className='xs:text-base mb-1 text-lg font-medium text-neutral-200'>
					{flight.from.city}
				</p>
				<p className='xs:text-xs text-sm font-medium text-neutral-500'>
					{flight.from.timezone}
				</p>
			</div>

			<div className='xs:size-10 absolute top-1/2 left-1/2 mb-2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-neutral-950'>
				<Plane className='xs:size-5 text-amber-400' size={22} />
			</div>

			<div className='bg-card p-element xs:p-4 rounded-tr-xl text-center'>
				<h3 className='xs:text-3xl mb-1.5 text-4xl font-semibold text-white'>
					{flight.to.code}
				</h3>
				<p className='xs:text-base mb-1 text-lg font-medium text-neutral-200'>
					{flight.to.city}
				</p>
				<p className='xs:text-xs text-sm font-medium text-neutral-500'>
					{flight.to.timezone}
				</p>
			</div>
		</div>
	)
}
