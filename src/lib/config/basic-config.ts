import { EnvironmentVariables } from './environment.variables'
import { toBoolean } from 'lib/utils'
import { HttpMethods } from 'lib/common'

export const basicConfig = (configEnvs: EnvironmentVariables) => ({
    expressConfig: {
        port: configEnvs.API_PORT,
        host: configEnvs.API_HOST,
        useLogs: toBoolean(configEnvs.USE_LOGS),
        logFormat: ':remote-addr - :remote-user [:date[web]] ":method :url HTTP/:http-version" :status - :response-time ms',
    },
    corsConfig: {
        origin: configEnvs.CORS_ALLOWED_ORIGINS,
        methods: [HttpMethods.PUT, HttpMethods.GET, HttpMethods.PATCH, HttpMethods.POST, HttpMethods.OPTIONS],
    },
    throttlerConfig: {
        ttlS: configEnvs.THROTTLER_TTL_S,
        limit: configEnvs.THROTTLER_LIMIT,
    },
    bodyParserConfig: {
        limit: configEnvs.MAX_FILE_SIZE_KB,
    },
    swaggerConfig: {
        useSwagger: toBoolean(configEnvs.USE_SWAGGER),
        route: configEnvs.SWAGGER_ROUTE,
    },
})
