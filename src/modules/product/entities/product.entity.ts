import { CustomBaseEntity } from 'src/common/entity/custom-base.entity'
import { Category } from 'src/modules/category/entities/category.entity'
import { OrderedProduct } from 'src/modules/order/entities/ordered-product.entity'
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'

@Entity()
export class Product extends CustomBaseEntity {
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

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: true,
        default: 0
    })
    price: number

    @Column({
        type: 'int',
        nullable: true,
        default: 0
    })
    quantity: number

    @Column({
        type: 'string',
        nullable: true
    })
    categoryId: string

    @ManyToOne(() => Category, (category) => category.products, {
        onDelete: 'CASCADE'
    })
    category: Category

    @OneToMany(
        () => OrderedProduct,
        (orderedProduct) => orderedProduct.product,
        {
            cascade: true
        }
    )
    orderedProducts: OrderedProduct[]
}
