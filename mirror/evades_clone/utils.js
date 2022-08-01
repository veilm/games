function pointInRectangle(pos, rectpos, rectsize) {
  return (pos.x >= rectpos.x && pos.x <= rectpos.x + rectsize.x && pos.y >= rectpos.y && pos.y <= rectpos.y + rectsize.y);
}
var entityTypes = [
  "unknown",
  "normal",
  "wall",
  "dasher",
  "homing",
  "slowing",
  "draining",
  "oscillating",
  "turning",
  "liquid",
  "sizing",
  "switch",
  "freezing",
  "sniper",
  "teleporting",
  "draining",
  "immune",
  "ice_sniper",
  "disabling",
  "icicle",
  "spiral",
  "gravity",
  "repelling",
  "wavy",
  "zigzag",
  "zoning",
  "radiating_bullets",
  "frost_giant",
  "tree",
  "pumpkin",
  "fake_pumpkin",
  "speed_sniper",
  "regen_sniper",
  "snowman",
  "slippery",
  "toxic",
  "corrosive",
  "corrosive_sniper",
  "poison_sniper",
  "magnetic_reduction",
  "magnetic_nullification",
  "positive_magnetic_sniper",
  "negative_magnetic_sniper",
  "experience_drain",
  "fire_trail",
  "wind",
  "burning",
  "sticky_sniper",
  "sticky_trail",
  "clown_trail",
  "ice"
]
function closestPointToRectangle(pos, rectpos, rectsize) {
  var xpos = pos.x;
  var ypos = pos.y;
  if (xpos < rectpos.x) {
    xpos = rectpos.x
  }
  if (xpos > rectpos.x + rectsize.x) {
    xpos = rectpos.x + rectsize.x;
  }
  if (ypos < rectpos.y) {
    ypos = rectpos.y
  }
  if (ypos > rectpos.y + rectsize.y) {
    ypos = rectpos.y + rectsize.y;
  }
  return new Vector(xpos, ypos);
}

function make2Darray(cols, rows, xpos, ypos, type) {
  var arr = new Array(cols);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
    for (var j = 0; j < arr[i].length; j++) {
      arr[i][j] = new Tile(i + xpos, j + ypos, type);
    }
  }
  return arr;
};
function distance(pos1, pos2) {
  return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
}
function perimeter(rect){
  return (rect.w*2+rect.h*2);
}
function warpAround(rect,lengthT){
  var result = {};
  var length = lengthT%(rect.w*2+rect.h*2);
  var xpos;
  var ypos;
  var dir;
  if (length<rect.w) {
    dir = 0;
    ypos = rect.y;
    xpos = rect.x+length;
  }else if (length<rect.w+rect.h) {
    dir = 1;
    xpos = rect.x+rect.w;
    ypos = rect.y+(length-rect.w)
  }else if (length<rect.w*2+rect.h) {
    dir = 2;
    ypos = rect.y+rect.h
    xpos = (rect.x+rect.w)-(length-(rect.w+rect.h));
  }else if (length<rect.w*2+rect.h*2) {
    dir = 3;
    xpos = rect.x;
    ypos = (rect.y+rect.h)-(length-(rect.w*2+rect.h))
  }
  result.x = xpos;
  result.y = ypos;
  result.dir = dir;
  return result;
}
var ttest = 1;
function isSpawned(boundary,thes){
  if(thes.isSpawned){
    var wallXLpos,wallXRpos,wallYLpos,wallYRpos;
    if(thes.pos.x - thes.radius < boundary.x + boundary.w&&thes.pos.x + thes.radius > boundary.x&&!(thes.pos.y>boundary.y+boundary.h||thes.pos.y<boundary.y)){
      wallXRpos = boundary.x+boundary.w-thes.pos.x-thes.radius
    }
    if(thes.pos.x + thes.radius > boundary.x&&!(thes.pos.x + thes.radius > boundary.x + boundary.w)&&!(thes.pos.y>boundary.y+boundary.h||thes.pos.y<boundary.y)){
      wallXLpos = thes.pos.x-thes.radius-boundary.x;
    }
    if(thes.pos.y - thes.radius < boundary.y + boundary.h&&thes.pos.y + thes.radius > boundary.y&&thes.pos.x>boundary.x&&thes.pos.x<boundary.x+boundary.w){
      wallYRpos = boundary.y+boundary.h-thes.pos.y-thes.radius
    }
    if (thes.pos.y + thes.radius > boundary.y&&!(thes.pos.y + thes.radius > boundary.y + boundary.h)&&thes.pos.x>boundary.x&&thes.pos.x<boundary.x+boundary.w) {
      wallYLpos = thes.pos.y-thes.radius-boundary.y;
    }
    var lowestOne = Math.min(wallXLpos||100000,wallXRpos||100000,wallYLpos||100000,wallYRpos||100000)
    if(wallXRpos==lowestOne){
      if(ttest)thes.pos.x = boundary.x+boundary.w+thes.radius;
      thes.vel.x = Math.abs(thes.vel.x);
      thes.wallHit = true;
      thes.isSpawned = false;
    }
    if(wallXLpos==lowestOne){
      if(ttest)thes.pos.x = boundary.x-thes.radius;
      thes.vel.x = -Math.abs(thes.vel.x);
      thes.wallHit = true;
      thes.isSpawned = false;
    }
    if(wallYRpos==lowestOne){
      if(ttest)thes.pos.y = boundary.y+boundary.h+thes.radius;
      thes.vel.y = Math.abs(thes.vel.y);
      thes.wallHit = true;
      thes.isSpawned = false;
    }
    if(wallYLpos==lowestOne){
      if(ttest)thes.pos.y = boundary.y-thes.radius;
      thes.vel.y = -Math.abs(thes.vel.y);
      thes.wallHit = true;
      thes.isSpawned = false;
    }//thes.isSpawned = false
  }
}

function sectorInRect(t,e,o,n,a,i){
  i<0&&(i=360+i);
  var l=270*Math.PI/180;
  i*=Math.PI/180;
  var r=e+n/2,
  h=o+a/2,
  s={x:e,y:o},
  c={x:e+n,y:o},
  v={x:e+n,y:o+a},
  f={x:e,y:o+a},
  u=Math.sqrt(2)*n/2,
  d=Math.sqrt(2)*a/2,
  M=r+u*Math.cos(l),
  T=(Math.sin(l),
  r+u*Math.cos(i)),
  P=h+d*Math.sin(i),
  g={x:M,y:o},
  x={x:T,y:o},
  b={x:e+n,y:P},
  y={x:T,y:o+a},
  I={x:e,y:P},
  m=[],
  k=Math.PI/180*225,
  p=Math.PI/180*315,
  q=Math.PI/180*45,
  C=Math.PI/180*135;
  m=i>p||i<q?[g,s,f,v,c,b]:i>q&&i<=C?[g,s,f,y]:i>C&&i<=k?[g,s,I]:g.x<x.x?[g,s,f,v,c,x]:[x,g],
  t.beginPath(),t.moveTo(r,h);for(var S=0;S<m.length;S++){var H=m[S];t.lineTo(H.x,H.y)}t.lineTo(r,h),t.closePath(),t.fill()
}

function death(player){
  const diff = document.getElementById("diff").value;
  if(diff == "Easy"){
    player.pos = new Vector(player.dyingPos.x, player.dyingPos.y); player.firstAbilityCooldown = 0; player.secondAbilityCooldown = 0;
    player.deathCounter++; if(player.className=="Rameses"){player.bandage=true;}
  } else {
    player.world = 0;
    player.area = 0;
    player.pos = new Vector(6,9);
  }
}

function collides(enemy,enemy2){
  const dx = enemy.pos.x - enemy2.pos.x;
  const dy = enemy.pos.y - enemy2.pos.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < enemy.radius + enemy2.radius) {
      return true;
  } else {return false}
}

function renderBackground(t,e){
  if(null!==this.areaCanvas){
    var i={x:e.left+e.width/2,y:e.top+e.height/2};
    this.drawNearbyMinimap(i);
    t.beginPath();
    t.rect(this.left,this.top,this.minimapWidth,this.minimapHeight);
    t.clip();
    t.drawImage(this.areaCanvas,(e.left-this.x-this.areaCanvasOffset.x)*this.canvasScale,(e.top-this.y-this.areaCanvasOffset.y)*this.canvasScale,e.width*this.canvasScale,e.height*this.canvasScale,this.left,this.top,this.minimapWidth,this.minimapHeight),t.fillStyle="rgba(80, 80, 80, 0.6)",t.fillRect(this.left,this.top,this.minimapWidth,this.minimapHeight)}
  }

function drawNearbyMinimap(t,ctx,canvas,zones,areaPos){
  t = {x:t.x*32,y:t.y*32}
  var areaCanvasOffset = {x:10000,y:10000};
  var nearbySize = 10000;
  var canvasScale = scale;
  var e=roundTo(t.x,nearbySize);
  var i=roundTo(t.y,nearbySize);
  var a=e-nearbySize;
  var n=i-nearbySize;
  var r=e+nearbySize;
  var s=i+nearbySize;
  if(null===areaCanvasOffset||areaCanvasOffset.x!==a||areaCanvasOffset.y!==n){
    areaCanvasOffset={x:a,y:n};
    ctx.clearRect(0,0,canvas.width,canvas.height);
    var o={};
    o[0]=[255,255,255,255];
    o[1]=[195,195,195,255];
    o[2]=[255,244,108,255];
    o[3]=[106,208,222,255];
    o[4]=[255,244,108,255];
    o[5]=[255,249,186,255];
    var l=!0,u=!1,f=void 0;
    try{
      for(var c in zones){
        var y=zones[c];
        if(!(y.pos.x>r||y.pos.x+y.width<a||y.pos.y>s||y.pos.y+y.height<n)){
          console.log(y)
          var m=[y.backgroundColor>>24&255,y.backgroundColor>>16&255,y.backgroundColor>>8&255,255&y.backgroundColor];
          var p=mixColors(o[y.type],m);
          ctx.fillStyle="rgba(".concat(p[0],", ").concat(p[1],", ").concat(p[2],", ").concat(p[3]);
          var v=(y.pos.x-areaPos.x-areaCanvasOffset.x)*canvasScale;
          var g=(y.pos.y-areaPos.y-areaCanvasOffset.y)*canvasScale;
          ctx.fillRect(v,g,y.width*canvasScale,y.height*canvasScale)}
        }
      }catch(b){u=!0,f=b}
      finally{try{l||null==d.return||d.return()}finally{if(u)throw f}
    }
  }
}

function mixColors(t,e){
  var i=t[3]/255;
  var a=e[3]/255;
  var n=[];
  var r=1-(1-a)*(1-i);
  return n[0]=Math.round(e[0]*a/r+t[0]*i*(1-a)/r),n[1]=Math.round(e[1]*a/r+t[1]*i*(1-a)/r),n[2]=Math.round(e[2]*a/r+t[2]*i*(1-a)/r),n[3]=r,n
}

function roundTo(t,e){
  return Math.round(t/e)*e
}

function createOffscreenCanvas (width,height){
  const canvas = document.createElement("canvas");
  canvas.width=width;
  canvas.height=height;
  return canvas;
}