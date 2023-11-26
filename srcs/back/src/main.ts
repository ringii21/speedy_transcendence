import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import helmet from 'helmet'
import * as compression from 'compression'
import * as cookieParser from 'cookie-parser'
import { ValidationPipe } from '@nestjs/common'
import { PrismaClientExceptionFilter } from './prisma-client-exception/prisma-client-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const { httpAdapter } = app.get(HttpAdapterHost)

  app.use(helmet())
  app.use(compression())
  app.enableCors({
    origin: ['http://localhost:3001'],
    credentials: true,
  })
  app.use(cookieParser())
  app.setGlobalPrefix('api')
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter))
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  await app.listen(3000)
}
bootstrap()
