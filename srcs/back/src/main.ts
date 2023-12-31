import { HttpAdapterHost, NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import helmet from 'helmet'
import * as compression from 'compression'
import * as cookieParser from 'cookie-parser'
import { ValidationPipe } from '@nestjs/common'
import { PrismaClientExceptionFilter } from './prisma-client-exception/prisma-client-exception.filter'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const { httpAdapter } = app.get(HttpAdapterHost)

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  )
  app.setGlobalPrefix('api')
  app.use(compression())
  app.enableCors({
    origin: ['http://localhost:3001'],
    credentials: true,
  })
  app.use(cookieParser())
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter))
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/public',
  })
  await app.listen(3000)
}
bootstrap()
