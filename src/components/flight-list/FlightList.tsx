import { FlightCard } from './FlightCard'
import { FLIGHTS } from './fligths.data'

export function FlightList() {
	return (
		<div className="w-sm space-y-4">
			{FLIGHTS.map(flight => (
				<FlightCard
					key={flight.id}
					flight={flight}
				/>
			))}
		</div>
	)
}
