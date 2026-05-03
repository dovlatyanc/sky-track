import { trpc } from '@/lib/trpc'
import { TicketCard } from '../../components/tickets/TicketCard'
import { ShopSidebar } from '@/components/shop/ShopSidebar'

interface Ticket {
  id: string
  from: { code: string; city: string; country: string }
  to: { code: string; city: string; country: string }
  price: number
  departureTime: string
  arrivalTime: string
  duration: string
  airline: string
  flightNumber: string
  stops: number
}

export function Shop() {
  const { data: tickets, isLoading } = trpc.tickets.getAll.useQuery()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <div className="text-base text-muted-foreground">Loading tickets...</div>
      </div>
    )
  }

  const handleAddToCart = (ticket: Ticket) => {
    console.log('Added to cart:', ticket)
  }

  return (
    <div className="min-h-screen bg-background">
      <ShopSidebar />
      
    
      <div className="pt-16 lg:pt-4 px-3 pb-24 lg:px-6 lg:pb-6">
        <h1 className="text-xl font-bold text-foreground mb-4 lg:text-2xl lg:mb-5">
          Flight Shop
        </h1>
        
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {tickets?.map((ticket: Ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>
    </div>
  )
}