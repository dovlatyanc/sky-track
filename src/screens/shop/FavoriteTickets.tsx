import { trpc } from '@/lib/trpc'
import { ShopSidebar } from '@/components/shop/ShopSidebar'
import { Heart } from 'lucide-react'
import { Link } from 'react-router'
import { TicketCard } from '@/components/tickets/TicketCard'
import { useAuth } from '@/hooks/useAuth'
import { useTranslation } from 'react-i18next'

export function FavoriteTickets() {
  const { t } = useTranslation('favorites_tickets')
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
            <h2 className="text-xl font-semibold text-foreground mb-2">{t('sign_in_title')}</h2>
            <p className="text-muted-foreground text-center mb-6">
              {t('sign_in_message')}
            </p>
            <Link
              to="/login"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium"
            >
              {t('sign_in_button')}
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
            <div className="text-muted-foreground">{t('loading')}</div>
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
            <h2 className="text-xl font-semibold text-foreground mb-2">{t('empty_title')}</h2>
            <p className="text-muted-foreground text-center mb-6">
              {t('empty_message')}
            </p>
            <Link
              to="/shop"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium"
            >
              {t('browse_tickets')}
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
          <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('description')}</p>
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