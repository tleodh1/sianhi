import http from "node:http";
import fs from "node:fs";
import path from "node:path";
const i = process.argv.indexOf("--port"),
  port = i >= 0 ? Number(process.argv[i + 1]) : 4173,
  root = process.cwd();
const types = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".json": "application/json",
};
http
  .createServer((req, res) => {
    const p = path.resolve(
      root,
      "." +
        (decodeURIComponent(req.url.split("?")[0]) === "/"
          ? "/index.html"
          : decodeURIComponent(req.url.split("?")[0])),
    );
    if (!p.startsWith(root + "/")) {
      res.writeHead(403);
      return res.end();
    }
    fs.readFile(p, (e, b) => {
      res.writeHead(e ? 404 : 200, {
        "Content-Type": types[path.extname(p)] || "application/octet-stream",
        "Cache-Control": "no-cache",
      });
      res.end(e ? "Not found" : b);
    });
  })
  .listen(port, "0.0.0.0", () => console.log(`SianHi ${port}`));
