# G2i Node Test

This is my submission for G2i's Node Test.

The technologies I used are Typescript, Express as the main framework for the server. PostgreSQL for the DB and TypeORM to query and model the DB. And Jest for testing.

---

## Bootstrap

**See below for running with Docker**

For this application to work, Node and PostgreSQL are needed. You'll need to create a database named `g2i-node-gonzachr` and `g2i-node-gonzachr-test` for the test suites.

Then run:

```
  npm install
```

For a production environment you'll want:

```
  npm run start
```

For development:

```
  npm run dev
```

If it's the first time running the app, you'll need to seed the DB with the acronyms. Run either of the two depending on your environment:

```
  npm run dev:seed
  npm run prod:seed
```

---

## Tests

Run with

```
  npm run test
```

Tests for each item of the requirement list is written below. There is a test for each of the subitems in the test file if not stated otherwise.

- GET /acronym?from=50&limit=10&search=:search
  - `/tests/getAcronyn.test.ts`
- GET /acronym/:acronym
  - `tests/getAcronym`
- GET /random/:count?
  - `tests/random`
- POST /acronym
  - `tests/postAcronym.test.ts`
- PUT /acronym/:acronym
  - `tests/putAcronym.test.ts`
  - uses an authorization header: `tests/authentication.test.ts`
- DELETE /acronym/:acronym
  - `tests.deleteAcronym.test.ts`
  - uses an authorization header: `tests/authentication.test.ts`

---

## Running with docker

This are the commands to run with docker and docker-compose:

```
  docker build --tag g2i-node-gonzachr .
  docker-compose up
```

If it's your first time running the app, you'll need to seed the DB.

```
  docker-compose exec web npm run docker:seed
```

**Troubleshooting**

There's an issue when `docker-compose up` is first ran, that appears to be related to the DB not beign ready yet and the server starting already. If the app does not work correctly on the first run, please stop the container and run again, it should work nicely.

---

## Example cURL requests

For posting:

```
 curl -d '{"acronym":"YOLO", "meaning":"You Only Live Once"}' -H "Content-Type: application/json" -X POST http://localhost:4000/acronym
```

Not authorized deleting:

```
curl -X DELETE http://localhost:4000/acronym/TTYL
```

Login:

```
 curl -d '{"email":"user@g2i.co", "password":"pass1234"}' -H "Content-Type: application/json" -X POST http://localhost:4000/user/login
```

Authorized deleting:

```
 curl -H "Content-Type: application/json" -H "Authorization: Bearer token" -X DELETE http://localhost:4000/acronym/10X
```
