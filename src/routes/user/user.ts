import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z, { ZodType } from 'zod'
import prisma from '../../lib/prisma'

export async function user(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/user',
    {
      schema: {
        body: z.object({
          username: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { username } = request.body

      await prisma.user.create({
        data: {
          username,
        },
      })

      return reply.status(200).send()
    }
  )

  app.withTypeProvider<ZodTypeProvider>().get('/', async () => {
    const users = await prisma.user.findMany()

    return { users }
  })

  app.withTypeProvider<ZodTypeProvider>().delete(
    '/user/:id',
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

      return reply.status(200).send()
    }
  )

  app.withTypeProvider<ZodTypeProvider>().put(
    '/user/:id',
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

      return reply.status(200).send()
    }
  )
}
