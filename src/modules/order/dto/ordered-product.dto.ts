import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsPositive, IsUUID } from 'class-validator'

export class OrderedProductDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsUUID()
    productId: string

    @ApiProperty()
    @IsPositive()
    quantity: number
}
