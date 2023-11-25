import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import helmet from 'helmet'
import * as compression from 'compression'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(helmet())
  app.use(compression())
  app.enableCors({
    origin: ['http://localhost:3001'],
    credentials: true,
  })
  app.use(cookieParser())
  app.setGlobalPrefix('api')

  await app.listen(3000)
}
bootstrap()
