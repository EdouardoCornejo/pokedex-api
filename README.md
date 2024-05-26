<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# Ejecutar en desarrollo

1. Clonar el repositorio
2. Tener nvm 20.11.0 Instalado

```
  nvm use 20.11.0
```

3. Ejecutar

```
  npm install
```

4. Tener Nest CLI Instalado

```
npm i -g @nestjs/cli
```

5. Levantar la base de datos

```
docker-compose up -d
```

6.  Reconstruir la base de datos con la semilla

```
http://localhost:3000/api/v2/seed
```

# Stack usado

- MongoDB
- NestJs

# Production Build

1. Crear el archivo `.env.prod`
2. Llenar las variables de entorno de prod.
3. Crear la nueva imagen.

```
  docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```
