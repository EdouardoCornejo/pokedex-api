# Pokedex API

API **REST** de Pokémon construida con **NestJS**, **Mongoose** y **MongoDB**. Expone un CRUD de Pokémon que se pueden buscar indistintamente por **número, nombre o ObjectId**, con paginación y validación de datos, y un **seed** que importa los primeros 650 Pokémon desde la **PokeAPI** a través de un adaptador HTTP sobre Axios. Incluye configuración validada con **Joi** y un **Dockerfile multi-stage** con `docker-compose` para producción.

![Tech](https://img.shields.io/badge/NestJS-10-E0234E)
![Tech](https://img.shields.io/badge/TypeScript-5-3178C6)
![Tech](https://img.shields.io/badge/MongoDB-5-47A248)
![Tech](https://img.shields.io/badge/Mongoose-8-880000)
![Tech](https://img.shields.io/badge/Axios-1-5A29E4)
![Tech](https://img.shields.io/badge/Joi-17-0080FF)
![Tech](https://img.shields.io/badge/Swagger-OpenAPI-85EA2D)
![Tech](https://img.shields.io/badge/Docker-Compose-2496ED)

---

## Tabla de contenidos

- [Pokedex API](#pokedex-api)
  - [Tabla de contenidos](#tabla-de-contenidos)
  - [Qué hace el proyecto](#qué-hace-el-proyecto)
  - [Cómo ejecutar el proyecto](#cómo-ejecutar-el-proyecto)
    - [Requisitos](#requisitos)
    - [Instalación](#instalación)
    - [Variables de entorno](#variables-de-entorno)
    - [Base de datos con Docker](#base-de-datos-con-docker)
    - [Levantar la API](#levantar-la-api)
    - [Documentación (Swagger)](#documentación-swagger)
    - [Poblar la base de datos (seed)](#poblar-la-base-de-datos-seed)
    - [Build de producción con Docker](#build-de-producción-con-docker)
    - [Scripts disponibles](#scripts-disponibles)
  - [Endpoints](#endpoints)
  - [Cómo funciona](#cómo-funciona)
    - [1. Configuración (`config`)](#1-configuración-config)
    - [2. `pokemon`](#2-pokemon)
    - [3. `seed`](#3-seed)
    - [4. `common`](#4-common)
    - [Flujo de una petición](#flujo-de-una-petición)
  - [Tecnologías](#tecnologías)
  - [Estructura del proyecto](#estructura-del-proyecto)
  - [Personalización](#personalización)
  - [Licencia](#licencia)

---

## Qué hace el proyecto

- **CRUD de Pokémon** (`no`, `name`), ambos campos únicos e indexados en MongoDB.
- **Búsqueda flexible** en `GET /pokemon/:param`: por número de Pokédex, por `ObjectId` o por nombre (sin distinguir mayúsculas).
- **Paginación** con `limit` y `offset`, ordenada por número; `limit` por defecto configurable con `DEFAULT_LIMIT`.
- **Nombres normalizados** a minúsculas al crear y actualizar.
- **Errores controlados**: duplicados (código `11000`) → `400`, no encontrado → `404`, id inválido → `400` con `ParseMongoIdPipe`.
- **Seed** que vacía la colección e inserta los Pokémon obtenidos de la PokeAPI en una sola operación `insertMany`.
- **Variables de entorno validadas** al arrancar con un esquema Joi.
- **Página estática** (`public/index.html`) servida en la raíz con `ServeStaticModule`.
- **Imagen Docker** multi-stage (dependencias → build → runtime) con Node 20 Alpine.

---

## Cómo ejecutar el proyecto

### Requisitos

- **Node.js** 20 (el proyecto usaba `nvm use 20.11.0`)
- **npm** (o **yarn**, que es el que usa el `Dockerfile`)
- **Nest CLI** (`npm i -g @nestjs/cli`)
- **Docker** y **Docker Compose**

### Instalación

```bash
npm install
```

### Variables de entorno

Crea un `.env` a partir de `.env.example` (incluye una sección de desarrollo y otra de producción). El esquema Joi exige `API_POKEMON_URL`, `NODE_ENV` y `DB_MONGODB_URI`; la plantilla ya las trae, solo falta completar `DB_MONGODB_URI`:

```env
API_POKEMON_URL=https://pokeapi.co/api/v2
NODE_ENV=dev
DB_MONGODB_URI=mongodb://localhost:27017/nest-pokemon
DB_MONGODB_NAME=pokemonDB
DEFAULT_LIMIT=10
PORT=3000
```

### Base de datos con Docker

`docker-compose.yaml` levanta **MongoDB 5** en el puerto `27017` y persiste los datos en `./mongo`:

```bash
docker-compose up -d
```

### Levantar la API

```bash
npm run start:dev
```

La API queda disponible en `http://localhost:3000/api/v2` y la página estática en `http://localhost:3000`.

### Documentación (Swagger)

Con la API levantada, abre **Swagger UI** en:

```
http://localhost:3000/api/v2/docs
```

Ahí están todos los endpoints agrupados por etiqueta (`Pokemon`, `Seed`), con sus parámetros (`limit`, `offset`, término de búsqueda), cuerpos de ejemplo y respuestas de éxito y error (`400`, `404`, `500`); se pueden probar con **Try it out**. El documento OpenAPI en JSON se sirve en `http://localhost:3000/api/v2/docs-json` (útil para importarlo en Postman o Insomnia).

### Poblar la base de datos (seed)

```
GET http://localhost:3000/api/v2/seed
```

Borra todos los Pokémon e importa los 650 primeros desde la PokeAPI. Si la PokeAPI no responde o la importación falla, devuelve `500` en lugar de una respuesta vacía.

### Build de producción con Docker

1. Crea el archivo `.env.prod` con las variables de producción (en `.env.example` hay un ejemplo con `DB_MONGODB_URI=mongodb://mongo-poke:27017/nest-pokemon`, el nombre del contenedor de Mongo).
2. Construye y levanta la app junto a la base de datos:

```bash
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```

`docker-compose.prod.yaml` construye la imagen `pokedex-docker` (contenedor `pokedexapp`), expone `${PORT}` y le pasa `DB_MONGODB_URI`, `PORT`, `DEFAULT_LIMIT`, `NODE_ENV` y `API_POKEMON_URL`.

### Scripts disponibles

| Script                | Descripción                         |
| --------------------- | ----------------------------------- |
| `npm run start:dev`   | Modo desarrollo con _watch_         |
| `npm run start:debug` | Modo depuración con _watch_         |
| `npm run build`       | Compila a `dist/`                   |
| `npm run start`       | Ejecuta la build (`node dist/main`) |
| `npm run start:prod`  | `nest start`                        |
| `npm run lint`        | ESLint con autocorrección           |
| `npm run format`      | Prettier sobre `src/` y `test/`     |
| `npm run test`        | Tests unitarios (Jest)              |
| `npm run test:e2e`    | Tests end-to-end                    |
| `npm run test:cov`    | Cobertura de tests                  |

---

## Endpoints

Prefijo global: `/api/v2`. Documentación interactiva en [`/api/v2/docs`](http://localhost:3000/api/v2/docs).

| Método   | Ruta                      | Descripción                                             | Cuerpo / parámetros                |
| -------- | ------------------------- | ------------------------------------------------------- | ---------------------------------- |
| `POST`   | `/pokemon`                | Crea un Pokémon                                         | `{ "no": 1, "name": "bulbasaur" }` |
| `GET`    | `/pokemon?limit=&offset=` | Lista paginada ordenada por `no`                        | `limit` ≥ 1, `offset` ≥ 0          |
| `GET`    | `/pokemon/:param`         | Busca por número, `ObjectId` o nombre                   | —                                  |
| `PATCH`  | `/pokemon/:param`         | Actualiza un Pokémon localizado por número, id o nombre | `{ "name"?, "no"? }`               |
| `DELETE` | `/pokemon/:param`         | Elimina por `ObjectId` (solo acepta el id)              | —                                  |
| `GET`    | `/seed`                   | Reinicia la colección con datos de la PokeAPI           | —                                  |

> `PATCH` aplica cualquier campo enviado (`name`, `no`) y devuelve el Pokémon con los cambios; si incluye `name`, se guarda en minúsculas.

---

## Cómo funciona

`src/main.ts` crea la aplicación con `CustomLoggerService`, registra un `ValidationPipe` global (`whitelist`, `forbidNonWhitelisted`, `transform` y `enableImplicitConversion` para convertir los _query params_ a número), fija el prefijo `api/v2`, genera el documento OpenAPI con `DocumentBuilder` y monta Swagger UI en `/api/v2/docs`, y escucha en `PORT` (o `3000`).

### 1. Configuración (`config`)

- `EnvConfig` mapea las variables de entorno a claves de configuración (`mongodb`, `mongodbName`, `apiPokemon`, `defaultLimit`, `port`, `environment`).
- `JoiValidationSchema` valida tipos, valores permitidos (`NODE_ENV`: `dev` | `prod`) y valores por defecto.
- `AppModule` carga ambos en `ConfigModule.forRoot` y configura `MongooseModule.forRootAsync` con `uri` y `dbName` desde `ConfigService`.

### 2. `pokemon`

- `Pokemon` es un `@Schema` de Mongoose (extiende `Document`) con `no` y `name` únicos e indexados.
- `PokemonService`:
  - `create` normaliza el nombre y captura duplicados en `handleExceptions`.
  - `findAll` aplica `limit` (por defecto `defaultLimit`), `skip`, `sort({ no: 1 })` y oculta `__v`.
  - `findOne` prueba en orden: número (`no`), `isValidObjectId` → `findById`, y nombre.
  - `update` reutiliza `findOne` y aplica `updateOne`; `remove` usa `deleteOne` y lanza `404` si `deletedCount === 0`.
- DTOs: `CreatePokemonDto` (`no` positivo, `name` de 3 a 30 caracteres) y `UpdatePokemonDto` (`PartialType`).

### 3. `seed`

`SeedService.executeSeed` llama a `/pokemon?limit=650` mediante el adaptador `api`, extrae el número de cada Pokémon del último segmento de su `url`, vacía la colección con `deleteMany` e inserta todo con `insertMany`.

### 4. `common`

- `HttpAdapter` (clase abstracta) → `AxiosAdapter`, que envuelve `get`, `post`, `put`, `patch` y `delete` y devuelve solo `data`. La instancia `api` usa `API_POKEMON_URL` como `baseURL` (por defecto `https://pokeapi.co/api/v2`).
- `ParseMongoIdPipe` valida que el parámetro sea un `ObjectId`.
- `PaginationDto` con `limit` (≥ 1) y `offset` (≥ 0, por defecto `0`) opcionales.

### Flujo de una petición

```
Cliente HTTP
   │  GET /api/v2/pokemon/pikachu
   ▼
ValidationPipe (DTOs + conversión implícita)
   ▼
PokemonController.findOne(param)
   ▼
PokemonService.findOne()
   ├─ ¿número?    → findOne({ no })
   ├─ ¿ObjectId?  → findById()
   └─ nombre      → findOne({ name })
   ▼
Mongoose Model ──► MongoDB

GET /api/v2/seed
   ▼
SeedService ──► AxiosAdapter ──► PokeAPI
   ▼
deleteMany() + insertMany() ──► MongoDB
```

---

## Tecnologías

- **NestJS 10** — módulos, pipes y configuración.
- **@nestjs/swagger 8** — documentación OpenAPI y Swagger UI en `/api/v2/docs`.
- **MongoDB 5** + **Mongoose 8** (`@nestjs/mongoose`).
- **Axios** detrás de un adaptador (`HttpAdapter`).
- **@nestjs/config** + **Joi** para la configuración.
- **@nestjs/serve-static** para la página de `public/`.
- **class-validator** / **class-transformer**.
- **Docker** (multi-stage con `node:20.13.1-alpine3.20`) y **Docker Compose**.
- **Jest**, **ESLint** y **Prettier**.

---

## Estructura del proyecto

```
pokedex-api/
├── src/
│   ├── main.ts                       # Bootstrap: ValidationPipe, prefijo api/v2, Swagger
│   ├── app.module.ts                 # Config, ServeStatic, Mongoose y módulos
│   ├── config/
│   │   ├── env.config.ts             # EnvConfig
│   │   └── joi.schema-validation.ts  # JoiValidationSchema
│   ├── common/
│   │   ├── adapters/                 # AxiosAdapter y la instancia api
│   │   ├── interfaces/               # HttpAdapter
│   │   ├── pipes/parse-mongo-id.pipe.ts
│   │   └── dto/pagination.dto.ts
│   ├── pokemon/                      # controller, service, schema Pokemon y DTOs
│   ├── seed/                         # controller, service e interfaz PokeResponse
│   └── shared/config/log/            # CustomLoggerService
├── public/                           # index.html, css/ y assets/
├── test/                             # Tests e2e
├── Dockerfile                        # Build multi-stage
├── docker-compose.yaml               # MongoDB para desarrollo
├── docker-compose.prod.yaml          # App + MongoDB para producción
├── .env.example
└── package.json
```

---

## Personalización

| Variable          | Significado                             | Por defecto (Joi / código)    |
| ----------------- | --------------------------------------- | ----------------------------- |
| `API_POKEMON_URL` | URL base de la PokeAPI (obligatoria)    | `https://pokeapi.co/api/v2`\* |
| `NODE_ENV`        | Entorno: `dev` o `prod` (obligatoria)   | —                             |
| `DB_MONGODB_URI`  | URI de conexión a MongoDB (obligatoria) | —                             |
| `DB_MONGODB_NAME` | Nombre de la base de datos              | `pokemonDB`                   |
| `DEFAULT_LIMIT`   | `limit` por defecto en el listado       | `10`                          |
| `PORT`            | Puerto HTTP                             | `3000`                        |

\* Valor de respaldo del adaptador `api`; Joi la exige igualmente.

El número de Pokémon importados (`limit=650`) está en `src/seed/seed.service.ts`.

---

## Licencia

Proyecto de uso libre con fines educativos y de práctica.
