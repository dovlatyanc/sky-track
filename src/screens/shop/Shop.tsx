import { useState, useMemo } from 'react'
import { trpc } from '@/lib/trpc'
import { TicketCard } from '../../components/tickets/TicketCard'
import { ShopSidebar } from '@/components/shop/ShopSidebar'

import { Search, X, Calendar, PlaneTakeoff, PlaneLanding } from 'lucide-react'

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
 
  
  // Фильтры
  const [fromCity, setFromCity] = useState('')
  const [toCity, setToCity] = useState('')
  const [departureDate, setDepartureDate] = useState('')
  const [arrivalDate, setArrivalDate] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  
  // Получаем уникальные города для селектов
  const cities = useMemo(() => {
    if (!tickets) return []
    const uniqueCities = new Map<string, { code: string; city: string }>()
    tickets.forEach(ticket => {
      if (!uniqueCities.has(ticket.from.city)) {
        uniqueCities.set(ticket.from.city, { code: ticket.from.code, city: ticket.from.city })
      }
      if (!uniqueCities.has(ticket.to.city)) {
        uniqueCities.set(ticket.to.city, { code: ticket.to.code, city: ticket.to.city })
      }
    })
    return Array.from(uniqueCities.values())
  }, [tickets])
  
  // Фильтрация билетов
  const filteredTickets = useMemo(() => {
    if (!tickets) return []
    
    return tickets.filter(ticket => {
      // Фильтр по городу отправления
      if (fromCity && ticket.from.city !== fromCity) return false
      
      // Фильтр по городу прибытия
      if (toCity && ticket.to.city !== toCity) return false
      
      // Фильтр по дате отправления
      if (departureDate) {
        const ticketDate = new Date(ticket.departureTime).toDateString()
        const filterDate = new Date(departureDate).toDateString()
        if (ticketDate !== filterDate) return false
      }
      
      // Фильтр по дате прибытия
      if (arrivalDate) {
        const ticketDate = new Date(ticket.arrivalTime).toDateString()
        const filterDate = new Date(arrivalDate).toDateString()
        if (ticketDate !== filterDate) return false
      }
      
      return true
    })
  }, [tickets, fromCity, toCity, departureDate, arrivalDate])
  
  const handleResetFilters = () => {
    setFromCity('')
    setToCity('')
    setDepartureDate('')
    setArrivalDate('')
  }
  
  const hasActiveFilters = fromCity || toCity || departureDate || arrivalDate

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <div className="text-base text-muted-foreground">Loading tickets...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <ShopSidebar />
      
      <div className="pt-16 lg:pt-4 px-3 pb-24 lg:px-6 lg:pb-6">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-foreground mb-4 lg:text-2xl lg:mb-5">
            Flight Shop
          </h1>
          
          {/* Кнопка показать/скрыть фильтры на мобилке */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg mb-4"
          >
            <Search size={18} />
            <span className="text-sm">Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-primary rounded-full" />
            )}
          </button>
          
          {/* Фильтры */}
          <div className={`${showFilters ? 'block' : 'hidden lg:block'} space-y-4 mb-6`}>
            <div className="flex flex-wrap items-end gap-3">
              {/* Откуда */}
              <div className="flex-1 min-w-[140px]">
                <label className="block text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <PlaneTakeoff size={12} /> From
                </label>
                <select
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All cities</option>
                  {cities.map(city => (
                    <option key={`from-${city.city}`} value={city.city}>
                      {city.code} - {city.city}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Куда */}
              <div className="flex-1 min-w-[140px]">
                <label className="block text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <PlaneLanding size={12} /> To
                </label>
                <select
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All cities</option>
                  {cities.map(city => (
                    <option key={`to-${city.city}`} value={city.city}>
                      {city.code} - {city.city}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Дата вылета */}
              <div className="flex-1 min-w-[140px]">
                <label className="block text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <Calendar size={12} /> Departure
                </label>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              {/* Дата прилета */}
              <div className="flex-1 min-w-[140px]">
                <label className="block text-xs text-muted-foreground mb-1 flex items-center gap-1">
                  <Calendar size={12} /> Arrival
                </label>
                <input
                  type="date"
                  value={arrivalDate}
                  onChange={(e) => setArrivalDate(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              {/* Кнопка сброса */}
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <X size={16} /> Clear
                </button>
              )}
            </div>
          </div>
          
          {/* Результаты */}
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-muted-foreground">
              Found {filteredTickets.length} flights
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="hidden lg:flex text-sm text-muted-foreground hover:text-foreground transition-colors items-center gap-1"
              >
                <X size={14} /> Clear all filters
              </button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredTickets.map((ticket: Ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
            />
          ))}
        </div>
        
        {filteredTickets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No flights found matching your criteria</p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}