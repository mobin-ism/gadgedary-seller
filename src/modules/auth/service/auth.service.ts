import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcryptjs'
import { User } from 'src/modules/users/entities/user.entity'
import { Repository } from 'typeorm'
import { LoginDto, RegistrationDto } from '../dto/auth.dto'
import { JwtService } from './jwt.service'

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @Inject(JwtService)
        private readonly jwtService: JwtService
    ) {}

    async login(req: any, loginDto: LoginDto) {
        const user: User = await this.getAUser({
            email: loginDto.email
        })

        if (!user) {
            throw new HttpException(
                'Invalid User credentials',
                HttpStatus.BAD_REQUEST
            )
        }
        try {
            const isPasswordValid: boolean = this.jwtService.isPasswordValid(
                loginDto.password,
                user.password
            )
            if (!isPasswordValid) {
                throw new HttpException(
                    'Invalid User credentials',
                    HttpStatus.BAD_REQUEST
                )
            }
        } catch (error) {
            throw new HttpException(
                'Invalid User credentials',
                HttpStatus.BAD_REQUEST
            )
        }

        return await this.unifiedAuthResponse(user)
    }

    /**
     * REGISTRATION
     *
     * @param   {RegistrationDto}  registrationDto  [registrationDto description]
     *
     * @return  {[type]}                            [return description]
     */
    async registration(req: any, registrationDto: RegistrationDto) {
        if (registrationDto.password != registrationDto.confirmPassword) {
            throw new HttpException(
                'Password Mismatched',
                HttpStatus.BAD_REQUEST
            )
        }
        const previousData = await this.userRepository.findOne({
            where: {
                email: registrationDto.email
            }
        })

        if (previousData) {
            throw new HttpException('Email already exists', HttpStatus.CONFLICT)
        }

        try {
            let userToRegister: User

            const salt = await bcrypt.genSaltSync(10)
            const hashedPassword = await bcrypt.hash(
                registrationDto.password,
                salt
            )

            userToRegister = new User()
            userToRegister.name = registrationDto.name
            userToRegister.email = registrationDto.email
            userToRegister.password = hashedPassword

            const registeredUser =
                await this.userRepository.save(userToRegister)

            return await this.unifiedAuthResponse(registeredUser)
        } catch (error) {
            console.log(error)
            throw new HttpException(
                'An error occurred while registering a user',
                HttpStatus.BAD_REQUEST
            )
        }
    }

    /**
     * GET A USER
     */
    async getAUser(condition: any) {
        return await this.userRepository.findOne({
            select: {
                id: true,
                email: true,
                password: true,
                name: true,
                phone: true
            },
            where: condition
        })
    }

    /**
     * UNIFIED RESPONSE FOR AUTH
     */
    async unifiedAuthResponse(user: User | any) {
        const token: string = this.jwtService.generateToken(user)
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            userType: user.userType,
            phone: user.phone,
            token: token
        }
    }
}
