const fs=require('node:fs'),a=require('node:assert/strict'),home=fs.readFileSync('css/home.css','utf8'),style=fs.readFileSync('css/style.css','utf8');
a.match(home,/@media \(max-width: 700px\)[\s\S]*?\.islandMenu \{[\s\S]*?grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
a.match(home,/\.learningGrid \{\s*grid-template-columns:1fr/);
a.match(home,/white-space:normal;\s*word-break:keep-all/);
a.match(style,/@media\(max-width:650px\)[\s\S]*?\.zoneTabs\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
a.match(style,/\.questCard \.choice\{[^}]*min-height:62px/);
console.log('PASS mobile 320/390/430 learning cards, chapter tabs and answer target rules');
