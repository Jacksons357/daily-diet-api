import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'
import prisma from '../../lib/prisma'
import { randomUUID } from 'node:crypto'

export async function userRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/',
    {
      schema: {
        body: z.object({
          username: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { username } = request.body

      let sessionId = request.cookies.sessionId

      if (!sessionId) {
        sessionId = randomUUID()

        reply.cookie('sessionId', sessionId, {
          path: '/',
          maxAge: 60 * 60 * 24 * 7, // 7 days
        })
      }

      await prisma.user.create({
        data: {
          username,
        },
      })

      return reply.status(200).send('User created')
    }
  )

  app.withTypeProvider<ZodTypeProvider>().get('/', async () => {
    const users = await prisma.user.findMany()

    return { users }
  })

  app.withTypeProvider<ZodTypeProvider>().delete(
    '/:id',
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params

      if (!id) {
        return reply.status(404).send('User not found!')
      }

      await prisma.user.delete({
        where: {
          id: id,
        },
      })

      return reply.status(200).send('User deleted')
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
          username: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const { username } = request.body

      await prisma.user.update({
        where: { id: id },
        data: {
          username: username,
        },
      })

      return reply.status(200).send('Updated user')
    }
  )
}
