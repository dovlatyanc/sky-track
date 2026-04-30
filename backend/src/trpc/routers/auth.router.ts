import { z } from 'zod'
import { publicProcedure,protectedProcedure, router } from '../trpc'
import { AuthService } from '../../services/authservice/auth.service'

export const authRouter = router({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await AuthService.register(input.email, input.password, input.name)
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
      })
    )
    .mutation(async ({ input }) => {
      const user = await AuthService.login(input.email, input.password)
      if (!user) throw new Error('Invalid credentials')
      return user
    }),

 me: protectedProcedure.query(async ({ ctx }) => {
  return await AuthService.findById(ctx.userId!)
}),
})