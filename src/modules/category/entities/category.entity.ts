import { CustomBaseEntity } from 'src/common/entity/custom-base.entity'
import { Product } from 'src/modules/product/entities/product.entity'
import { Column, Entity, OneToMany } from 'typeorm'

@Entity()
export class Category extends CustomBaseEntity {
    @Column({
        type: 'varchar',
        length: 255,
        nullable: false
    })
    name: string

    @Column({
        type: 'text',
        nullable: true
    })
    description: string

    @OneToMany(() => Product, (product) => product.category, {
        cascade: true
    })
    products: Product[]
}
