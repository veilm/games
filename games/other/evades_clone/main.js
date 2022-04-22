var canvas = document.getElementById("game");
var context = canvas.getContext("2d"),
  width = canvas.width,
  height = canvas.height;
var inMenu = true;
var fov = 32;
var keys = [];
var settings = {
  outline:true,
  cooldown:true
}
var mousePos = new Vector(0, 0);
var mouse = false;
var scale = 1;
var loaded = false;
var game = new Game();

function loadMain() {
  game.worlds[0] = new World(new Vector(0, 0), 0, centralCore)
  game.worlds[1] = new World(new Vector(0, 80), 1, hauntedHalls)
  game.worlds[2] = new World(new Vector(0, 160), 2, peculiarPyramid)
  game.worlds[3] = new World(new Vector(0, 525), 3, wackyWonderland)
  game.worlds[4] = new World(new Vector(0, 570), 4, glacialGorge)
  game.worlds[5] = new World(new Vector(0, 615), 5, viciousValley)
  game.worlds[6] = new World(new Vector(0, 660), 6, humongousHollow)
  game.worlds[7] = new World(new Vector(0, 705), 7, eliteExpanse);
  game.worlds[8] = new World(new Vector(0, 750), 8, centralCoreHard);
  game.worlds[9] = new World(new Vector(0, 795), 9, dangerousDistrict);
  game.worlds[10] = new World(new Vector(0, 840), 10, quietQuarry);
  game.worlds[11] = new World(new Vector(0, 885), 11, monumentalMigration);
  game.worlds[12] = new World(new Vector(0, 930), 12, ominousOccult);
  game.worlds[13] = new World(new Vector(0, 970), 13, viciousValleyHard);
  game.worlds[14] = new World(new Vector(0, 1015), 14, frozenFjord);
  game.worlds[15] = new World(new Vector(-61, 1465), 15, restlessRidge);
  game.worlds[16] = new World(new Vector(-61, 1365), 16, toxicTerritory);
  game.worlds[17] = new World(new Vector(-61, 1400), 17, magnetic_monopole);
  game.worlds[18] = new World(new Vector(-61, 1440), 18, assorted_alcove);
  game.worlds[19] = new World(new Vector(-61, -15), 19, stellarSquare);
  //game.worlds[18] = new World(new Vector(-61, 1265), 18, assorted_alcove);
}

function loadHard(){
  game.worlds[0] = new World(new Vector(0, 0), 0, centralCoreFast)
  game.worlds[1] = new World(new Vector(0, 80), 1, hauntedHalls)
  game.worlds[2] = new World(new Vector(0, 160), 2, peculiarPyramid)
  game.worlds[3] = new World(new Vector(0, 525), 3, wackyWonderland)
  game.worlds[4] = new World(new Vector(0, 570), 4, glacialGorge)
  game.worlds[5] = new World(new Vector(0, 615), 5, viciousValley)
  game.worlds[6] = new World(new Vector(0, 660), 6, humongousHollow)
  game.worlds[7] = new World(new Vector(0, 705), 7, eliteExpanse);
  game.worlds[8] = new World(new Vector(0, 750), 8, centralCoreHard);
  game.worlds[9] = new World(new Vector(0, 795), 9, dangerousDistrict);
  game.worlds[10] = new World(new Vector(0, 840), 10, quietQuarry);
  game.worlds[11] = new World(new Vector(0, 885), 11, monumentalMigration);
  game.worlds[12] = new World(new Vector(0, 930), 12, ominousOccult);
  game.worlds[13] = new World(new Vector(0, 970), 13, viciousValleyHard);
  game.worlds[14] = new World(new Vector(0, 1015), 14, frozenFjord);
  game.worlds[15] = new World(new Vector(-61, 1465), 15, restlessRidge);
  game.worlds[16] = new World(new Vector(-61, 1365), 16, toxicTerritory);
  game.worlds[17] = new World(new Vector(-61, 1400), 17, magnetic_monopole);
  game.worlds[18] = new World(new Vector(-61, 1440), 18, assorted_alcoveHard);
  game.worlds[19] = new World(new Vector(-61, -15), 19, stellarSquareHard);
}

function loadSecondary() {
  game.worlds[0] = new World(new Vector(0, 0), 0, transformingTurbidity)
  game.worlds[1] = new World(new Vector(0, 45), 1, unexploredUtopia)
  game.worlds[2] = new World(new Vector(0, 90), 2, littleLandscape)
  game.worlds[3] = new World(new Vector(0, 132), 3, darknessDimension)
  game.worlds[4] = new World(new Vector(0, 177), 4, crowdedCavern)
  game.worlds[5] = new World(new Vector(0, 222), 5, centralCoreImpossible)
  game.worlds[6] = new World(new Vector(0, 267), 6, transformingTurbidityImpossible)
  game.worlds[7] = new World(new Vector(0, 312), 7, elongatingEscalator)
  game.worlds[8] = new World(new Vector(0, 357), 8, ballisticBattlefield)
  game.worlds[9] = new World(new Vector(0, 402), 9, insanityIsle)
  game.worlds[10] = new World(new Vector(0, 447), 10, naturalNightmare)
}
var img2 = new Image();
img2.src = "texture/tiles.jpg";
var hat = new Image();
hat.src = "texture/gold-wreath.png"
var magnetDown = new Image();
magnetDown.src = "texture/magnetism_down.png"
var magnetUp = new Image();
magnetUp.src = "texture/magnetism_up.png"
var pumpkinOn = new Image();
pumpkinOn.src = "texture/pumpkin_on.png"
var pumpkinOff = new Image();
pumpkinOff.src = "texture/pumpkin_off.png"
var torch = new Image();
torch.src = "texture/torch.png"
var torchUp = new Image();
torchUp.src = "texture/torch_upside_down.png"
var flashlight_item = new Image();
flashlight_item.src = "texture/flashlight_item.png"
var flashlight = new Image();
flashlight.src = "texture/flashlight.png"
var warp = new Image();
warp.src = "texture/warp.png";
var paralysis = new Image();
paralysis.src = "texture/paralysis.png";
var atonement = new Image();
atonement.src = "texture/atonement.png";
var depart = new Image();
depart.src = "texture/depart.png";
var flow = new Image();
flow.src = "texture/flow.png";
var harden = new Image();
harden.src = "texture/harden.png";
var bandages = new Image();
bandages.src = "texture/bandages.png";
var latch = new Image();
latch.src = "texture/latch.png";
var fusion = new Image();
fusion.src = "texture/fusion.png";
var mortar = new Image();
mortar.src = "texture/mortar.png";
var night = new Image();
night.src = "texture/night.png";
var vengeance = new Image();
vengeance.src = "texture/vengeance.png";
var decay = new Image();
decay.src = "texture/decay.png";
var shatter = new Image();
shatter.src = "texture/shatter.png";
var sweet_tooth = new Image();
sweet_tooth.src = "texture/sweet_tooth.png";
var sugar_rush = new Image();
sugar_rush.src = "texture/sugar_rush.png";
var sweet_tooth_item = new Image();
sweet_tooth_item.src = "texture/sweet_tooth_item.png"
var gate = new Image();
gate.src = "texture/gate.png"
var distort = new Image();
distort.src = "texture/distort.png";
var energize = new Image();
energize.src = "texture/energize.png";
var backtrack = new Image();
backtrack.src = "texture/backtrack.png";
var rewind = new Image();
rewind.src = "texture/rewind.png";
var vigor = new Image();
vigor.src = "texture/vigor.png";
var stomp = new Image();
stomp.src = "texture/stomp.png";
var reverse = new Image();
reverse.src = "texture/reverse.png";
var minimize = new Image();
minimize.src = "texture/minimize.png";

var thing = 1;
var world = new World(new Vector(0, 0), 0, missingMap);
game.worlds[0] = world;
var tset = 0;
var FPSCUT = 30000000;
var updD = 0;
var tim = 0;
function animate(time) {
  //tim+=1000/30;
  //time = tim;
  updD++;//tset++;if(tset>FPSCUT){tset = 1;}
  if(updD%2){
  var progress = time - lastRender;
  //if(progress<33||progress>34)
  //if(tset%FPSCUT!=0){
  context.clearRect(0, 0, width, height);
  context.beginPath();
  context.fillStyle = "#333";
  context.rect(0, 0, width, height);
  context.fill();
  context.closePath();//}
  if (!inMenu) {
    var input = {}
    input.keys = keys;
    input.mouse = mousePos;
    input.isMouse = mouse;
    game.inputPlayer(0, input)
    if (progress > 1000) {
      progress = 1000;
    }
    game.update(progress * thing);
    //if(tset%FPSCUT!=0){
    var players = game.players;
    var states = game.getStates(0);
    var focus = new Vector(players[0].pos.x, players[0].pos.y);
    var area = (game.worlds[game.players[0].world].areas[game.players[0].area]);
    var wasVictory = area.getActiveBoundary().t;
    var strokeColor = "#425a6d";
    if(area.title_stroke_color){strokeColor=area.title_stroke_color}
    area = (wasVictory) ? "Victory!" : (game.worlds[game.players[0].world].areas[game.players[0].area].name)
    renderArea(states, players, focus)
    context.beginPath();
    context.textAlign = "center";
    context.lineWidth = 6;
    context.fillStyle = "#f4faff";
    context.strokeStyle = strokeColor;//"#425a6d";
    context.font = "bold " + 35 + "px Tahoma, Verdana, Segoe, sans-serif";
    context.textAlign = "center";
    context.strokeText(game.worlds[game.players[0].world].name + ": " + area, width / 2, 40);
    context.fillText(game.worlds[game.players[0].world].name + ": " + area, width / 2, 40);
    context.closePath();
    //
    var world = document.getElementById("world");
    if (world.selectedIndex == 2 && game.players[0].area == 0) {
      var author = "???"
      if (states.name == "Transforming Turbidity") {
        author = "DD1";
      }
      if (states.name == "Unexplored Utopia") {
        author = "Marko";
      }
      if (states.name == "Little Landscape") {
        author = "Rc";
      }
      if (states.name == "Darkness Dimension") {
        author = "XScienceMasterX";
      }
      if (states.name == "Crowded Cavern") {
        author = "fAtKiD";
      }
      if (states.name == "Central Core Impossible") {
        author = "Pentagonis, REALLY IMPOSSIBLE";
      }
      if (states.name == "Transforming Turbidity Impossible") {
        author = "haha0201. For your sanity click R four times.";
      }
      if (states.name == "Elongating Escalators") {
        author = "Darklight";
      }
      if (states.name == "Ballistic Battlefield") {
        author = "Strat";
      }
      if (states.name == "Insanity Isle") {
        author = "Manticore";
      }
      if (states.name == "Natural Nightmare") {
        author = "HIJ";
      }
      context.beginPath();
      context.font = "bold " + 35 + "px Tahoma, Verdana, Segoe, sans-serif";
      context.textAlign = "center";
      context.lineWidth = 5,
        context.strokeStyle = "#006b2c",
        context.fillStyle = "#00ff6b",
        context.strokeText("made by " + author, width / 2, height - 120);
      context.fillText("made by " + author, width / 2, height - 120);
      context.closePath();
    }
    if (world.selectedIndex == 1 && game.players[0].area == 1 && game.players[0].world == 3) {
      context.beginPath();
      context.font = "bold " + 35 + "px Tahoma, Verdana, Segoe, sans-serif";
      context.textAlign = "center";
      context.lineWidth = 5,
        context.strokeStyle = "#006b2c",
        context.fillStyle = "#00ff6b",
        context.strokeText("this map has 120 areas... make sure you have time :D", width / 2, height - 120);
      context.fillText("this map has 120 areas... make sure you have time :D", width / 2, height - 120);
      context.closePath();
    }
    if (world.selectedIndex == 3 && !loaded) {
      context.beginPath();
      context.font = "bold " + 35 + "px Tahoma, Verdana, Segoe, sans-serif";
      context.textAlign = "center";
      context.lineWidth = 5,
        context.strokeStyle = "#006b2c",
        context.fillStyle = "#00ff6b",
        context.strokeText("this is to import a map, top left in the menu", width / 2, height - 120);
      context.fillText("this is to import a map, top left in the menu", width / 2, height - 120);
      context.closePath();
    }//}
  }
  lastRender = time}
  window.requestAnimationFrame(animate);
}
var lastRender = 0;
//setInterval(animate,1000/30)
window.requestAnimationFrame(animate);

if(!window.localStorage.hat){window.localStorage.hat = "Gold"};document.getElementById("wreath").value = window.localStorage.hat;
if(window.localStorage.nick){document.getElementById("nick").value = window.localStorage.nick}