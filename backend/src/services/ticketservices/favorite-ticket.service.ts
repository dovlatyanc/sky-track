import { prisma } from '../../../db/prisma'
import { generateFakeTickets } from './ticket-generator.service'

export class FavoriteTicketService {
  static async add(userId: string, ticketId: string) {
    return prisma.favoriteTicket.create({
      data: { userId, ticketId }
    })
  }

  static async remove(userId: string, ticketId: string) {
    return prisma.favoriteTicket.delete({
      where: {
        userId_ticketId: { userId, ticketId }
      }
    })
  }

  static async getUserFavorites(userId: string) {
    const favorites = await prisma.favoriteTicket.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })
    
    const allTickets = generateFakeTickets(50)
    
    return favorites
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
  }

  static async isFavorite(userId: string, ticketId: string) {
    const favorite = await prisma.favoriteTicket.findUnique({
      where: {
        userId_ticketId: { userId, ticketId }
      }
    })
    return !!favorite
  }
}