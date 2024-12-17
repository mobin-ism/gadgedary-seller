import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty } from 'class-validator'
import { OrderStatusEnum } from '../data/status.enum'

export class UpdateOrderDto {
    @IsNotEmpty()
    @IsEnum(OrderStatusEnum)
    @ApiProperty({
        description: 'Order status',
        enum: OrderStatusEnum,
        enumName: 'OrderStatusEnum',
        example: `${OrderStatusEnum.PENDING}/${OrderStatusEnum.SHIPPED}/${OrderStatusEnum.DELIVERED}`
    })
    status: OrderStatusEnum
}
