// S T A R T   O F   S C R I P T   ///////////////////////////////////////////
// Made by Michael Skyba
// SGM 11.2.2

// P R E - M A D E   L O A D I N G   ///////////////////////////////////////

var canvas;
var ctx;

var xs = [""];
var ys = [""];
var objects = [""];

window.onload = init;
function init() {

if (window.Event) document.captureEvents(Event.MOUSEMOVE);
document.onmousemove = getCursorXY;
}

function getCursorXY(e) {
mouseX = (window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
mouseY = (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
}

//  L O A D   ///////////////////////////////////////////////
// F Canv Code setUpCanvas();
setUpCanvas();

addObject(0, 0, "BG");
addObject(90, 30, "popTxt");
addObject(canvas.width / 2 - 19, canvas.height / 2 - 30, "V1");
addObject(canvas.width / 2 - 100, canvas.height / 2 - 30, "V2");
addObject(canvas.width / 2 - 200, canvas.height / 2 - 30, "V5");
addObject(canvas.width / 2 + 55, canvas.height / 2 - 30, "V4");
addObject(canvas.width / 2 + 110, canvas.height / 2 - 30, "V3");
addObject(90, 60, "dayTxt");
addObject(canvas.width / 2, canvas.height / 2, "LightText");
addObject(canvas.width / 2, canvas.height / 2 + 35, "LightText2");
addObject(canvas.width / 2, canvas.height / 5 * 4, "PopText");
addObject(canvas.width / 2 - 145, canvas.height / 2  - 135, "secretV");
addObject(canvas.width / 2 - 45, canvas.height / 2 - 135, "V7");
addObject(canvas.width / 2 + 100, canvas.height / 2 - 135, "V6");

var population = 1;
var mouseX;
var mouseY;

var villager2 = false;
var villager3 = false;
var villager4 = false;
var villager5 = false;
var villager6 = false;
var villager7 = false;
var secretGot = false;

var dayWait;
var daySecond = 0;
var popWait;
var popSecond = 0;
var lightWait;
var lightSecond = 0;
var day = 1;

var popMax;
var lightMin;
var lightMax;

var choseDifficulty = false;

var popCost;
var lightCost;
var dayCost;

var counter = 0;
var attractCounter = 0;
var attracted;
var difficulty = "not";

var showTextLight = false;
var showTextPop = false;

var showYellowV = false;

// U P D A T E   ////////////////////////////////////// 
// use setInterval(function, 10);

setInterval(update, 10);

// F U N C T I O N S   /////////////////////////////////}

function casual()
{
dayWait = 59;
popWait = 14;
lightWait = 20;
popCost = 15;
lightCost = 17;
dayCost = 25;
attracted = 4;
popMax = 4;
lightMin = 1;
lightMax = 6;
choseDifficulty = true;
}

function hard()
{
dayWait = 78;
popWait = 25;
lightWait = 15;
popCost = 20;
lightCost = 23;
dayCost = 25;
attracted = 6;
popMax = 3;
lightMin = 2;
lightMax = 7;
choseDifficulty = true;
}

function extreme()
{
dayWait = 88;
popWait = 30;
lightWait = 10;
popCost = 23;
lightCost = 32;
dayCost = 36;
attracted = 8;
popMax = 2;
lightMin = 3;
lightMax = 8;
difficulty = "extreme";
choseDifficulty = true;
}

function hacked()
{
dayWait = 0;
popWait = 0;
lightWait = 99999;
popCost = 0;
lightCost = 0;
dayCost = 0;
attracted = 1;
popMax = 99999;
lightMin = 1;
lightMax = 1;
choseDifficulty = true;
}

function secret()
{
secretGot = true;
}

function attract()
{
if (attractCounter > attracted)
{
    attractCounter = 0;
    population +=1;
    villager4 = true;
}
else attractCounter += 1;
}

function upgradePop()
{
if (population > popCost)
{
    popWait = popWait * 0.95;
    population -= popCost;
    popCost = popCost * 1.5;
    villager2 = true;
}
}

function upgradeLight()
{
if (population > lightCost)
{
    lightWait = lightWait * 1.05;
    population -= lightCost;
    lightCost = lightCost * 1.5;
    villager3 = true;
}
}

function upgradeDay()
{
if (population > dayCost)
{
    dayWait = dayWait * 0.9;
    population -= dayCost;
    dayCost = dayCost * 1.5;
    villager5 = true;
}
}

function playSound(src) {
this.sound = document.createElement("audio");
this.sound.src = src;
this.sound.setAttribute("preload", "auto");
this.sound.setAttribute("controls", "none");
this.sound.style.display = "none";
document.body.appendChild(this.sound);
this.sound.play();
}

function turnTextOffPop()
{
setTimeout(function(){showTextPop = false;}, 3000);
}
function turnTextOffLight()
{
setTimeout(function(){showTextLight = false;}, 3000);
}

function nextDay()
{
if (population > 0)
{
    day+=1;
    setTimeout(nextDay(), dayWait);
}
}

function update()
{

population = Math.round(population);
popCost = Math.round(popCost);
lightCost = Math.round(lightCost);
dayCost = Math.round(dayCost);



if (population > 0)
{

    if (population > 149) villager7 = true;
    else villager7 = false;
    if (day > 74) villager6 = true;
    else villager6 = false;

    if (choseDifficulty == false)
    {
        document.getElementById("attract").style.display = "none";
        document.getElementById("morePop").style.display = "none";
        document.getElementById("lessLight").style.display = "none";
        document.getElementById("fasterDay").style.display = "none";
    }
    else
    {
        document.getElementById("attract").style.display = "block";
        document.getElementById("morePop").style.display = "block";
        document.getElementById("lessLight").style.display = "block";
        document.getElementById("fasterDay").style.display = "block";
        document.getElementById("casual").style.display = "none";
        document.getElementById("hard").style.display = "none";
        document.getElementById("extreme").style.display = "none";
        document.getElementById("hacked").style.display = "none";
        
    }

    document.getElementById("morePop").value = "Population Upgrade ("+popCost+")";
    document.getElementById("lessLight").value = "Lightning Upgrade ("+lightCost+")";
    document.getElementById("fasterDay").value = "Time Machine ("+dayCost+")";

    drawSquare("BG", canvas.width, canvas.height, "dbdbdb");
    drawImg("V1", "V1");
    if (villager2 == true) drawImg("V2", "V2");
    if (villager3 == true) drawImg("V3", "V3");
    if (villager4 == true) drawImg("V4", "V4");
    if (villager5 == true) drawImg("V5", "V5");
    if (villager6 == true) drawImg("V6", "V6");
    if (villager7 == true) drawImg("V7", "V7");
    if (secretGot == true) drawImg("secretV", "secretV");

    if (choseDifficulty == true)
    {
        counter+=1;
        if (counter > 99)
        {
            popSecond += 1;
            lightSecond += 1;
            daySecond += 1;
            counter = 0;
        }

        
        write("popTxt", "Population: "+population, 28, "000");
        write("dayTxt", "Day "+day, 28, "000");
    }
    else write("PopText", "Choose a difficulty!", 28, "000");

    if (showTextLight == true)
    {
        drawSquare("BG", canvas.width, canvas.height, "000");
        write("LightText", "Your village has been struck by", 28, "ffffff");
        write("LightText2", "lightning. People died.", 28, "fff");
        turnTextOffLight();
    }
    if (showTextPop == true)
    {
        write("PopText", "People have joined your village.", 28, "000");
        turnTextOffPop();
    }

    if (lightSecond > lightWait) // lightning
    {
        showTextLight = true;
        lightSecond = 0;
        population-=RNG(lightMin, lightMax);
    }
    if (daySecond > dayWait) //day
    {
        day+=1;
        daySecond = 0;
    }
    if (popSecond > popWait -1)
    {
        showTextPop = true;
        population+=RNG(1, popMax);
        popSecond = 0;
    }
}
else
{
    document.getElementById("attract").style.display = "none";
    document.getElementById("morePop").style.display = "none";
    document.getElementById("lessLight").style.display = "none";
    document.getElementById("fasterDay").style.display = "none";
    drawSquare("BG", canvas.width, canvas.height, "000");
    write("LightText", "Your village is dead.", 28, "ffffff");
}
}

// P R E - M A D E   F U N C T I O N S   ///////////////////////////

// supports:
// setting up canvas, changing xy, adding objects, rng, updating html elements xy
// key detection, playing sound, drawing shapes, getting quick id, setting xy
// writing text, redirecting

function drawImg(id, objectName)
{

var img = document.getElementById(id);
if (img)
{

    if (objects.indexOf(objectName) != -1) ctx.drawImage(img, x(objectName), y(objectName));
    else console.error("OBJ ERR: OBJECT NOT FOUND");

}
else console.error("ID ERR: ELEMENT ASSIGNED WITH SUGGESTED ID NOT FOUND");

}

function x(objectName)
{
return xs[id(objectName)];
}

function y(objectName)
{
return ys[id(objectName)];

}
function touching(obj1n, obj1w, obj1h, obj2n, obj2w, obj2h)
{
var x = 0;
var y = 0;
if (objects.indexOf(obj1n) != -1 && objects.indexOf(obj2n) != -1)
{
    if ( ( xs[id(obj1n)] + obj1w ) > xs[id(obj2n)] && ( xs[id(obj2n)] + obj2w ) > xs[id(obj1n)] ) x = 1;
    if ( ( ys[id(obj1n)] + obj1h ) > ys[id(obj2n)] && ( ys[id(obj2n)] + obj2h ) > ys[id(obj1n)] ) y = 1;

    if (x + y == 2) return true;
    else return false;
}

else console.log("OBJ ERR: OBJECT NOT FOUND");
}



function reDir(url)
{
window.location.replace(url);
}



function write(objectName, string, pixels, hex)
{
ctx.font = pixels+"px Comic Sans MS";
ctx.fillStyle = "#"+hex;
ctx.textAlign = "center";
ctx.fillText(string, xs[id(objectName)], ys[id(objectName)]); 
}

function setObjectY(objectName, val) {

if (objects.indexOf(objectName) != -1) {

    ys[objects.indexOf(objectName)] = val;

} else console.log("OBJ ERR: OBJECT NOT FOUND");


}



function setObjectX(objectName, val) {

if (objects.indexOf(objectName) != -1) {

    xs[objects.indexOf(objectName)] = val;

} else console.log("OBJ ERR: OBJECT NOT FOUND");


}



function id (name)
{
return objects.indexOf(name);
}



function clearScreen ()
{

ctx.beginPath();
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.closePath();

}



function drawCircle(objectName, hex, size)
{

var id = objects.indexOf(objectName);

if (id != -1)
{

    ctx.beginPath();
    ctx.arc(xs[id], ys[id], size, 0, Math.PI * 2); 
    ctx.fillStyle = ("#"+hex);
    ctx.fill();
    ctx.closePath();

}

else console.log("OBJ ERR: OBJECT NOT FOUND");

}



function drawSquare(objectName, width, height, hex) 
{

if (objects.indexOf(objectName) != -1)
{
    ctx.beginPath();
    ctx.rect(xs[objects.indexOf(objectName)], ys[objects.indexOf(objectName)], width, height); 
    ctx.fillStyle = ("#"+hex);
    ctx.fill();
    ctx.closePath();
}

else console.log("OBJ ERR: OBJECT NOT FOUND");

}



function playSound (source, loop)
{

var audio = new Audio(source);
if (loop == true)
{
    audio.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
    }, false);
}
audio.play();

}
    


document.onkeydown = function (e) 
{
        
e = e || window.event;

switch (e.keyCode)
{

    // add more cases for key detection

    default:

        console.log(e.keyCode);

}
    
}
                                


function updateHTML (objectName, id)
{

var myEle = document.getElementById(id);

if(myEle) 
{
    
    if (objects.indexOf(objectName) != -1)
    {
        console.log("ELE WAR: ERROR MAY SHOW IF POSITION IS NOT ABSOLUTE");
        myEle.style.left= xs[objects.indexOf(objectName)];
        myEle.style.top= ys[objects.indexOf(objectName)];
        
    }
    
    else console.log("OBJ ERR: OBJECT NOT FOUND");
    
}

else console.log("ID ERR: ELEMENT ASSIGNED WITH SUGGESTED ID NOT FOUND");

} 



function editObjectX(objectName, val) {

if (objects.indexOf(objectName) != -1) {

    xs[objects.indexOf(objectName)] += val;

} else console.log("OBJ ERR: OBJECT NOT FOUND");


}



function editObjectY(objectName, val) {

if (objects.indexOf(objectName) != -1) {

    ys[objects.indexOf(objectName)] += val;

} else console.log("OBJ ERR: OBJECT NOT FOUND");

}



function RNG(min, max) {

return (Math.floor(Math.random() * (max - min + 1)) + min);

}



function addObject(x, y, objectName) {

if (objects.indexOf(objectName) == -1) {

    objects.push(objectName);
    xs.push(x);
    ys.push(y);

} else console.log("OBJ ERR: OBJECT ALREADY DECLARED");

}



function setUpCanvas() {

canvas = document.getElementById("myCanvas");
ctx = canvas.getContext("2d");

}



// E N D   O F   S C R I P T