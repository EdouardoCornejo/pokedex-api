import axios from 'axios';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

export const api = new AxiosAdapter(
  axios.create({
    baseURL: process.env.API_URL || 'https://pokeapi.co/api/v2',
  }),
);
