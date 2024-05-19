import {
  // BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { api } from 'src/common/adapters/axios.config';

import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from 'src/seed/interface/poke-response.interface';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async executeSeed() {
    try {
      const data = await api.get<PokeResponse>('/pokemon?limit=650');

      if (!data.results) {
        throw new NotFoundException('No data found');
      }

      // Create an array of promises to insert the data = Example 1
      // const insertPromiseArray = [];
      // data.results.forEach(async ({ name, url }) => {
      //   const segments = url.split('/');
      //   const no: number = Number(segments[segments.length - 2]);

      //   if (no && name) {
      //     insertPromiseArray.push(
      //       this.pokemonModel.create({
      //         no,
      //         name,
      //       }),
      //     );
      //   }
      // });

      // await Promise.all(insertPromiseArray);
      const clearPokemon = await this.pokemonModel.deleteMany({});

      this.logger.warn(`${clearPokemon.deletedCount} pokemons deleted`);

      const pokemonToInsert: { name: string; no: number }[] = [];

      data.results.forEach(({ name, url }) => {
        const segments = url.split('/');
        const no: number = Number(segments[segments.length - 2]);
        pokemonToInsert.push({ name, no });
      });

      await this.pokemonModel.insertMany(pokemonToInsert);

      return 'Seed executed successfully';
    } catch (error) {
      this.logger.error('error', error.stack, error.message);
    }
  }
}
