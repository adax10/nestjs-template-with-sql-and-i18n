import { ShutdownSignal, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import helmet from 'helmet'
import morgan from 'morgan'
import { json } from 'body-parser'
import { AppModule } from 'modules/app'
import { getConfig } from 'lib/config'
import { HttpMethodGuard } from 'lib/guards'
import { ContentTypeInterceptor } from 'lib/interceptors'

const bootstrap = async () => {
    const { expressConfig, bodyParserConfig, corsConfig, swaggerConfig } = getConfig().basicConfig
    const { port, host, useLogs, logFormat } = expressConfig

    const app = await NestFactory.create<NestExpressApplication>(AppModule)

    app.use(
        helmet({
            noSniff: true,
            hidePoweredBy: true
        })
    )

    app.enableCors(corsConfig)
    app.useGlobalGuards(new HttpMethodGuard())
    app.useGlobalInterceptors(new ContentTypeInterceptor())
    app.use(json(bodyParserConfig))
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
    app.enableShutdownHooks([ShutdownSignal.SIGINT, ShutdownSignal.SIGTERM])

    if (useLogs) {
        app.use(morgan(logFormat))
    }

    if (swaggerConfig.useSwagger) {
        const config = new DocumentBuilder().build()
        const document = SwaggerModule.createDocument(app, config)

        SwaggerModule.setup(swaggerConfig.route, app, document)
    }

    await app.listen(port, host)
}

bootstrap()
