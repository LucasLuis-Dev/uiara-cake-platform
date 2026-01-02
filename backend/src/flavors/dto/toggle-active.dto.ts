import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ToggleActiveDto {
  @ApiProperty({
    description: 'Ativar ou desativar o sabor',
    example: true,
  })
  @IsBoolean()
  active: boolean;
}
