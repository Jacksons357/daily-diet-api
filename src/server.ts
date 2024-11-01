import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { userRoutes } from './routes/user/user'
import cookie from '@fastify/cookie'
import { mealsRoutes } from './routes/meals/meals'
import { metricsRoutes } from './routes/metrics/metrics'

export const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(cookie)

app.register(userRoutes, {
  prefix: 'user',
})

app.register(mealsRoutes, {
  prefix: 'meals',
})

app.register(metricsRoutes, {
  prefix: 'metrics',
})

app.listen({ port: 3333 }).then(() => {
  console.log('Server running!')
})
