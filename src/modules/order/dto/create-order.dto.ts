import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
    IsArray,
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested
} from 'class-validator'
import { OrderStatusEnum } from '../data/status.enum'
import { OrderedProductDto } from './ordered-product.dto'

export class CreateOrderDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty({
        message: 'Customer name is required'
    })
    customerName: string

    @ApiProperty()
    @IsEmail()
    @IsNotEmpty({
        message: 'Customer email is required'
    })
    customerEmail: string

    @ApiProperty({
        description: 'List of order items',
        type: [OrderedProductDto],
        example: [
            { productId: 'product-uuid-1', quantity: 2 },
            { productId: 'product-uuid-2', quantity: 1 }
        ]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderedProductDto)
    orderedProducts: OrderedProductDto[]

    @IsNumber()
    @IsOptional()
    totalPrice: number

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
