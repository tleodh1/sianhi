(function(A){
 A.levels=[{id:'easy',name:'쉬움',cols:3,rows:2},{id:'normal',name:'보통',cols:3,rows:3},{id:'hard',name:'어려움',cols:4,rows:4},{id:'challenge',name:'도전',cols:5,rows:4}];
 A.Engine=class{
 constructor(level='easy',portrait=false,random=Math.random){const d=A.levels.find(d=>d.id===level)||A.levels[0];this.level=d.id;this.cols=portrait?d.rows:d.cols;this.rows=portrait?d.cols:d.rows;this.total=this.cols*this.rows;this.placed=new Set();this.selected=null;this.moves=0;this.hints=0;this.autoHints=0;this.seconds=0;this.complete=false;this.order=Array.from({length:this.total},(_,i)=>i);for(let i=this.total-1;i>0;i--){const j=Math.floor(random()*(i+1));[this.order[i],this.order[j]]=[this.order[j],this.order[i]];}}
 select(id){if(!Number.isInteger(id)||id<0||id>=this.total||this.placed.has(id)||this.complete)return false;this.selected=id;return true;}
 place(cell){if(this.selected===null||this.complete)return false;this.moves++;if(cell!==this.selected)return false;this.placed.add(cell);this.selected=null;this.complete=this.placed.size===this.total;return true;}
 hint(level){if(this.complete)return null;const id=this.selected??this.order.find(i=>!this.placed.has(i));if(level===3&&this.autoHints>=Math.max(1,Math.floor(this.total/4)))return null;this.hints++;if(level===3){this.autoHints++;this.select(id);this.place(id);}return id;}
 tick(dt){if(!this.complete&&dt>0)this.seconds+=Math.min(dt,1);}
 rating(){if(!this.complete)return 0;const budget=this.total*45;return 1+Number(this.hints<=Math.ceil(this.total/3))+Number(this.hints===0&&this.seconds<=budget);}
 };
 A.snap=function(x,y,rect,cols,rows,tolerance=.64){const w=rect.width/cols,h=rect.height/rows,c=Math.round((x-rect.left)/w-.5),r=Math.round((y-rect.top)/h-.5);if(c<0||c>=cols||r<0||r>=rows)return -1;return Math.abs(x-(rect.left+(c+.5)*w))<=w*tolerance&&Math.abs(y-(rect.top+(r+.5)*h))<=h*tolerance?r*cols+c:-1;};
})(SianArt);
