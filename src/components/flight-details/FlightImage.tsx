import type { IFlight } from '../../types/flight.types'

export function FlightImage({ flight }: { flight: IFlight }) {
	return (
		<div
			className='xs:h-56 xs:pt-21 h-72 w-full pt-28'
			style={{
				background: `linear-gradient(to top, ${flight?.colorGradient[0]}, ${flight?.colorGradient[1]})`
			}}
		>
			<img
				src={flight?.airplane.image}
				alt={flight?.airplane.name}
				className='mx-auto h-auto max-w-[95%]'
			/>
		</div>
	)
}
