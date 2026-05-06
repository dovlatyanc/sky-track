import { trpc } from '@/lib/trpc'
import { ShopSidebar } from '@/components/shop/ShopSidebar'
import { Heart, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router'
import { TicketCard } from '@/components/tickets/TicketCard'
import { useAuth } from '@/hooks/useAuth'

export function FavoriteTickets() {
  const { user } = useAuth()
  const { data: favorites, isLoading } = trpc.favoriteTickets.getUserFavorites.useQuery(undefined, {
    enabled: !!user
  })

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <ShopSidebar />
        <div className="pt-16 lg:pt-4 px-3 pb-24 lg:px-6 lg:pb-6">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Heart size={64} className="text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Sign in to view favorites</h2>
            <p className="text-muted-foreground text-center mb-6">
              Please login to see your favorite tickets
            </p>
            <Link
              to="/login"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <ShopSidebar />
        <div className="pt-16 lg:pt-4 px-3 pb-24 lg:px-6 lg:pb-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-muted-foreground">Loading favorites...</div>
          </div>
        </div>
      </div>
    )
  }

  const tickets = favorites?.map(f => f.ticket).filter(Boolean) || []

  if (tickets.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <ShopSidebar />
        <div className="pt-16 lg:pt-4 px-3 pb-24 lg:px-6 lg:pb-6">
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Heart size={64} className="text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No favorite tickets yet</h2>
            <p className="text-muted-foreground text-center mb-6">
              Start adding tickets to your favorites
            </p>
            <Link
              to="/shop"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium"
            >
              Browse Tickets
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <ShopSidebar />
      
      <div className="pt-16 lg:pt-4 px-3 pb-24 lg:px-6 lg:pb-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Favorite Tickets</h1>
          <p className="text-muted-foreground text-sm mt-1">Tickets you've saved for later</p>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tickets.map((ticket: any) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      </div>
    </div>
  )
}