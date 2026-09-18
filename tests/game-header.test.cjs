const fs = require("node:fs");
const assert = require("node:assert/strict");

const games = fs.readFileSync("js/games.js", "utf8");
const style = fs.readFileSync("css/style.css", "utf8");
const runner = fs.readFileSync("css/games/hangul-runner.css", "utf8");
const art = fs.readFileSync("css/games/art-puzzle.css", "utf8");

assert.match(games, /gameHeaderTitle/);
assert.match(games, /gameHeaderBack/);
assert.match(style, /\.gameHeaderTitle[^}]*white-space:nowrap/s);
assert.match(style, /\.gameHeaderBack[^}]*white-space:nowrap/s);
assert.match(runner, /\.hr-top h2[^}]*white-space:nowrap/s);
assert.match(art, /\.art-toolbar h3[^}]*white-space:\s*nowrap/s);

console.log("PASS common game headers keep titles and back controls on one line");
