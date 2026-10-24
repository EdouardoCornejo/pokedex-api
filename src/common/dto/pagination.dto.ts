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
      'Number of Pokemon to skip (sorted by Pokedex number). Must be a positive number; omit it to start from the first Pokemon.',
    minimum: 1,
    example: 20,
  })
  @IsOptional()
  @IsPositive()
  @IsNumber()
  offset?: number;
}
