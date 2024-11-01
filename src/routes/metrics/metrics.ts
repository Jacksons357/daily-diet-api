import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { checkSessionIdExists } from '../../middlewares/check-session-id-exists'
import prisma from '../../lib/prisma'

export async function metricsRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies

      const user = await prisma.user.findFirst({
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

      let totMeals = 0
      let totIsDiet = 0
      let totIsNotDiet = 0
      const mealsInDiet = []

      // Menos consulta ao banco
      for (const meal of meals) {
        totMeals++
        if (meal.isDiet) {
          totIsDiet++
          mealsInDiet.push(meal)
        } else {
          totIsNotDiet++
        }
      }

      // ---- Mais consultas ao banco
      // const totMeals = await prisma.meal.count({
      //   where: {
      //     userId: user.id,
      //   },
      // })

      // const totIsDiet = await prisma.meal.count({
      //   where: {
      //     userId: user.id,
      //     isDiet: true,
      //   },
      // })

      // const totIsNotDiet = await prisma.meal.count({
      //   where: {
      //     userId: user.id,
      //     isDiet: false,
      //   },
      // })

      // const mealsInDiet = await prisma.meal.findMany({
      //   where: {
      //     userId: user.id,
      //     isDiet: true,
      //   },
      //   orderBy: {
      //     date: 'asc',
      //   },
      // })

      return {
        totMeals: totMeals,
        totIsDiet: totIsDiet,
        totIsNotDiet: totIsNotDiet,
        mealsInDiet: mealsInDiet,
      }
    }
  )
}
