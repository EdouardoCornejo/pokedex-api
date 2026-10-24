import { ApiProperty } from '@nestjs/swagger';

export class PokemonResponseDto {
  @ApiProperty({
    description: 'MongoDB ObjectId.',
    example: '6719f3c2a4b1e0c8d2f4a001',
  })
  _id: string;

  @ApiProperty({ description: 'National Pokedex number.', example: 25 })
  no: number;

  @ApiProperty({
    description: 'Pokemon name in lowercase.',
    example: 'pikachu',
  })
  name: string;

  @ApiProperty({
    description: 'Mongoose version key (omitted in the paginated list).',
    example: 0,
    required: false,
  })
  __v?: number;
}
