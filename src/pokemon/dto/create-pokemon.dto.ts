import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreatePokemonDto {
  @ApiProperty({
    description: 'National Pokedex number (unique).',
    minimum: 1,
    example: 1001,
  })
  @IsNumber()
  @IsPositive()
  @Min(1)
  no: number;

  @ApiProperty({
    description: 'Pokemon name (unique, stored in lowercase).',
    minLength: 3,
    maxLength: 30,
    example: 'wo-chien',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  name: string;
}
