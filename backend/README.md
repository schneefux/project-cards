Environment variables:

- CORS_ORIGIN (request origin if unset)
- DATABASE_URL (local sqlite if unset)
- IMAGE_DIR

# GraphQL Server Example

**GraphQL server with TypeScript** based on [Photon.js](https://photonjs.prisma.io/), [graphql-yoga](https://github.com/prisma/graphql-yoga) and [GraphQL Nexus](https://nexus.js.org/).

## Download example & install dependencies

```
npm install
```

### Prisma's development mode

```
prisma2 dev
```

For a MySQL provider:

```
datasource mysql {
    provider = "mysql"
    url      = "mysql://johndoe:secret42@localhost:3306/mydatabase"
}
```

To migrate your database schema, run:

```sh
prisma2 lift save --name 'init'
prisma2 lift up
```

### Seed the database with test data

```
npm run seed
```

### Start the GraphQL server

```
npm run dev
```

### Changing the GraphQL schema

To make changes to the GraphQL schema, you need to manipulate the `Query` and `Mutation` types that are defined in [`schema.ts`](./src/schema.ts).

### Use Lift to persist the schema migration

```
prisma2 lift save --name 'init'
prisma2 lift up
```

### Generate Photon.js with the CLI

In CI/CD environments it can be helpful to generate Photon.js with a CLI command.

```
prisma2 generate
```
