(function(H){
 H.registerWorld({id:2,name:'바닷속 세계',theme:'ocean',mode:'swim',color:'#167ab4',description:'기포를 따라 위아래로 수영해요',notes:[392,587,740]},[
 {number:1,name:'산호초',words:['바','다','고','래'],story:'↑ 또는 점프를 누르면 위로, ↓는 아래로 수영해요.'},
 {number:2,name:'해저 동굴',words:['물','해','별','빛'],story:'물살을 거슬러 기포 속 글자를 찾아요.',current:true,cave:true},
 {number:3,name:'침몰한 한글 도시',words:['바','다','고','래','상','어','문','어'],story:'바다 → 고래 → 상어 → 문어 순서로 모으면 문이 열려요.',ordered:true,current:true},
 {number:4,name:'바다왕',words:['다','래','어','어'],story:'바○ · 고○ · 상○ · 문○! 빈자리에 맞는 기포를 찾아요.',boss:{name:'물결왕 루모',style:'ocean',attacks:['ink','bubble','current'],questions:[['바○','다','나','라'],['고○','래','나','마'],['상○','어','가','다'],['문○','어','라','사']]}}
 ]);
 const previous=H.decorateWorldStage;H.decorateWorldStage=s=>{previous?.(s);if(s.worldId!==2)return;
  s.words.forEach((_,i)=>{const x=i*650;s.enemies.push({x:x+440,y:160+(i%3)*90,w:44,h:44,left:x+340,right:x+530,dir:1,speed:40,kind:'jellyfish',baseY:160+(i%3)*90,phase:i});
   if(s.current)s.currents.push({x:x+350,w:200,vx:i%2?55:-45,vy:18});
   if(s.cave)s.hazards.push({kind:'coral',x:x+470,y:i%2?350:70,w:65,h:120});
   if(s.ordered&&i%2===1)s.gates.push({x:x+500,required:i+1});
  });
 };
})(HangulRunner);
