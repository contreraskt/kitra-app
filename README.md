KITRA APP

## Installation

1. Clone this repository
2. Create a new database named `kitra_app`
3. Run `npm install`
4. Initialize `knex` by running this command : `knex init`
5. Run the migration command : `knex migrate:latest --env development`
6. Run the seeder command : `knex seed:run --env development`
7. Run the `node app.js`


## API Reference

#### Get all treasures

```http
GET http://localhost:3000/api/treasures

```

#### Get Specific item

```http
GET http://localhost:3000/api/treasures/{id}

```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `int` | **Required**. Id of item to fetch |

#### Get Treasures by distance

```http
 GET http://localhost:3000/api/find-treasures

```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `latitude`| `double` | **Required**. latitude distance |
| `longitude`| `double` | **Required**. longitude distance |
| `distance`| `string` | **Required**. Input only "1km" or "10km" |
| `prizeValue`| `int` | **Optional**. value from 10 to 30 |

```

