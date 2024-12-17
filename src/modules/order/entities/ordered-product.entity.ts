import { CustomBaseEntity } from 'src/common/entity/custom-base.entity'
import { Product } from 'src/modules/product/entities/product.entity'
import { Column, Entity, ManyToOne } from 'typeorm'
import { Order } from './order.entity'

@Entity()
export class OrderedProduct extends CustomBaseEntity {
    @Column({
        type: 'int',
        nullable: true,
        default: 0
    })
    quantity: number

    @Column({
        type: 'string',
        nullable: false
    })
    orderId: string

    @ManyToOne(() => Order, (order) => order.orderedProducts, {
        onDelete: 'CASCADE'
    })
    order: Order

    @Column({
        type: 'string',
        nullable: false
    })
    productId: string

    @ManyToOne(() => Product, (product) => product.orderedProducts, {
        onDelete: 'CASCADE'
    })
    product: Product
}
