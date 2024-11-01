import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import prisma from '../../lib/prisma'
import { checkSessionIdExists } from '../../middlewares/check-session-id-exists'

export async function mealsRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/',
    {
      schema: {
        body: z.object({
          name: z.string(),
          description: z.string(),
          date: z.string(),
          isDiet: z.boolean(),
        }),
      },
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { name, description, date, isDiet } = request.body
      const { sessionId } = request.cookies

      const user = await prisma.user.findUnique({
        where: {
          sessionId,
        },
      })

      if (!user) {
        return reply.status(404).send({
          error: 'User not found',
        })
      }

      await prisma.meal.create({
        data: {
          name,
          description,
          date,
          isDiet,
          userId: user.id,
        },
      })

      return reply.status(201).send('Meal created')
    }
  )
}
