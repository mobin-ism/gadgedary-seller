import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductModule } from '../product/product.module'
import { Order } from './entities/order.entity'
import { OrderController } from './order.controller'
import { OrderService } from './order.service'

@Module({
    imports: [TypeOrmModule.forFeature([Order]), ProductModule],
    controllers: [OrderController],
    providers: [OrderService]
})
export class OrderModule {}
