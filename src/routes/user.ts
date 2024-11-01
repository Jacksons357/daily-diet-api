import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z, { ZodType } from 'zod'
import prisma from '../lib/prisma'

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

  app.withTypeProvider<ZodTypeProvider>().get('/', async (request, reply) => {
    const users = await prisma.user.findMany()

    return { users }
  })
}
