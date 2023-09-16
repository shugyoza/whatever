import fs from "fs";
import http from "http";

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

export function sendHTML(
  filePath: string,
  res: http.ServerResponse<http.IncomingMessage>
) {
  fs.readFile(filePath, (err, readResponse) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.write(JSON.stringify({ message: "Template not found." }));
    } else {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(readResponse);
    }
    res.end();
  });
}

export function sendCSS(
  filePath: string,
  res: http.ServerResponse<http.IncomingMessage>
) {
  fs.readFile(filePath, (err, readResponse) => {
    if (err) {
      console.error(err);
    } else {
      res.writeHead(200, { "Content-Type": "text/css" });
      res.write(readResponse);
    }
    res.end();
  });
}

// method to extract values from POST request body
export function extractPOSTData(req: http.IncomingMessage) {
  return new Promise((resolve, reject) => {
    try {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", () => {
        resolve(body);
      });
    } catch (err) {
      reject(err);
    }
  });
}
