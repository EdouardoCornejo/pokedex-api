import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Pokemon extends Document {
  // id automatico por mongoose

  @Prop({
    unique: true,
    index: true,
  })
  no: number;

  @Prop({
    unique: true,
    index: true,
  })
  name: string;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
PokemonSchema.methods.crypto = function () {
  return 'this cript password';
}; // exemplo de metodo
