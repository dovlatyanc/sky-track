import { z } from 'zod'
import { publicProcedure, adminProcedure, router } from '../trpc'  // убрал protectedProcedure если не используется
import { NewsService } from '../../services/news_service/news.service'

export const newsRouter = router({
  // Получить все публичные новости
  getAll: publicProcedure.query(async () => {
    return await NewsService.getAllPublished()
  }),

  // Получить новость по ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const news = await NewsService.getById(input.id)
      if (news) {
        // Не ждём incrementViews, чтобы не блокировать ответ
        NewsService.incrementViews(input.id).catch(console.error)
      }
      return news
    }),

  // Админские методы
  getAllAdmin: adminProcedure.query(async () => {
    return await NewsService.getAllAdmin()
  }),

  create: adminProcedure
    .input(z.object({
      title: z.string().min(3).max(200),
      content: z.string().min(1),
      imageUrl: z.string().optional().nullable(),
      isPublished: z.boolean().default(true)
    }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.userId) {
        throw new Error('User ID is required')
      }
      
      const data: any = {
        title: input.title,
        content: input.content,
        authorId: ctx.userId,
        isPublished: input.isPublished
      }
      
      // Добавляем imageUrl только если есть и не пустая строка
      if (input.imageUrl && input.imageUrl.trim() !== '') {
        data.imageUrl = input.imageUrl
      }
      
      return await NewsService.create(data)
    }),

  update: adminProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().min(3).max(200).optional(),
      content: z.string().min(1).optional(),
      imageUrl: z.string().optional().nullable(),
      isPublished: z.boolean().optional()
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input
      
      // Очищаем данные: удаляем undefined и пустые значения
      const cleanData: any = {}
      
      if (data.title !== undefined) cleanData.title = data.title
      if (data.content !== undefined) cleanData.content = data.content
      if (data.isPublished !== undefined) cleanData.isPublished = data.isPublished
      
      // imageUrl: только если есть непустая строка
      if (data.imageUrl && data.imageUrl.trim() !== '') {
        cleanData.imageUrl = data.imageUrl
      }
      
      return await NewsService.update(id, cleanData)
    }),
  
  // Добавь delete если ещё нет
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await NewsService.delete(input.id)
    })
})