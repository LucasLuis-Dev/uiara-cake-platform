import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Size, CoverageType } from '@prisma/client';

export class CreateOrderDto {
  @ApiProperty({
    description: 'ID do cliente',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty({ message: 'Customer is required' })
  customerId: string;

  @ApiProperty({
    description: 'Tamanho do bolo',
    enum: Size,
    example: 'M',
  })
  @IsEnum(Size, { message: 'Invalid size' })
  @IsNotEmpty({ message: 'Size is required' })
  size: Size;

  @ApiProperty({
    description: 'Tipo de cobertura',
    enum: CoverageType,
    example: 'CHANTILLY',
  })
  @IsEnum(CoverageType, { message: 'Invalid coverage type' })
  @IsNotEmpty({ message: 'Coverage type is required' })
  coverageType: CoverageType;

  @ApiProperty({
    description: 'ID do sabor do recheio',
    example: 'prestigio',
  })
  @IsString()
  @IsNotEmpty({ message: 'Filling is required' })
  fillingId: string;

  @ApiProperty({
    description: 'ID do sabor da massa',
    example: 'dough-chocolate',
  })
  @IsString()
  @IsNotEmpty({ message: 'Dough is required' })
  doughId: string;

  @ApiProperty({
    description: 'Data de entrega (mínimo 2 dias de antecedência)',
    example: '2026-01-10T15:00:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty({ message: 'Delivery date is required' })
  deliveryDate: string;

  @ApiPropertyOptional({
    description: 'Observações adicionais sobre o pedido',
    example: 'Escrever "Feliz Aniversário João"',
  })
  @IsString()
  @IsOptional()
  observations?: string;
}
