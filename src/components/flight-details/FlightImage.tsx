import type { IFlight } from '../../types/flight.types'

export function FlightImage({ flight }: { flight: IFlight }) {
	return (
		<div
			className="w-full h-72 pt-28"
			style={{
				background: `linear-gradient(to top, ${flight?.colorGradient[0]}, ${flight?.colorGradient[1]})`
			}}
		>
			<img
				src={flight?.airplane.image}
				alt={flight?.airplane.name}
				className="max-w-[95%] h-auto mx-auto"
			/>
		</div>
	)
}
