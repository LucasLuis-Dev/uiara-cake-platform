import { IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


export class CreateCustomerDto {
  @ApiProperty({
    description: 'Nome completo do cliente',
    example: 'Maria Silva',
    minLength: 2,
  })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name: string;

  @ApiProperty({
    description: 'Telefone do cliente',
    example: '(81) 98765-4321',
    minLength: 10,
  })
  @IsString()
  @IsNotEmpty({ message: 'Phone is required' })
  @MinLength(10, { message: 'Invalid phone number' })
  phone: string;

  @ApiPropertyOptional({
    description: 'WhatsApp do cliente (se diferente do telefone)',
    example: '(81) 99999-8888',
  })
  @IsString()
  @IsOptional()
  whatsapp?: string;

  @ApiPropertyOptional({
    description: 'Endereço completo do cliente',
    example: 'Rua das Flores, 123, Boa Viagem',
  })
  @IsString()
  @IsOptional()
  address?: string;
}
