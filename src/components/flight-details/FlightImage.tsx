export function FlightImage() {
	// TODO: Handle cases where flight data might not have an image or color gradient

	return (
		<div
			className='xs:h-56 xs:pt-21 h-72 w-full pt-28'
			style={{
				// background: `linear-gradient(to top, ${flight?.colorGradient[0]}, ${flight?.colorGradient[1]})`
				background: `linear-gradient(to top, #f9b9b9, #d34f4f)` // Example gradient
			}}
		>
			<img
				// src={flight?.airplane.image}
				// alt={flight?.airplane.name}
				src='/planes/turkish.png' // Example image
				alt='Airbus A330' // Example alt text
				className='mx-auto h-auto max-w-[95%]'
			/>
		</div>
	)
}
