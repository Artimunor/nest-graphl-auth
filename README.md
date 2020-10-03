<h1>Nest GraphQL Passport Authentication</h1>

## Description

[Nest](https://github.com/nestjs/nest), [GraphQL](https://graphql.org/) & [Passport](http://www.passportjs.org/) based [Authentication](https://en.wikipedia.org/wiki/Authentication)

## Installation

```bash
$ npm install
```

## Configuration

Create a `.env` file with the following content:

```
JWT_SECRET=x
SERVER_HOST=localhost
SERVER_PORT=3000
FRONTEND_HOST=http://localhost
FRONTEND_PORT=3050
TYPEORM_CONNECTION=
TYPEORM_HOST=localhost
TYPEORM_USERNAME=admin
TYPEORM_PASSWORD=admin
TYPEORM_DATABASE=auth
TYPEORM_PORT=5432
TYPEORM_SYNCHRONIZE=true
TYPEORM_LOGGING=true
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_SECRET=x
EMAIL_ACTIVATED=false
EMAIL_TRANSPORT=x
EMAIL_FROM=x
EMAIL_SENDER_NAME=x
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Stay in touch

- Author - [Daniel de Witte](https://dewitte.info)

## License

[MIT licensed](LICENSE).
