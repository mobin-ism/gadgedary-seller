import { ApiProperty } from '@nestjs/swagger'
import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID
} from 'class-validator'

export class CreateProductDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    description: string

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    price: number

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    quantity: number

    @ApiProperty()
    @IsUUID()
    @IsOptional()
    categoryId: string
}
