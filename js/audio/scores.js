/* Original SianHi compositions, authored as notes/rhythm. No imported melodies/MIDI. */
(function(g){
const tracks={};
function song(id,title,bpm,root,lead,bass,melodies,rhythm,chords,swing=0){tracks[id]={id,title,bpm,root,lead,bass,melodies,rhythm,chords,swing,bars:32};}
song('forest','새싹 발걸음',124,60,'flute','pluck',[[0,4,7,9,7,4,2,7],[9,11,7,4,5,9,12,7],[4,2,0,7,5,4,9,2]],[1,0,1,1,0,1,1,0],[0,5,2,7,9,5,7,0]);
song('ocean','기포의 왈츠',98,62,'marimba','sine',[[0,7,4,11,9,4,7,2],[12,9,7,2,4,11,7,9],[4,9,12,11,7,2,4,0]],[1,0,0,1,1,0,1,0],[0,9,5,2,7,5,9,0],.12);
song('sky','구름 우편',138,65,'flute','sine',[[7,12,9,16,12,7,4,9],[11,7,14,12,9,5,7,12],[4,7,12,14,11,9,16,12]],[1,1,0,1,0,1,0,1],[0,7,9,5,2,5,7,0]);
song('underground','수정 회랑',108,57,'bell','triangle',[[0,3,7,10,7,2,3,5],[7,10,12,5,3,8,7,2],[12,10,7,3,5,2,8,7]],[1,0,0,1,0,1,0,0],[0,8,3,7,5,8,7,0]);
song('dinosaur','발자국 행진',116,55,'pluck','triangle',[[0,0,7,5,3,7,10,5],[3,7,12,10,5,3,7,0],[10,7,5,12,3,5,7,3]],[1,1,0,1,1,0,0,1],[0,3,5,0,8,5,7,0],.08);
song('ice','눈꽃 종소리',104,67,'bell','sine',[[0,7,11,4,12,9,7,4],[9,14,12,7,11,4,9,7],[16,12,11,7,9,4,2,7]],[1,0,1,0,0,1,0,1],[0,9,2,5,7,9,5,0]);
song('fire','불씨 도약',146,57,'pluck','sawtooth',[[0,3,2,7,10,7,5,3],[12,10,7,8,7,3,5,2],[3,7,10,12,8,5,7,2]],[1,1,1,0,1,0,1,1],[0,8,5,7,3,8,7,0]);
song('lightning','번개 궤도',142,61,'synth','triangle',[[0,7,2,9,4,11,7,2],[12,4,9,7,14,11,2,7],[9,2,11,4,12,7,14,9]],[1,0,1,1,0,1,0,1],[0,2,9,5,7,2,5,0]);
song('space','별자리 항해',120,64,'synth','sine',[[0,7,12,11,4,9,14,7],[16,12,7,9,11,14,12,4],[7,11,16,14,12,9,4,7]],[1,0,0,1,1,0,0,1],[0,9,5,7,2,5,9,0]);
song('brick','통통 별빛',144,62,'marimba','pluck',[[0,4,12,7,9,2,7,4],[12,7,14,9,4,11,7,2],[9,4,7,12,14,11,7,0]],[1,1,0,1,1,0,1,0],[0,5,9,7,2,5,7,0]);
song('memory','알파벳 피크닉',100,60,'bell','sine',[[0,2,7,4,9,7,2,4],[4,9,7,12,11,7,4,2],[7,4,2,9,12,7,4,0]],[1,0,1,0,1,0,0,0],[0,5,9,2,7,5,7,0]);
song('claw','장난감 회전목마',110,65,'marimba','pluck',[[0,7,9,7,4,2,5,4],[12,9,4,7,11,9,5,2],[4,7,2,5,9,12,7,0]],[1,0,1,1,0,0,1,0],[0,9,5,7,2,9,7,0],.15);
song('shape','그림 속 산책',86,62,'flute','sine',[[0,4,9,7,2,5,4,0],[7,11,9,4,12,7,5,2],[9,7,4,2,5,9,7,0]],[1,0,0,0,1,0,1,0],[0,5,2,9,7,5,2,0]);
song('tetris','블록 조립선',128,57,'pluck','triangle',[[0,7,3,10,5,12,7,3],[10,5,7,12,3,8,7,2],[7,3,10,5,12,8,7,0]],[1,0,1,0,1,1,0,1],[0,3,8,5,7,3,5,0]);
song('autobattler','별빛 전술',126,59,'synth','sawtooth',[[0,3,10,7,2,5,12,7],[7,12,10,3,8,5,7,2],[10,7,3,12,5,8,7,0]],[1,0,1,1,0,0,1,1],[0,8,3,5,7,8,5,0]);
song('robot','기어 탐험대',134,55,'synth','triangle',[[0,2,7,3,10,5,7,12],[3,10,7,12,5,2,8,7],[12,7,3,10,2,5,7,0]],[1,1,0,1,0,1,1,0],[0,5,8,3,7,5,3,0]);
song('learning','배움의 작은 섬',88,65,'marimba','sine',[[0,4,7,2,9,7,4,0],[7,9,12,4,11,7,2,4],[9,4,7,12,2,5,4,0]],[1,0,0,0,1,0,0,0],[0,5,9,7,2,5,7,0]);
song('map','아홉 섬 초대장',106,60,'bell','pluck',[[0,7,4,12,9,2,7,4],[9,12,7,4,11,2,5,7],[12,9,7,4,2,5,7,0]],[1,0,1,0,1,0,1,0],[0,5,7,9,2,5,7,0]);
const worlds=['forest','ocean','sky','underground','dinosaur','ice','fire','lightning','space'];
worlds.forEach((id,i)=>{const t=tracks[id];song('boss-'+id,'수호자 · '+t.title,Math.max(142,t.bpm+24),t.root-12,'synth','sawtooth',t.melodies.map((m,j)=>m.slice().reverse().map((n,k)=>n+(k%3===0?12:0)-(j===1?1:0))),[1,1,0,1,1,1,0,1],[0,8,5,7,0,3,8,7]);});
const signature=[0,7,11,16];
// Each of 32 bars has its own phrase placement, harmony and orchestration.
function notes(track,bar,step,intensity=0){const t=tracks[track];if(!t)return [];const section=bar<4?0:bar<12?1:bar<20?2:bar<28?3:4,phrase=t.melodies[(section+(bar%4===3?1:0))%3],chord=t.chords[Math.floor(bar/2)%8],out=[];const isBoss=track.startsWith('boss-');
 if(t.rhythm[(step+((bar%4===2)?2:0))%8]){const n=phrase[(step+Math.floor(bar/4))%8]+t.root+(section===3&&bar%2?12:0);out.push({note:n,duration:.32,amp:.08,instrument:t.lead});if(section===3&&step%4===0)out.push({note:n+7,duration:.45,amp:.025,instrument:'bell'});}
 if(step%4===0)out.push({note:t.root-24+chord+(step===4?7:0),duration:.42,amp:.095,instrument:t.bass});
 if(section!==0&&step%4===2)out.push({note:t.root-12+chord+4,duration:.35,amp:.027,instrument:'sine'});
 if(track!=='learning'&&track!=='shape'&&(step===0||step===4||(isBoss&&step===6)))out.push({note:36,duration:.12,amp:.13,instrument:'kick'});
 if(section>0&&step%2===1&&(t.bpm>110||step===3))out.push({note:95,duration:.04,amp:.016,instrument:'hat'});
 if(isBoss&&intensity>.6&&step%2===0)out.push({note:t.root-12+phrase[step],duration:.13,amp:.035,instrument:'pluck'});
 return out;
}
g.SianScores={tracks,worlds,signature,notes};
})(window);
