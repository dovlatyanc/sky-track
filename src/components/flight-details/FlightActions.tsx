import { MoreHorizontal, Route } from 'lucide-react'

import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'

import { cn } from '@/lib/utils'

import { MapPin } from '../animate-ui/icons/map-pin'
import { SquareArrowOutUpRight } from '../animate-ui/icons/square-arrow-out-up-right'

import { toggleFlightRoute } from '@/store/flight-actions/flight-action.slice'

interface Props {
	onFollow: () => void
	onShare: () => void
	onMore: () => void
}

export function FlightActions({ onFollow, onShare, onMore }: Props) {
	const dispatch = useAppDispatch()
	const isShowRoute = useAppSelector(state => state.flightActions.isShowRoute)

	return (
		<div className='xs:text-sm'>
			<div className='grid grid-cols-4 gap-1'>
				<button
					onClick={() => dispatch(toggleFlightRoute())}
					className={cn(
						'bg-card px-mini-element py-mini-element xs:rounded-tl-xl xs:rounded-bl-xl hover:bg-card/60 flex flex-col items-center gap-2 rounded-tl-2xl rounded-bl-2xl transition-colors',
						{
							'bg-[#ddd] hover:bg-[#ddd]/70 dark:bg-[#282828] dark:hover:bg-[#282828]/70':
								isShowRoute
						}
					)}
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
