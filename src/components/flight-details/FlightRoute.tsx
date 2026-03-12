import type { IFlight } from '@/types/flight.types'
import { Plane } from 'lucide-react'

export function FlightRoute({ flight }: { flight: IFlight }) {
	return (
		<div className="grid grid-cols-2 gap-1 mb-1 relative">
			<div className="bg-card px-element py-element rounded-tl-xl text-center">
				<h3 className="text-white text-4xl font-semibold mb-1.5">
					{flight.from.code}
				</h3>
				<p className="text-neutral-200 font-medium mb-1 text-lg">
					{flight.from.city}
				</p>
				<p className="text-neutral-500 text-sm font-medium">
					{flight.from.timezone}
				</p>
			</div>

			<div className="flex items-center justify-center mb-2 bg-neutral-950 rounded-full w-12 h-12 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
				<Plane
					className="text-amber-400"
					size={22}
				/>
			</div>

			<div className="bg-card px-element py-element rounded-tr-xl text-center">
				<h3 className="text-white text-4xl font-semibold mb-1.5">
					{flight.to.code}
				</h3>
				<p className="text-neutral-200 font-medium mb-1 text-lg">
					{flight.to.city}
				</p>
				<p className="text-neutral-500 text-sm font-medium">
					{flight.to.timezone}
				</p>
			</div>
		</div>
	)
}
