import { CustomBaseEntity } from 'src/common/entity/custom-base.entity'
import { Column, Entity, OneToMany } from 'typeorm'
import { OrderStatusEnum, PaymentStatusEnum } from '../data/status.enum'
import { OrderedProduct } from './ordered-product.entity'

@Entity()
export class Order extends CustomBaseEntity {
    @Column({
        type: 'varchar',
        length: 100,
        nullable: false
    })
    customerName: string

    @Column({
        type: 'varchar',
        length: 100,
        nullable: false
    })
    customerEmail: string

    @Column({
        type: 'enum',
        enum: OrderStatusEnum,
        default: OrderStatusEnum.PENDING,
        nullable: false
    })
    status: OrderStatusEnum

    @Column({
        type: 'enum',
        enum: PaymentStatusEnum,
        default: PaymentStatusEnum.UNPAID,
        nullable: false
    })
    paymentStatus: PaymentStatusEnum

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        nullable: true,
        default: 0
    })
    totalPrice: number

    @OneToMany(() => OrderedProduct, (orderedProduct) => orderedProduct.order, {
        cascade: true
    })
    orderedProducts: OrderedProduct[]
}
