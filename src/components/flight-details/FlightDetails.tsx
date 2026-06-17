import { AnimatePresence, m } from 'framer-motion'

import type { TFlight } from '@/lib/trpc'

import { FlightActions } from './FlightActions'
import { FlightHeader } from './FlightHeader'
import { FlightImage } from './FlightImage'
import { FlightInformation } from './FlightInformation'
import { FlightRoute } from './FlightRoute'
import { FlightSchedule } from './FlightSchedule'
import { FlightStatus } from './FlightStatus'

interface Props {
	flight: NonNullable<TFlight>
}

export function FlightDetails({ flight }: Props) {
	return (
		<AnimatePresence mode='wait'>
			<m.aside
				key={flight.id}
				initial={{ x: '100%', opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
				exit={{ x: '100%', opacity: 0 }}
				transition={{
					type: 'tween',
					duration: 0.4,
					ease: [0.3, 0.4, 0.45, 0.95]
				}}
				className='xs:rounded-lg xs:top-2 xs:inset-2.5 xs:w-[95%] xs:bg-white/40 xs:dark:bg-black/40 absolute top-24 right-7 z-10 w-sm overflow-hidden rounded-xl shadow-xl sm:inset-3 sm:top-21 sm:w-[95.5%] xl:top-28 bg-flight-card'
			>
				<div className="h-full overflow-y-auto [&>*]:bg-transparent [&_.bg-flight-card]:bg-transparent [&_.bg-card]:bg-transparent">
					<FlightHeader flight={flight} />
					<FlightImage flight={flight} />

					<div className='p-3.5 [&>*]:bg-transparent'>
						<FlightRoute flight={flight} />
						<FlightStatus flight={flight} />
						<FlightSchedule flight={flight} />
						<FlightInformation flight={flight} />
						<FlightActions flight={flight} />
					</div>
				</div>
			</m.aside>
		</AnimatePresence>
	)
}