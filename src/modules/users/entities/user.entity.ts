import { Exclude } from 'class-transformer'
import { IsEmail, IsString } from 'class-validator'
import { CustomBaseEntity } from 'src/common/entity/custom-base.entity'
import { Column, Entity } from 'typeorm'
import { UserTypes } from '../data/user-type.enum'
@Entity()
export class User extends CustomBaseEntity {
    @Column({ type: 'varchar', length: 30, nullable: true })
    name: string

    @Column({
        type: 'varchar',
        length: 50,
        unique: true,
        nullable: false
    })
    @IsEmail()
    email: string

    @Exclude()
    @Column({ type: 'varchar', length: 255, nullable: false })
    @IsString()
    password: string

    @Column({
        type: 'enum',
        enum: UserTypes,
        nullable: false,
        default: UserTypes.SELLER
    })
    userType: string

    @Column({ type: 'varchar', length: 15, nullable: true })
    phone: string
}
