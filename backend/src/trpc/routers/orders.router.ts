import { z } from 'zod'
import { publicProcedure, router } from '../trpc'
import { OrderService } from '../../services/authservice/order.service'

export const ordersRouter = router({
  create: publicProcedure
    .input(
      z.object({
        guestId: z.string().optional(),
        items: z.array(
          z.object({
            ticketId: z.string(),
            quantity: z.number().int().min(1),
            price: z.number().min(0),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await OrderService.createOrder(
        ctx.userId ?? undefined,
        input.guestId,
        input.items
      )
    }),

  getUserOrders: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) throw new Error('Not authenticated')
    return await OrderService.getUserOrders(ctx.userId)
  }),
})