import { Body, Controller, HttpStatus, Post, Request } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'

import { LoginDto, RegistrationDto } from './dto/auth.dto'
import { AuthService } from './service/auth.service'

@ApiTags('🌏 🔒 Auth API')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @ApiOperation({
        summary: 'Login Endpoint'
    })
    @ApiResponse({
        description: 'Something went wrong',
        status: HttpStatus.BAD_REQUEST
    })
    @ApiResponse({
        description: 'Login successful',
        status: HttpStatus.OK
    })
    async login(@Body() loginDto: LoginDto, @Request() req) {
        return {
            statusCode: HttpStatus.OK,
            message: 'Login done successfully',
            result: await this.authService.login(req, loginDto)
        }
    }

    @Post('registration')
    @ApiOperation({
        summary: 'Registration Endpoint'
    })
    @ApiResponse({
        description: 'Something went wrong',
        status: HttpStatus.BAD_REQUEST
    })
    @ApiResponse({
        description: 'Registration successful',
        status: HttpStatus.CREATED
    })
    async registration(
        @Body() registrationDto: RegistrationDto,
        @Request() req
    ) {
        return {
            statusCode: HttpStatus.CREATED,
            message: 'Registration done successfully',
            result: await this.authService.registration(req, registrationDto)
        }
    }
}
