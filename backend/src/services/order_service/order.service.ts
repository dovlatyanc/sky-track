import { prisma } from '../../../db/prisma'
import { CACHED_TICKETS } from '../../trpc/routers/tickets.router'

export class OrderService {
  // Создать заказ
  static async createOrder(userId: string | undefined, guestId: string | undefined, items: { ticketId: string; quantity: number; price: number }[]) {
    const order = await prisma.order.create({
      data: {
        userId,
        guestId,
        isGuest: !userId,
        status: 'pending',
        items: {
          create: items.map(item => ({
            ticketId: item.ticketId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: true
      }
    })
    
    // Очищаем корзину после создания заказа
    if (userId) {
      await prisma.cart.deleteMany({ where: { userId } })
    } else if (guestId) {
      await prisma.cart.deleteMany({ where: { guestId } })
    }
    
    return order
  }

  // Получить заказы пользователя
  static async getUserOrders(userId: string) {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' }
    })
    
    // Добавляем данные билетов из кеша
    return orders.map(order => ({
      ...order,
      items: order.items.map(item => ({
        ...item,
        ticket: CACHED_TICKETS.find(t => t.id === item.ticketId) || null
      }))
    }))
  }

  // Получить заказ по ID
  static async getOrderById(orderId: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    })
    
    if (!order) return null
    
    return {
      ...order,
      items: order.items.map(item => ({
        ...item,
        ticket: CACHED_TICKETS.find(t => t.id === item.ticketId) || null
      }))
    }
  }

  // Обновить статус заказа (для админа)
  static async updateOrderStatus(orderId: string, status: string) {
    return prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { items: true }
    })
  }

  // Получить все заказы (для админа)
  static async getAllOrders() {
    const orders = await prisma.order.findMany({
      include: { items: true, user: { select: { id: true, email: true, name: true } } },
      orderBy: { createdAt: 'desc' }
    })
    
    return orders.map(order => ({
      ...order,
      items: order.items.map(item => ({
        ...item,
        ticket: CACHED_TICKETS.find(t => t.id === item.ticketId) || null
      }))
    }))
  }
}