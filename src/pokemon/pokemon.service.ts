import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

enum Type {
  create = 'create',
  update = 'update',
}
@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);

      return pokemon;
    } catch (error) {
      this.handleExceptions(error, Type.create);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = this.configService.get('defaultLimit'), offset = 0 } =
      paginationDto;

    return this.pokemonModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({ no: 1 })
      .select('-__v');
  }

  async findOne(param: string): Promise<Pokemon> {
    let pokemon: Pokemon;

    if (!isNaN(Number(param))) {
      pokemon = await this.pokemonModel.findOne({ no: param });
    }

    if (!pokemon && isValidObjectId(param)) {
      pokemon = await this.pokemonModel.findById(param);
    }

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: param.toLowerCase() });
    }

    if (!pokemon) {
      throw new NotFoundException(
        `Pokemon with id, name or no ${param} not found`,
      );
    }

    return pokemon;
  }

  async update(param: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(param);

    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

      try {
        const updatedPokemon = await pokemon.updateOne(updatePokemonDto);
        return { ...pokemon.toJSON(), ...updatedPokemon };
      } catch (error) {
        this.handleExceptions(error, Type.update, param);
      }
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if (deletedCount === 0) {
      throw new NotFoundException(`Pokemon with id ${id} not found`);
    }
    return true;
  }

  private handleExceptions(error: any, type: Type, param?: string) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon already exists ${JSON.stringify(error.keyValue)}`,
      );
    }
    throw new InternalServerErrorException(
      ` Can't ${type} Pokemon with id, name or no ${param}`,
    );
  }
}
