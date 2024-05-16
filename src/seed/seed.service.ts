import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from 'src/seed/interface/poke-response.interface';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;
  private readonly logger = new Logger(SeedService.name);

  async executeSeed() {
    try {
      const { data } = await this.axios.get<PokeResponse>(
        'https://pokeapi.co/api/v2/pokemon?limit=650',
      );

      data.results.forEach(({ name, url }) => {
        console.log('🚀 ~ SeedService ~ data.results.forEach ~ url:', url);
        const segments = url.split('/');
        const no: number = Number(segments[segments.length - 2]);
        console.log(
          '🚀 ~ SeedService ~ data.results.forEach ~ segments:',
          no,
          name,
        );
      });

      return data.results;
    } catch (error) {
      this.logger.error('error', error.stack, error.message);
    }
  }
}
