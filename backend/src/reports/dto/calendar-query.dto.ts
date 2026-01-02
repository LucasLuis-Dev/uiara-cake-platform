import { IsInt, Min, Max, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CalendarQueryDto {
  @IsInt()
  @Min(1)
  @Max(12)
  @Type(() => Number)
  @IsOptional()
  month?: number;

  @IsInt()
  @Min(2020)
  @Max(2100)
  @Type(() => Number)
  @IsOptional()
  year?: number;
}
