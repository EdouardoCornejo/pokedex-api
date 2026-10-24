import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
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
  excecuteSeed() {
    return this.seedService.executeSeed();
  }
}
