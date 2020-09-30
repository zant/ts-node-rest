# G2i Node Test

This is my submission for G2i's Node Test.

The technologies I used are Typescript, Express as the main framework for the server. PostgreSQL for the DB and TypeORM to query and model the DB. And Jest for testing.

## Tests

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

