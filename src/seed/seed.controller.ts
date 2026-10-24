import { Controller, Get } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponseDto } from 'src/common/dto/error-response.dto';
import { SeedService } from './seed.service';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @ApiOperation({
    summary: 'Seed the database',
    description:
      'Deletes every Pokemon and imports the first 650 from PokeAPI (https://pokeapi.co).',
  })
  @ApiOkResponse({
    description: 'Seed finished.',
    schema: { type: 'string', example: 'Seed executed successfully' },
  })
  @ApiInternalServerErrorResponse({
    description: 'PokeAPI could not be reached or the import failed.',
    type: ErrorResponseDto,
  })
  excecuteSeed() {
    return this.seedService.executeSeed();
  }
}
