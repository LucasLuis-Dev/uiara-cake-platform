import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';

export class UpdateStatusDto {
  @ApiProperty({
    description: 'Novo status do pedido',
    enum: OrderStatus,
    example: 'IN_PRODUCTION',
  })
  @IsEnum(OrderStatus, { message: 'Invalid status' })
  status: OrderStatus;
}
