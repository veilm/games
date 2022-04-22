// S T A R T   O F   S C R I P T   ///////////////////////////////////////////
// Made by Michael Skyba
// NSGM 1.0.2

// P R E - M A D E   L O A D I N G   ///////////////////////////////////////

var canvas;
var ctx;

var objects = [""];

var mouseX;
var mouseY;

window.onload = init;
function init() {

    if (window.Event) document.captureEvents(Event.MOUSEMOVE);
    document.onmousemove = getCursorXY;
}

function getCursorXY(e) {
    mouseX = (window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
    mouseY = (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
}


//ga
//population

//fitness
//reproduction
//mutation
//loop

//  L O A D   ///////////////////////////////////////////////
//var x = new object(objectName, x, y, width, height, hex, fontSize, str, size, id)
//Canv Code setUpCanvas(width, height);
//hex eg: green = 53d153, blue = 5265d1, yellow = e7f46e, red: ff2d2d, dark gray: 4c4c4c, light gray: c4c4c4
//purple: 952bdb, brown: af541f, orange: fcab32; light-blue: 31d0fc

setUpCanvas(900, 500);
console.log("Lower fitness is better than higher fitness, fitness represents how far away the average square is from the goal.");
console.log("A high fitness means it's far away, while a small fitness means it's close to the goal.");
console.log("Keep your eye on here after future generations for average fitness scores.");
console.log("You can keep track of how the Genetic Algorithm is improving!");

var a = 0;
var gen = 0;
var sub = -1;
var done = false;
var newss = ["if it wins on an early generation it probably just got lucky", "Sleep is detrimental to your health", "Open up the JS Console to look at average gen fitness", "Developed by Michael Skyba", "Genetic Algorithms are cooler than Artificial Neural Networks", "help", "Im sorry", "reality is often disappointing"];

var news = newss[RNG(0, newss.length - 1)];
var speed = prompt("Speed? 1 is normal. Do higher than one to get a faster demonstration. Rec: 1 - 4");
if (speed < 1) speed = 1;
speed = Number(speed);

var population = prompt("Population for Each Generation? Rec: 16-26. Do an even number.");
if (Math.round(population / 2)*2 != population)
{
    population = Math.round(population/2)*2;
    alert("I said no odd numbers. Your population size has been rounded to "+population+" because your previous choice was not an even number.");
}
if (population < 1)
{
    alert("why would you choose that? Are you trying to mess it up on purpose? Your population is now 20.");
    population = 20;
}
if (isNaN(population))
{
    alert("that's not even a number? Your population is now 20");
    population = 20;
}
var mut = prompt("Mutation rate? Rec: 6-16");
if (mut == null) 
{
    alert("why")
    mut = 6;
}
else if (mut < 1)
{
    mut = 6;
} 
else
{
    mut = Number(mut);
}
population = Number(population);

var goal = new object("goal", 999, 999, 20, 20, "e7f46e", 0, 0, 0, 0);
var bg = new object("bg", 0, 0, 900, 500, "c4c4c4", 0, 0, 0, 0);
var subject = new object("subject", 0, 0, 20, 20, "4c4c4c", 0, 0, 0, 0);
var text1 = new object("text1", 450, 450, 0, 0, "000", 28, "oof", 0, 0);
var text2 = new object("text2", 450, 475, 0, 0, "000", 28, "The AI won easily.", 0, 0);
var xm = [];
var ym = [];
var nxm = [];
var nym = [];
var fitness = [];           

goal.x = RNG(0, 850);
goal.y = RNG(0, 450);
subject.x = RNG(0, 850);
subject.y = RNG(0, 450);
var keeper = subject.x;
subject.x = goal.x;
if (subject.touching(goal)==true)subject.x = RNG(0, 850);
else subject.x = keeper;

var ox = subject.x;
var oy = subject.y;
pop();

// U P D A T E   ////////////////////////////////////// 

setInterval(update, 25);

function update()
{
    text1.str = "Gen "+gen+" Sub "+(sub+1);
    document.getElementById("locator").innerHTML = news;
    bg.drawSquare();
    
    goal.drawSquare();
    subject.drawSquare();
    text1.write();
    if (done == true) text2.write();
    if (subject.touching(goal) == true) done = true;

}

// F U N C T I O N S   /////////////////////////////////

function pop()
{
    for (i = 0; i < population; i++)
    {
        xm.push(RNG(0, 850));
        ym.push(RNG(0, 450));
    }
    gen = 1;
    sub = 0;
    if (subject.x > xm[0]) setTimeout(moveLeft, 2000);
    else setTimeout(moveRight, 2000);

}

function moveLeft()
{
    if (done == false)
    {
        subject.x-=2.5;
        if(subject.x < xm[sub])
        {
            subject.x = xm[sub];
            if (subject.y > ym[sub]) setTimeout(moveUp, 25/speed);
            else setTimeout(moveDown, 25/speed);
        }
        else setTimeout(moveLeft, 25/speed);
    }
}

function moveRight()
{
    if (done == false)
    {
        subject.x+=2.5;
        if(subject.x > xm[sub])
        {
            subject.x = xm[sub];
            if (subject.y > ym[sub]) setTimeout(moveUp, 25/speed);
            else setTimeout(moveDown, 25/speed);
        }
        else setTimeout(moveRight, 25/speed);
    }
}

function moveUp()
{
    if (done == false)
    {
        subject.y -= 2.5;
        if (subject.y < ym[sub])
        {
            subject.y = ym[sub];
            cFitness();
        }
        else setTimeout(moveUp, 25/speed);
    }
}

var fitnesses = [];
var fitnessI = 0;

function moveDown()
{
    if (done == false)
    {
        subject.y += 2.5;
        if (subject.y > ym[sub])
        {
            subject.y = ym[sub];
            cFitness();
        }
        else setTimeout(moveDown, 25/speed);
    }
}

function cFitness()
{
    if (done == false)
    {
        var xf = goal.x - subject.x;
        xf = Math.abs(xf);
        var yf = goal.y - subject.y;
        yf = Math.abs(yf);
        var distance = Math.sqrt((xf * xf) + (yf * yf));
        var lowest;
        nym = [];
        nxm = [];
        fitness.push(distance);
        sub += 1;
        subject.x = ox;
        subject.y = oy;
        if (sub + 1> population)
        {
            var average = 0;
            for (z = 0; z < population; z++)
            {
                average+=fitness[z];
            }
            average = average / population;
            console.log("Gen "+(gen)+" Average Fitness: "+average);
            fitnesses.push(average);
            if (fitnessI > 0) console.log("Improvement: "+(fitnesses[fitnessI - 1] / average));
            fitnessI += 1;
            //done gen
            for (i = 0; i < (population / 2); i++)
            {
                lowest = 0;
                for (ii = 0; ii < population; ii++) //finding dudes with best fitness
                {
                    if (fitness[ii] < fitness[lowest]) lowest = ii;
                }
                fitness.splice(lowest, 1);
                nym.push(ym[lowest]);
                nxm.push(xm[lowest]);
                nym.push(ym[lowest]);
                nxm.push(xm[lowest]);
            }
            xm.splice(0, xm.length);
            ym.splice(0, ym.length);
            for (iii = 0; iii < population; iii++)
            {
                if (RNG(1, 100) < mut + 1) nxm[iii] = RNG(nxm[iii] * 0.5, nxm[iii] * 1.5);
                if (RNG(1, 100) < mut + 1) nym[iii] = RNG(nym[iii] * 0.5, nym[iii] * 1.5);
                if (nym[iii] > 450) nym[iii] = 450;
                if (nym[iii] < 0) nym[iii] = 0;
                if (nxm[iii] > 850) nxm[iii] = 450;
                if (nxm[iii] < 0) nxm[iii] = 0;
                ym.push(nym[iii]);
                xm.push(nxm[iii]);
            }
            gen+=1;
            fitness = [];
            news = newss[RNG(0, newss.length - 1)];
            sub = 0;
            if (subject.x > xm[sub]) setTimeout(moveLeft, 25/speed);
            else setTimeout(moveRight, 25/speed);
            
        }
        else
        {
            if (subject.x > xm[sub]) setTimeout(moveLeft, 25);
            else setTimeout(moveRight, 25/speed);
        }
    }
}

// P R E - M A D E   F U N C T I O N S   ///////////////////////////

// supports:
// setting up canvas, adding objects, rng, updating html elements xy
// key detection, playing sound, drawing shapes
// writing text, redirecting, collision detection

function order(lhhl, arrayy)
{
    if (lhhl = "hl") arrayy.sort(function(a, b){return b - a});
    else arrayy.sort(function(a, b){return a - b});
}

function setUpCanvas(width, height) {
    var cd = document.createElement('canvas');
    cd.id = "myCanvas";
    cd.width = width;
    cd.height = height;
    var body = document.getElementsByTagName("div")[0];
    body.appendChild(cd);
    cursorLayer = document.getElementById("CursorLayer");
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    canvas.style = "display:block; margin: auto;";
}

function object(objectName, x, y, width, height, hex, fontSize, str, size, id)
{
    if (objects.indexOf(objectName) == -1)
    {
        objects.push(objectName);
        this.objectName = objectName;
        this.y = y;
        this.x = x;
        this.width = width;
        this.height = height;
        this.hex = hex;
        this.fontSize = fontSize;
        this.str = str;
        this.size = size;
        this.id = id;

        this.help = function()
        {
            console.log("objectName, x, y, width, height, hex, fontSize, str, size, id");
            console.log("help(), diagnostic(), drawSquare(), drawCircle(), write(), drawImg, touching(obj), update()");
        }

        this.diagnostic = function()
        {
            console.log(this.objectName+" is working fine!");
        }

        this.drawSquare = function() 
        {
            ctx.beginPath();
            ctx.rect(this.x, this.y, this.width, this.height); 
            ctx.fillStyle = ("#"+this.hex);
            ctx.fill();
            ctx.closePath();
        }
        
        this.drawImg = function()
        {
            var img = document.getElementById(this.id);
            if (img) ctx.drawImage(img, this.x, this.y);
            else console.error("ID ERR: ELEMENT ASSIGNED WITH SUGGESTED ID NOT FOUND");
        }

        this.touching = function(obj)
        {
            var xj = 0;
            var yj = 0;
            if ((this.x + this.width) > obj.x && (obj.x + obj.width) > this.x) xj = 1;
            if ((this.y + this.height) > obj.y && (obj.y + obj.height) > this.y) yj = 1;
            if (xj + yj == 2 )return true;
            else return false;
        }

        this.write = function()
        {
            ctx.font=this.fontSize+"px Comic Sans MS";
            ctx.fillStyle = "#" + this.hex;
            ctx.textAlign = "center";
            ctx.fillText(this.str, this.x, this.y);
        }

        this.drawCircle = function()
        {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); 
            ctx.fillStyle = ("#" + this.hex);
            ctx.fill();
            ctx.closePath();
        }

        this.update = function()
        {
            var myEle = document.getElementById(this.id);
            if(myEle) 
            {
                    console.log("ELE WAR: ERROR MAY SHOW IF POSITION IS NOT ABSOLUTE");
                    myEle.style.left = this.x;
                    myEle.style.top = this.y;

            }
            else console.error("ID ERR: ELEMENT ASSIGNED WITH SUGGESTED ID NOT FOUND"); 
        } 
    }
    else console.error("OBJ ERR: OBJECT ALREADY EXISTS");
}

function reDir(url)
{
    window.location.replace(url);
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

function RNG(min, max) 
{
    return (Math.floor(Math.random() * (max - min + 1)) + min);
}

// E N D   O F   S C R I P T