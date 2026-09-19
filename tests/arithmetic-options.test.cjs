const fs=require('node:fs'),vm=require('node:vm'),a=require('node:assert/strict');
const context={state:{stage100:{}},Math:Object.create(Math)};context.Math.random=Math.random;vm.createContext(context);
vm.runInContext(fs.readFileSync('js/learning.js','utf8'),context);
const positions=[];
for(let i=0;i<100;i++){
 const q=vm.runInContext(`stageQuestion('연산',${i%100+1})`,context),answer=String(q.ans);
 a.equal(q.opts.length,4);a.equal(new Set(q.opts.map(String)).size,4);a.equal(q.opts.map(String).filter(v=>v===answer).length,1);
 positions.push(q.opts.map(String).indexOf(answer));
}
const counts=[0,0,0,0];positions.forEach(p=>counts[p]++);
a.deepEqual(counts,[25,25,25,25]);
for(let i=2;i<positions.length;i++)a(!(positions[i]===positions[i-1]&&positions[i]===positions[i-2]));
const css=fs.readFileSync('css/style.css','utf8');a.match(css,/max-width:340px/);a.match(css,/min-height:62px/);
console.log('PASS 100 arithmetic questions: unique options, exact one answer, balanced positions',counts);
