import { prisma } from '../../db/prisma'
import { CACHED_TICKETS } from '../../trpc/routers/tickets.router'
import type { IOrder, IOrderItem } from '../../types/user.types'

type OrderStatus = 'pending' | 'confirmed' | 'delivered' | 'cancelled'

export class OrderService {
  static async createOrder(
    userId: string | undefined,
    guestId: string | undefined,
    items: { ticketId: string; quantity: number; price: number }[]
  ): Promise<IOrder> {
    const order = await prisma.order.create({
      data: {
        userId,
        isGuest: !!guestId,
        guestId,
        status: 'pending',
        items: {
          create: items.map(item => ({
            ticketId: item.ticketId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    })

    return {
      ...order,
      userId: order.userId || undefined,
      guestId: order.guestId || undefined,
      status: order.status as OrderStatus,  
      items: order.items.map(item => ({
        ...item,
        ticket: CACHED_TICKETS.find(t => t.id === item.ticketId) || null
      }))
    } as IOrder
  }

  static async getUserOrders(userId: string): Promise<IOrder[]> {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' }
    })

    return orders.map(order => ({
      ...order,
      userId: order.userId || undefined,
      guestId: order.guestId || undefined,
      status: order.status as OrderStatus,  
      items: order.items.map(item => ({
        ...item,
        ticket: CACHED_TICKETS.find(t => t.id === item.ticketId) || null
      }))
    }))
  }

  static async getOrderById(orderId: string): Promise<IOrder | null> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, passengerData: true }
    })

    if (!order) return null

    return {
      ...order,
      userId: order.userId || undefined,
      guestId: order.guestId || undefined,
      status: order.status as OrderStatus,  
      items: order.items.map(item => ({
        ...item,
        ticket: CACHED_TICKETS.find(t => t.id === item.ticketId) || null
      }))
    }
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus) {
    return prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { items: true }
    })
  }

  static async getAllOrders() {
    const orders = await prisma.order.findMany({
      include: { 
        items: true, 
        user: { select: { id: true, email: true, name: true } },
        passengerData: true 
      },
      orderBy: { createdAt: 'desc' }
    })

    return orders.map(order => ({
      ...order,
      userId: order.userId || undefined,
      guestId: order.guestId || undefined,
      status: order.status as OrderStatus,  
      items: order.items.map(item => ({
        ...item,
        ticket: CACHED_TICKETS.find(t => t.id === item.ticketId) || null
      }))
    }))
  }
}