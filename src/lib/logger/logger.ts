import { fromPairs, toPairs, is } from 'ramda'
import morgan from 'morgan'
import { hasBody } from '../utils'
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */

morgan.token('request-info', req => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { body, query, method } = req

    if (!method) {
        return '[unsupported method]'
    }

    if (!hasBody(method)) {
        return `Q[${JSON.stringify(query)}]`
    }

    const bodyShortened = body ? clearBodyObject(body) : null

    return `B[${JSON.stringify(bodyShortened)}]`
})

const toReadableLog = (value: any) => (value && is(String, value) ? value.slice(0, 100) : value)

const clearBodyObject = (object: Record<any, any>): Record<any, any> =>
    fromPairs<any, any>(
        toPairs<Record<any, any>>(object).map(([key, value]) => {
            if (key.toLowerCase().includes('password') || key.toLowerCase().includes('passwd')) {
                return [key, '********']
            }

            if (is(Object, value)) {
                return [key, clearBodyObject(value)]
            }

            return [key, toReadableLog(value)]
        }),
    )
