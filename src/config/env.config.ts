enum NODE_ENV {
  DEV = 'dev',
  PROD = 'prod',
}

const defaultPort = 3000;

export const EnvConfig = () => ({
  apiPokemon: process.env.API_POKEMON_URL,
  environment: process.env.NODE_ENV || NODE_ENV.DEV,
  mongodb: process.env.DB_MONGODB_URI,
  mongodbName: process.env.DB_MONGODB_NAME,
  defaultLimit: Number(process.env.DEFAULT_LIMIT) || 10,
  port: Number(process.env.PORT) || defaultPort,
});
