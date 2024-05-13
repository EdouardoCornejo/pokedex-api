import {
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreatePokemonDto {
  // isInt, Is Positive, min1
  @IsNumber()
  @IsPositive()
  @Min(1)
  no: number;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  //isString, Minlenght 3, Maxlength 30
  name: string;
}
