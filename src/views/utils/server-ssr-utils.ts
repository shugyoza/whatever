import fs from "fs";
import http from "http";

// UTILS for VIEWS

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

export function sendJS(
  filePath: string,
  res: http.ServerResponse<http.IncomingMessage>
) {
  fs.readFile(filePath, (err, readResponse) => {
    if (err) {
      console.error(err);
    } else {
      res.writeHead(200, { "Content-Type": "text/javascript" });
      res.write(readResponse);
    }
    res.end();
  });
}
