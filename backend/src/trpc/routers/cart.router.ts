import { z } from 'zod'
import { publicProcedure, protectedProcedure, router } from '../trpc'
import { CartService } from '../../services/cart_service/cart.service'

export const cartRouter = router({
  // Получить корзину
  getCart: publicProcedure
    .input(z.object({
      guestId: z.string().optional()
    }))
    .query(async ({ input, ctx }) => {
      const userId = ctx.userId
      const guestId = input.guestId
      
      return await CartService.getCart(userId || undefined, guestId)
    }),

  // Добавить в корзину
  addItem: publicProcedure
    .input(z.object({
      ticketId: z.string(),
      quantity: z.number().min(1).default(1),
      guestId: z.string().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.userId
      const guestId = input.guestId
      
      return await CartService.addItem(userId || undefined, guestId, input.ticketId, input.quantity)
    }),

  // Обновить количество
  updateQuantity: publicProcedure
    .input(z.object({
      itemId: z.string(),
      quantity: z.number().min(0),
      guestId: z.string().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.userId
      const guestId = input.guestId
      
      return await CartService.updateQuantity(userId || undefined, guestId, input.itemId, input.quantity)
    }),

  // Удалить товар
  removeItem: publicProcedure
    .input(z.object({
      itemId: z.string(),
      guestId: z.string().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.userId
      const guestId = input.guestId
      
      return await CartService.removeItem(userId || undefined, guestId, input.itemId)
    }),

  // Очистить корзину
  clearCart: publicProcedure
    .input(z.object({
      guestId: z.string().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.userId
      const guestId = input.guestId
      
      return await CartService.clearCart(userId || undefined, guestId)
    }),

  // Объединить корзины после логина
  mergeCarts: protectedProcedure
    .input(z.object({ guestId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await CartService.mergeCarts(input.guestId, ctx.userId!)
    })
})