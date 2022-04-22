let Delay = 50;

window.onresize = function() {
  var winw = window.innerWidth;
  var winh = window.innerHeight;
  var xvalue = winw / width;
  var yvalue = winh / height;
  scale = xvalue;
  if (yvalue < xvalue) {
    scale = yvalue
  }
  canvas.style.transform = "scale(" + scale + ")";
  canvas.style.left = (winw - width) / 2 + "px";
  canvas.style.top = (winh - height) / 2 + "px";
};
window.onload = function() {
  var winw = window.innerWidth;
  var winh = window.innerHeight;
  var xvalue = winw / width;
  var yvalue = winh / height;
  scale = xvalue;
  if (yvalue < xvalue) {
    scale = yvalue
  }
  canvas.style.transform = "scale(" + scale + ")";
  canvas.style.left = (winw - width) / 2 + "px";
  canvas.style.top = (winh - height) / 2 + "px";
  const sandbox = document.getElementById('sandbox')
  sandbox.checked = settings.sandbox;
  if(localStorage.sandbox == 'true'){
    sandbox.checked = true;
    settings.sandbox = true;
    Delay = 0;
  } else if(localStorage.sandbox == 'false'){
    sandbox.checked = false;
    settings.sandbox = false;
    Delay = 50;
  } else {sandbox.checked = true; Delay = 0;}
}
document.addEventListener("keydown", keydown, false);
document.addEventListener("keyup", keyup, false);

function keydown(e) {
  setTimeout(()=>{
  keys[e.keyCode] = true;
  if (e.keyCode == 84) {
    game.players[0].hasCheated = true;
    game.players[0].area++
    if (game.players[0].area>=game.worlds[game.players[0].world].areas.length-1) {
      game.players[0].area=game.worlds[game.players[0].world].areas.length-1
    }
    game.worlds[game.players[0].world].areas[game.players[0].area].load();
    canv = null;
  }
  if (e.keyCode == 82) {
    game.players[0].hasCheated = true;
    game.players[0].area = Number(game.players[0].area) + 10;
    if (game.players[0].area>=game.worlds[game.players[0].world].areas.length-1) {
      game.players[0].area=game.worlds[game.players[0].world].areas.length-1
    }
    game.worlds[game.players[0].world].areas[game.players[0].area].load();
    canv = null;
  }
  if (e.keyCode == 69) {
    game.players[0].hasCheated = true;
    game.players[0].area = Number(game.players[0].area) - 1;
    if (game.players[0].area<0) {
      game.players[0].area=0;
    }
    game.worlds[game.players[0].world].areas[game.players[0].area].load();
    canv = null;
  }
  if (e.keyCode == 86) {
    game.players[0].hasCheated = true;
    game.players[0].god = !game.players[0].god;
  }
  if (e.keyCode == 66) {
    game.players[0].hasCheated = true;
    settings.cooldown = !settings.cooldown;
  }},Delay)
}

function keyup(e) {
  setTimeout(()=>{
  delete keys[e.keyCode];
  },Delay);
}
window.onblur = function() {
  keys = [];
};
var enterGame = document.getElementById("connect");
enterGame.onclick = function() {
  switch(document.getElementById("wreath").value){
    case"Gold":hat.src="texture/gold-wreath.png";
    break;
    case"Spring":hat.src = "texture/spring-wreath.png";
    break;
    case"Autumn":hat.src = "texture/autumn-wreath.png";
    break;
    case"Winter":hat.src = "texture/winter-wreath.png";
    break;
    case"Summer":hat.src = "texture/summer-wreath.png";
  }
  window.localStorage.hat = document.getElementById("wreath").value;
  menu.style.display = "none";
  gamed.style.display = "inline-block";
  inMenu = false;
  var world = document.getElementById("world");
  var hero = document.getElementById("hero");
  if (world.selectedIndex == 0) {
    loadMain();
  }
  if (world.selectedIndex == 1) {
    loadHard()
  }
  if (world.selectedIndex == 2) {
    loadSecondary()
  }
  if (world.selectedIndex == 3) {
    //loadThird();
  }
  if (hero.selectedIndex == 0) {
    var player = new Basic(new Vector(Math.random() * 7 + 2.5, Math.random() * 10 + 2.5),5);
    game.players.push(player)
  }
  if (hero.selectedIndex == 1) {
    var player = new Magmax(new Vector(Math.random() * 7 + 2.5, Math.random() * 10 + 2.5),5);
    game.players.push(player)
  }

  if (hero.selectedIndex == 2) {
    var player = new Rime(new Vector(Math.random() * 7 + 2.5, Math.random() * 10 + 2.5),5);
    game.players.push(player)
  }

  if (hero.selectedIndex == 3) {
    //var player = new Morfe(new Vector(Math.random() * 7 + 2.5, Math.random() * 10 + 2.5),5);
    //game.players.push(player)
  }

  if (hero.selectedIndex == 3) {
    var player = new Aurora(new Vector(Math.random() * 7 + 2.5, Math.random() * 10 + 2.5),5);
    game.players.push(player)
  }

  if (hero.selectedIndex == 4) {
    var player = new Brute(new Vector(Math.random() * 7 + 2.5, Math.random() * 10 + 2.5),5);
    game.players.push(player)
  }

  if (hero.selectedIndex == 5) {
    var player = new Shade(new Vector(Math.random() * 7 + 2.5, Math.random() * 10 + 2.5),5);
    game.players.push(player)
  }

  if (hero.selectedIndex == 5) {
    //var player = new Chrono(new Vector(Math.random() * 7 + 2.5, Math.random() * 10 + 2.5),5);
    //game.players.push(player)
  }

  if (hero.selectedIndex == 6) {
    var player = new Reaper(new Vector(Math.random() * 7 + 2.5, Math.random() * 10 + 2.5),5);
    game.players.push(player)
  }

  if (hero.selectedIndex == 7) {
    var player = new Rameses(new Vector(Math.random() * 7 + 2.5, Math.random() * 10 + 2.5),5);
    game.players.push(player)
  }

  if (hero.selectedIndex == 8) {
    var player = new Cent(new Vector(Math.random() * 7 + 2.5, Math.random() * 10 + 2.5),5);
    game.players.push(player)
  }

  if (hero.selectedIndex == 9) {
    var player = new Jotunn(new Vector(Math.random() * 7 + 2.5, Math.random() * 10 + 2.5),5);
    game.players.push(player)
  }

  if (hero.selectedIndex == 10) {
    var player = new Candy(new Vector(Math.random() * 7 + 2.5, Math.random() * 10 + 2.5),5);
    game.players.push(player)
  }

  if (hero.selectedIndex == 11) {
    var player = new Burst(new Vector(Math.random() * 7 + 2.5, Math.random() * 10 + 2.5),5);
    game.players.push(player)
  }

  if (hero.selectedIndex == 12) {
    var player = new Lantern(new Vector(Math.random() * 7 + 2.5, Math.random() * 10 + 2.5),5);
    game.players.push(player)
  }

  if (hero.selectedIndex == 13) {
    var player = new Pole(new Vector(Math.random() * 7 + 2.5, Math.random() * 10 + 2.5),5);
    game.players.push(player)
  }

  if (hero.selectedIndex == 14) {
    var player = new Polygon(new Vector(Math.random() * 7 + 2.5, Math.random() * 10 + 2.5),5);
    game.players.push(player)
  }
  
  if (hero.selectedIndex == 15) {
    var player = new Clown(new Vector(Math.random() * 7 + 2.5, Math.random() * 10 + 2.5),5);
    game.players.push(player)
  }

  if (hero.selectedIndex == 16) {
    var player = new Poop(new Vector(Math.random() * 7 + 2.5, Math.random() * 10 + 2.5),5);
    game.players.push(player)
  }
  
  game.worlds[0].areas[0].load();
}
document.addEventListener("mousemove", Pos, false);

function Pos(p) {
  setTimeout(()=>{var t = canvas.getBoundingClientRect();
  mousePos = new Vector((p.pageX - t.left) / scale, (p.pageY - t.top) / scale);},Delay)
}
document.onmousedown = function(e) {
  if (e.buttons == 1) {
    if (!inMenu) {
      mouse = !mouse;
    }
  }
};
var inputElement = document.getElementById("load");
inputElement.addEventListener("change", handleFiles, false);

function handleFiles() {
  loaded = true;
  var fileList = this.files[0]; /* Vous pouvez maintenant manipuler la liste de fichiers */
  var reader = new FileReader();
  reader.onloadend = function(evt) {
    if (evt.target.readyState == FileReader.DONE) { // DONE == 2
      game = new Game()
      var world = new World(new Vector(0, 0), 0, jsyaml.load(evt.target.result));
      game.worlds[0] = world
      document.getElementById("world").selectedIndex = 3
    }
  };
  reader.readAsBinaryString(fileList);
}
document.getElementById("checkbox").addEventListener("click",function(e){
  settings.outline=!settings.outline;
})

document.getElementById("sandbox").addEventListener("click",function(e){
  settings.sandbox=!settings.sandbox;
  if(settings.sandbox){Delay = 0;}else{Delay = 50;}
  localStorage.sandbox = settings.sandbox;
})