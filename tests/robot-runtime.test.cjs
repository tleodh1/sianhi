const fs=require("node:fs"),assert=require("node:assert/strict");
const core=fs.readFileSync("js/core.js","utf8"),game=fs.readFileSync("js/games/robot/game.js","utf8");
assert.match(core,/cleanup\(fn\)[\s\S]*this\.cleanups\.push\(fn\)/);
assert.match(core,/function notice\(message\)[\s\S]*notify\(message\)/);
assert.match(game,/Session\.cleanup\(/);
assert.match(game,/notice\("🤖/);
console.log("PASS robot runtime lifecycle and notification compatibility");
