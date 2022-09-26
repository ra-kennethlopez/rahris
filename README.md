# RHRIS API

This is an [Apollo Express GraphQL](https://www.apollographql.com/docs/apollo-server/) server

## Prerequisites

* Install [Postgres](https://www.postgresql.org/) and create a database for the server to connect as a data source
* Create a `.env` file, paste and update values from `.env-example`
* Initialize the database by running migration

# Migration

Before running migration go to `package.json` and remove the line `"type": "module"` and put it back after, this causes an error if not removed

* Migrate: `npm run dbmigrate`
* Rollback: `npm run dbrollback`

[Knex Migrations](https://knexjs.org/guide/migrations.html) for more info