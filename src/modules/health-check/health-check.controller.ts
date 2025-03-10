import { Controller, Get } from '@nestjs/common'
import { HealthCheck, HealthCheckResult, HealthCheckService } from '@nestjs/terminus'
import { SkipThrottle } from '@nestjs/throttler'
import { Public } from 'lib/decorators'
import { format } from 'date-fns'
import { R } from 'lib/utils'
import { getConfig } from 'lib/config'
import { HEALTH_CHECK } from './constants'

@SkipThrottle()
@Controller(HEALTH_CHECK)
export class HealthCheckController {
    private readonly build: string = getConfig().healthCheckConfig.build
    private readonly date: string

    constructor(private health: HealthCheckService) {
        const timestamp = this.build !== 'unknown' ? parseInt(R.last(this.build.split('-')) || '', 10) * 1000 : null

        this.date = timestamp ? format(new Date(timestamp), 'yyyy-MM-dd HH:mm:ss') : 'unknown'
    }

    @Get()
    @Public()
    @HealthCheck()
    healthCheck(): Promise<HealthCheckResult> {
        return this.health.check([
            () => ({
                app: {
                    status: 'up',
                    build: this.build,
                    date: this.date,
                },
            }),
        ])
    }
}
