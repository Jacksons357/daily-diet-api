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

  app.withTypeProvider<ZodTypeProvider>().get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const user = await prisma.user.findUnique({
        where: {
          sessionId,
        },
      })

      if (!user) {
        return reply.status(404).send('User not found!')
      }

      const meals = await prisma.meal.findMany({
        where: {
          userId: user.id,
        },
      })

      return { meals }
    }
  )

  app.withTypeProvider<ZodTypeProvider>().get(
    '/:id',
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
      },
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { id } = request.params

      const meal = await prisma.meal.findUnique({
        where: {
          id,
        },
      })

      if (!meal) {
        return reply.status(404).send('Meal not found!')
      }

      return { meal }
    }
  )

  app.withTypeProvider<ZodTypeProvider>().put(
    '/:id',
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
        body: z.object({
          name: z.string().optional(),
          description: z.string().optional(),
          date: z.string().optional(),
          isDiet: z.boolean().optional(),
        }),
      },
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { id } = request.params
      const { name, description, date, isDiet } = request.body
      const { sessionId } = request.cookies

      const user = await prisma.user.findUnique({
        where: {
          sessionId,
        },
      })

      if (!user) {
        return reply.status(404).send('User not found!')
      }

      const meal = await prisma.meal.findFirst({
        where: {
          id,
          userId: user.id,
        },
      })

      if (!meal) {
        return reply.status(404).send('Meal not found!')
      }

      await prisma.meal.update({
        where: {
          id: meal.id,
        },
        data: {
          name,
          description,
          date,
          isDiet,
        },
      })

      return reply.status(200).send('Meal updated!')
    }
  )

  app.withTypeProvider<ZodTypeProvider>().delete(
    '/:id',
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
      },
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { id } = request.params
      const { sessionId } = request.cookies

      const user = await prisma.user.findUnique({
        where: {
          sessionId,
        },
      })

      if (!user) {
        return reply.status(404).send('User not found!')
      }

      await prisma.meal.delete({
        where: {
          id,
          userId: user.id,
        },
      })

      return reply.status(200).send('Meal deleted!')
    }
  )
}
