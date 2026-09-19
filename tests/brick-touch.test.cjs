const assert = require("node:assert/strict");
const fs = require("node:fs");

const js = fs.readFileSync("js/games/brick/game.js", "utf8");
const css = fs.readFileSync("css/games/brick.css", "utf8");

assert.match(js, /matchMedia\("\(pointer: coarse\)"\)/);
assert.match(js, /scene\.onpointerdown/);
assert.match(js, /scene\.onpointermove/);
assert.match(js, /onpointercancel/);
assert.match(js, /setPointerCapture/);
assert.match(js, /Session\.key/);
assert.match(js, /손가락으로 받침대를 움직여요/);
assert.match(css, /touch-action:none/);
assert.match(css, /min-width:84px/);

console.log("PASS brick pointer drag, keyboard, adaptive copy, mobile controls");
