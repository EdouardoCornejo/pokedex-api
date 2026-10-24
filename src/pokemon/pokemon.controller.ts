import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PokemonResponseDto } from './dto/pokemon-response.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';

const TERM_PARAM_DESCRIPTION =
  'Search term: Pokedex number (e.g. 25), MongoDB ObjectId or name (case-insensitive, e.g. pikachu).';

@ApiTags('Pokemon')
@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a Pokemon',
    description: 'The name is stored in lowercase. `no` and `name` are unique.',
  })
  @ApiCreatedResponse({
    description: 'Pokemon created.',
    type: PokemonResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Invalid body (validation errors, unknown properties) or a Pokemon with the same `no` or `name` already exists.',
    type: ErrorResponseDto,
  })
  create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonService.create(createPokemonDto);
  }

  @Get()
  @ApiOperation({
    summary: 'List Pokemon',
    description: 'Paginated list sorted by Pokedex number (`no`).',
  })
  @ApiOkResponse({
    description: 'A page of Pokemon.',
    type: PokemonResponseDto,
    isArray: true,
  })
  @ApiBadRequestResponse({
    description: 'Invalid `limit` or `offset`, or unknown query parameters.',
    type: ErrorResponseDto,
  })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.pokemonService.findAll(paginationDto);
  }

  @Get(':param')
  @ApiOperation({
    summary: 'Find a Pokemon',
    description:
      'Looks the Pokemon up by Pokedex number, then by ObjectId, then by name.',
  })
  @ApiParam({
    name: 'param',
    description: TERM_PARAM_DESCRIPTION,
    example: 'pikachu',
  })
  @ApiOkResponse({ description: 'Pokemon found.', type: PokemonResponseDto })
  @ApiNotFoundResponse({
    description: 'No Pokemon matches the term.',
    type: ErrorResponseDto,
  })
  findOne(@Param('param') param: string) {
    return this.pokemonService.findOne(param);
  }

  @Patch(':param')
  @ApiOperation({
    summary: 'Update a Pokemon',
    description:
      'Partial update: send only the fields to change. The Pokemon is located the same way as in GET /pokemon/{param}.',
  })
  @ApiParam({
    name: 'param',
    description: TERM_PARAM_DESCRIPTION,
    example: '25',
  })
  @ApiOkResponse({
    description: 'Pokemon with the changes applied.',
    type: PokemonResponseDto,
  })
  @ApiBadRequestResponse({
    description:
      'Invalid body or the new `no`/`name` already belongs to another Pokemon.',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'No Pokemon matches the term.',
    type: ErrorResponseDto,
  })
  @ApiInternalServerErrorResponse({
    description: 'The update could not be applied.',
    type: ErrorResponseDto,
  })
  update(
    @Param('param') param: string,
    @Body() updatePokemonDto: UpdatePokemonDto,
  ) {
    return this.pokemonService.update(param, updatePokemonDto);
  }

  // Same path segment name as GET/PATCH: OpenAPI forbids /pokemon/{param} and /pokemon/{id} side by side
  @Delete(':param')
  @ApiOperation({ summary: 'Delete a Pokemon by MongoDB ObjectId' })
  @ApiParam({
    name: 'param',
    description:
      'MongoDB ObjectId of the Pokemon (number and name are not accepted here).',
    example: '6719f3c2a4b1e0c8d2f4a001',
  })
  @ApiOkResponse({
    description: 'Pokemon deleted. The body is `true`.',
    schema: { type: 'boolean', example: true },
  })
  @ApiBadRequestResponse({
    description: '`id` is not a valid MongoDB ObjectId.',
    type: ErrorResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'No Pokemon with that id.',
    type: ErrorResponseDto,
  })
  remove(@Param('param', ParseMongoIdPipe) id: string): Promise<boolean> {
    return this.pokemonService.remove(id);
  }
}
