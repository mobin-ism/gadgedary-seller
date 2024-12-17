import { plainToClass } from 'class-transformer'
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator'

enum Environment {
    Development = 'development',
    Production = 'production',
    Test = 'test',
    Provision = 'provision'
}

class EnvironmentVariables {
    @IsEnum(Environment)
    APP_ENV: Environment

    @IsNumber()
    APP_PORT: number

    @IsString()
    APP_URL: string

    @IsString()
    DB_HOST: string

    @IsNumber()
    DB_PORT: number

    @IsString()
    DB_USERNAME: string

    @IsString()
    DB_PASSWORD: string

    @IsString()
    DB_NAME: string

    @IsNumber()
    DEFAULT_PAGE_SIZE: number

    @IsNumber()
    RATE_LIMITER_TIME_TO_LEAVE: number

    @IsNumber()
    RATE_LIMITER_MAX_TRY: number
}

export function validate(config: Record<string, unknown>) {
    const validatedConfig = plainToClass(EnvironmentVariables, config, {
        enableImplicitConversion: true
    })
    const errors = validateSync(validatedConfig, {
        skipMissingProperties: false
    })

    if (errors.length > 0) {
        throw new Error(errors.toString())
    }
    return validatedConfig
}
