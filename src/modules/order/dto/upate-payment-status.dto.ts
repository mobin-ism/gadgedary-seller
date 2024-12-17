import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'
import { PaymentStatusEnum } from '../data/status.enum'

export class UpdatePaymentStatusDto {
    @IsEnum(PaymentStatusEnum)
    @ApiProperty({
        enum: PaymentStatusEnum,
        example: PaymentStatusEnum.PAID
    })
    paymentStatus: PaymentStatusEnum
}
