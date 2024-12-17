import { CustomBaseEntity } from 'src/common/entity/custom-base.entity'
import { Column, Entity } from 'typeorm'

@Entity()
export class Seller extends CustomBaseEntity {
    @Column({
        type: 'varchar',
        length: 255,
        nullable: false
    })
    name: string

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
        unique: true
    })
    email: string

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
        unique: true
    })
    phone: string
}
