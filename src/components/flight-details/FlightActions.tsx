import { MoreHorizontal, Route } from 'lucide-react'

import { MapPin } from '../animate-ui/icons/map-pin'
import { SquareArrowOutUpRight } from '../animate-ui/icons/square-arrow-out-up-right'

interface Props {
	onRoute: () => void
	onFollow: () => void
	onShare: () => void
	onMore: () => void
}

export function FlightActions({ onRoute, onFollow, onShare, onMore }: Props) {
	// TODO: Separate the actions into different components
	return (
		<div className='xs:text-sm'>
			<div className='grid grid-cols-4 gap-1'>
				<button
					onClick={onRoute}
					className='bg-card px-mini-element py-mini-element xs:rounded-tl-xl xs:rounded-bl-xl hover:bg-card/60 flex flex-col items-center gap-2 rounded-tl-2xl rounded-bl-2xl transition-colors'
				>
					<Route size={22} className='xs:size-5' />
					<span>Route</span>
				</button>
				<button
					onClick={onFollow}
					className='bg-card px-mini-element py-mini-element hover:bg-card/60 flex flex-col items-center gap-2 transition-colors'
				>
					<MapPin animateOnHover animateOnTap size={22} className='xs:size-5' />
					<span>Follow</span>
				</button>
				<button
					onClick={onShare}
					className='bg-card px-mini-element py-mini-element hover:bg-card/60 flex flex-col items-center gap-2 transition-colors'
				>
					<SquareArrowOutUpRight
						animateOnHover
						animateOnTap
						size={22}
						className='xs:size-5'
					/>
					<span>Share</span>
				</button>
				<button
					onClick={onMore}
					className='bg-card px-mini-element py-mini-element hover:bg-card/60 flex flex-col items-center gap-2 rounded-tr-2xl rounded-br-2xl transition-colors'
				>
					<MoreHorizontal size={22} className='xs:size-5' />
					<span>More</span>
				</button>
			</div>
		</div>
	)
}
