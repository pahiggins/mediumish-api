# NC Knews

API for use with NC Knews web app.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See 'Deployment' for notes on how to deploy the project on a live server.

In your terminal, run the following commands from the project root:

```
git clone https://github.com/pahiggins/BE2-NC-Knews.git
cd BE2-NC-Knews
npm install
```

## Prerequisites

- Node v10.12.0
- PostgreSQL v10.6

## Running Development Server

In your terminal, run the following command from the project root:

```
npm run create:config
```

Configure your knexfile.js file (see https://knexjs.org/#Installation-node), then run the following commands:

```
npm run create:db
npm run seed:run:dev
npm run dev
```

View available API at http://localhost:3000/api.

## Running Tests

In your terminal, run the following command from the project root:

```
npm run create:config
```

Configure your knexfile.js file (see https://knexjs.org/#Installation-node), then run the following commands:

```
npm run create:db
npm run seed:run:test
npm test
```

## Deployment

Additional notes about how to deploy this on a live server.

## Built With

* [Node](https://nodejs.org/en/) - JS runtime
* [Express](https://expressjs.com/) - Web application framework
* [Knex](https://knexjs.org) - SQL query builder
* [PostgreSQL](https://www.postgresql.org/) - Relational database

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/pahiggins/BE2-NC-Knews/tags).

## Authors

* **Peter Higgins** - [GitHub Profile](https://github.com/pahiggins)

See also the list of [contributors](https://github.com/pahiggins/BE2-NC-Knews/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

Fellow Northcoders and tutors ;-)