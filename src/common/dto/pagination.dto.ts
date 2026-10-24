import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({
    description:
      'Maximum number of Pokemon to return. Defaults to DEFAULT_LIMIT (10).',
    minimum: 1,
    example: 10,
  })
  @IsOptional()
  @IsPositive()
  @IsNumber()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({
    description:
      'Number of Pokemon to skip (sorted by Pokedex number). Defaults to 0.',
    minimum: 0,
    example: 20,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  offset?: number;
}
