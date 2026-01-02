import { IsString, IsNotEmpty, IsEnum, IsBoolean, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FlavorType } from '@prisma/client';

export class CreateFlavorDto {
  @ApiProperty({
    description: 'ID único do sabor (slug)',
    example: 'ferrero-rocher',
    minLength: 2,
  })
  @IsString()
  @IsNotEmpty({ message: 'ID is required' })
  @MinLength(2, { message: 'ID must have at least 2 characters' })
  id: string;

  @ApiProperty({
    description: 'Nome do sabor',
    example: 'Ferrero Rocher',
    minLength: 2,
  })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(2, { message: 'Name must have at least 2 characters' })
  name: string;

  @ApiProperty({
    description: 'Tipo do sabor',
    enum: FlavorType,
    example: 'FILLING',
  })
  @IsEnum(FlavorType, { message: 'Invalid flavor type. Must be FILLING or DOUGH' })
  @IsNotEmpty({ message: 'Type is required' })
  type: FlavorType;

  @ApiPropertyOptional({
    description: 'Se o sabor está ativo',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
