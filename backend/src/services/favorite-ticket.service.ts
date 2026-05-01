import { prisma } from '../../db/prisma'
import { ticketsRouter } from '../trpc/routers/tickets.router'

// Функция для получения билета по ID из генератора
async function getTicketById(id: string) {
  // Вызываем метод из роутера или дублируем логику поиска
  const tickets = ticketsRouter.getAll.query() as any[]  // временно
  return tickets.find(t => t.id === id) || null
}

export class FavoriteTicketService {
  // Добавить в избранное
  static async add(userId: string, ticketId: string) {
    return prisma.favoriteTicket.create({
      data: { userId, ticketId }
    })
  }

  // Удалить из избранного
  static async remove(userId: string, ticketId: string) {
    return prisma.favoriteTicket.delete({
      where: {
        userId_ticketId: { userId, ticketId }
      }
    })
  }

  // Получить все избранные билеты пользователя (с полными данными)
  static async getUserFavorites(userId: string) {
    // Получаем ID избранных билетов из БД
    const favorites = await prisma.favoriteTicket.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })
    
    // Генерируем все билеты
    const allTickets = generateFakeTickets() // Нужно импортировать или вызвать
    
    // Фильтруем только избранные
    const favoriteTickets = favorites
      .map(fav => {
        const ticket = allTickets.find(t => t.id === fav.ticketId)
        return ticket ? {
          id: fav.id,
          ticketId: fav.ticketId,
          ticket: ticket,
          createdAt: fav.createdAt
        } : null
      })
      .filter(Boolean)
    
    return favoriteTickets
  }

  // Проверить, в избранном ли билет
  static async isFavorite(userId: string, ticketId: string) {
    const favorite = await prisma.favoriteTicket.findUnique({
      where: {
        userId_ticketId: { userId, ticketId }
      }
    })
    return !!favorite
  }
}

// Вспомогательная функция генерации (скопируй из ticketsRouter)
function generateFakeTickets() {
  const airportsData = require('../../data/airports/airports.json')
  const usableAirports = (airportsData as any[]).filter(a => a.iata_code)
  const airlines = ['Aeroflot', 'S7 Airlines', 'Ural Airlines', 'Pobeda', 'Azur Air', 'Red Wings']

  return Array.from({ length: 50 }, (_, i) => {
    const fromIndex = Math.floor(Math.random() * usableAirports.length)
    let toIndex = Math.floor(Math.random() * usableAirports.length)
    while (toIndex === fromIndex) {
      toIndex = Math.floor(Math.random() * usableAirports.length)
    }

    const from = usableAirports[fromIndex]
    const to = usableAirports[toIndex]

    const departure = new Date(Date.now() + Math.random() * 1000 * 60 * 60 * 24 * 7)
    const durationMinutes = Math.floor(Math.random() * 6) * 60 + 30
    const arrival = new Date(departure.getTime() + durationMinutes * 60 * 1000)

    return {
      id: `ticket-${i}`,
      from: {
        code: from.iata_code,
        city: from.municipality,
        country: from.iso_country
      },
      to: {
        code: to.iata_code,
        city: to.municipality,
        country: to.iso_country
      },
      price: Math.floor(Math.random() * 50000) + 5000,
      departureTime: departure.toISOString(),
      arrivalTime: arrival.toISOString(),
      duration: `${Math.floor(durationMinutes / 60)}h ${(durationMinutes % 60)}m`,
      airline: airlines[Math.floor(Math.random() * airlines.length)],
      flightNumber: `SU${Math.floor(Math.random() * 900) + 100}`,
      stops: Math.floor(Math.random() * 3)
    }
  })
}