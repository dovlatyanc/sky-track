import { useState } from 'react'
import { Heart } from 'lucide-react'
import { trpc } from '@/lib/trpc'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router'

interface TicketFavoriteButtonProps {
  ticketId: string
  size?: number
}

export function TicketFavoriteButton({ ticketId, size = 20 }: TicketFavoriteButtonProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const utils = trpc.useUtils()
  
  const { data: isFavorited, isLoading: isChecking } = trpc.favoriteTickets.isFavorite.useQuery(
    { ticketId },
    { enabled: !!user }
  )
  
  const addToFavorites = trpc.favoriteTickets.add.useMutation({
    onSuccess: () => {
      utils.favoriteTickets.getUserFavorites.invalidate()
      utils.favoriteTickets.isFavorite.invalidate({ ticketId })
    }
  })
  
  const removeFromFavorites = trpc.favoriteTickets.remove.useMutation({
    onSuccess: () => {
      utils.favoriteTickets.getUserFavorites.invalidate()
      utils.favoriteTickets.isFavorite.invalidate({ ticketId })
    }
  })
  
  const handleToggle = () => {
    if (!user) {
      navigate('/login')
      return
    }
    
    if (isFavorited) {
      removeFromFavorites.mutate({ ticketId })
    } else {
      addToFavorites.mutate({ ticketId })
    }
  }
  
  const isPending = addToFavorites.isPending || removeFromFavorites.isPending || isChecking
  
  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`p-1.5 rounded-full transition-colors ${
        isFavorited 
          ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20' 
          : 'text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20'
      } disabled:opacity-50`}
    >
      <Heart size={size} fill={isFavorited ? 'currentColor' : 'none'} />
    </button>
  )
}