import { existsSync } from "fs";
import { writeFileSync } from "fs";
import { join } from "path";

const testTemplate = `
  import { Application } from "express";
  import { Connection } from "typeorm";
  import { createApp } from "../app";
  import { Maybe } from "../types";
  import { createTypeormConn } from "../utils/createTypeormConn";

  let app: Application;
  let connection: Maybe<Connection>;

  beforeAll(async () => {
    app = await createApp();
    connection = await createTypeormConn();
  });

  describe("Test", () => {
    it("Tests", () => {
      expect(2 + 2).toEqual(1);
    });
  });

  afterAll(async () => {
    await connection?.close();
  });
`;

const checkIfExists = (path: string) => {
  if (existsSync(path)) throw new Error("A test with that name already exists");
};

const testName = process.argv.slice(2)[0];

if (testName !== undefined) {
  const fileExtension = ".test.ts";
  const hasFileExtension = testName.indexOf(fileExtension) !== -1;
  const fileName = hasFileExtension ? testName : testName + fileExtension;
  const filePath = join(__dirname, `../tests/${fileName}`);
  try {
    checkIfExists(filePath);
    writeFileSync(filePath, testTemplate);
    console.log(`Test file created at ${filePath} ✨`);
  } catch (e) {
    console.error(
      `An error ocurred while creating the test file: ${e.message}\n`
    );
    console.error(e.stack);
  }
} else {
  console.error("Please provide a test name");
}
