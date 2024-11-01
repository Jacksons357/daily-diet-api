import fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { userRoutes } from './routes/user/user'
import cookie from '@fastify/cookie'
import { checkSessionIdExists } from './middlewares/check-session-id-exists'
import { mealsRoutes } from './routes/meals/meals'

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

app.listen({ port: 3333 }).then(() => {
  console.log('Server running!')
})
