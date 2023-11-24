import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import helmet from 'helmet'
import * as compression from 'compression'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.use(helmet())
  app.use(compression())
  app.enableCors({
    origin: [
      'http://localhost:3001',
      'https://api.intra.42.fr',
      'https://profile.intra.42.fr',
      'https://api.intra.42.fr/oauth/authorize',
      'https://api.intra.42.fr/oauth/token',
    ],
  })
  await app.listen(3000)
}
bootstrap()
