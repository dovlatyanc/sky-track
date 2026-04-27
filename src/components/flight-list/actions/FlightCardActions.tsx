import { useCallback } from 'react'

import { Heart } from '@/components/animate-ui/icons/heart'
import { Button } from '@/components/ui/button'

import { useAppDispatch } from '@/hooks/useAppDispatch'
import { useAppSelector } from '@/hooks/useAppSelector'

import { addFavorite, removeFavorite } from '@/store/favorites/favorites.slice'

interface Props {
	flightId: string
}

export function FlightCardActions({ flightId }: Props) {
	const dispatch = useAppDispatch()
	const favorites = useAppSelector(state => state.favorites)
	const isFavorite = favorites.includes(flightId)

	const handleToggleFavorite = useCallback(() => {
		if (isFavorite) {
			dispatch(removeFavorite(flightId))
		} else {
			dispatch(addFavorite(flightId))
		}
	}, [dispatch, flightId, isFavorite])

	return (
		<Button
			onClick={handleToggleFavorite}
			variant='ghost'
			size='sm'
			className="p-1"
		>
			<Heart
				fill={isFavorite ? 'var(--foreground)' : 'none'}
				className='size-4'
			/>
		</Button>
	)
}