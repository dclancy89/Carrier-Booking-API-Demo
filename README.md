## Description

A simple NestJS backend to support a basic appointment booking application.

## Installation

```bash
$ npm install
```

## Running the app

The app required a `.env` file with the following structure:

```bash
DB_HOST='localhost'
DB_PORT=5438
DB_USERNAME='username'
DB_PASSWORD='password'
DB_NAME='db_name'
MAPBOX_TOKEN='TOKEN'
```

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
