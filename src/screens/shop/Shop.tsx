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
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">Loading tickets...</div>
      </div>
    )
  }

  const handleAddToCart = (ticket: Ticket) => {
    console.log('Added to cart:', ticket)
  }

  return (
    <div className="flex flex-row h-screen overflow-hidden pt-20">  {/* 👈 добавил pt-16 */}
      {/* Сайдбар слева */}
      <div className="w-64 border-r border-border overflow-y-auto flex-shrink-0">
        <ShopSidebar />
      </div>
      
      {/* Билеты справа */}
      <div className="flex-1 overflow-y-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Flight Shop</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
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