import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ThrottlerGuard, ThrottlerModule, seconds } from '@nestjs/throttler'
import { ConfigModule } from '@nestjs/config'
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n'
import path from 'node:path'
import { getConfig, envValidation } from 'lib/config'
import { ExampleModule } from 'modules/example'
import { AppService } from './app.service'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            validate: envValidation,
            validationOptions: {
                allowUnknown: true,
                abortEarly: true
            }
        }),
        TypeOrmModule.forRootAsync({
            useFactory: async () => getConfig().typeORMConfig
        }),
        ThrottlerModule.forRoot({
            throttlers: [
                {
                    ttl: seconds(getConfig().basicConfig.throttlerConfig.ttlS),
                    limit: getConfig().basicConfig.throttlerConfig.limit
                }
            ]
        }),
        I18nModule.forRoot({
            fallbackLanguage: 'en',
            loaderOptions: {
                path: path.join(__dirname, './../../i18n/'),
                watch: true
            },
            resolvers: [AcceptLanguageResolver]
        }),
        ExampleModule
    ],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        }
    ]
})
export class AppModule {}
