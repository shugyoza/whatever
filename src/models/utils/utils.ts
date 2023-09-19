import fs from "fs";

// method to write to json passing the file path, stringified content, encoding type, and error callback
export function writeDataToFile(filePath: string, content: object) {
  const writing = JSON.stringify(content);
  const encoding = "utf-8"; // utf-8 is default value, so actually can be omitted

  // sync method, does not have organic error handling, implementation must be wrapped with try catch block
  // fs.writeFileSync(fileName, writing, encoding);

  // async method
  fs.writeFile(filePath, writing, encoding, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`${writing} had been written to ${filePath}`);
    }
  });
}
