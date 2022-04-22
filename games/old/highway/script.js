// S T A R T   O F   S C R I P T   ///////////////////////////////////////////
// Made by Michael Skyba
// NSGM 1.0.0

// P R E - M A D E   L O A D I N G   ///////////////////////////////////////

var canvas;
var ctx;

var objects = [];

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

//  L O A D   ///////////////////////////////////////////////
// F Canv Code setUpCanvas(width, height);
// var x = new object(objectName, x, y, width, height, hex, fontSize, str, size, id)

setUpCanvas(900, 500);

var gen = 0;
var highscore = 0;

var cup;
var level = 0;

var xvel = 0;
var yvel = 0;

var started = false;
var dead = false;

var title = new object("title",canvas.width/2,canvas.height/2-100,0,0,"000",45,"Highway",0,"");
var tip1 = new object("tip1",canvas.width/2,canvas.height/2-30,0,0,"000",30,"Made by Michael Skyba",0,"");
var tip2 = new object("tip2",canvas.width/2,canvas.height/2+20,0,0,"000",15,"Press SPACE to start, press X for instructions!",0,"");
var titlePlayer = new object("titlePlayer", canvas.width/2, canvas.height - 100, 0, 0, "", 0, "", 0, "player");

var Player = new object("Player", canvas.width / 2, canvas.height - 50, 29, 27, 0, 0, 0, 0, "rplayer");
var name;

var BG = new object("BG", 0, 0, canvas.width, canvas.height, "a2f421", 0, "", 0, ""); //bgs and such
var DBG = new object("DBG", 0, 0, canvas.width, canvas.height, "000", 0, "", 0, "");
var road1 = new object("road1", 0, 75, canvas.width, 50, "ccc", 0, "", 0, "");
var road2 = new object("road2", 0, 230, canvas.width, 50, "ccc", 0, "", 0, "");
var road3 = new object("road3", 0, 370, canvas.width, 50, "ccc", 0, "", 0, "");
var prize = new object("prize", RNG(0, 850), 10, 50, 50, "efec32", 17, "Prize", 0, 0);

var car1 = new object("car1", canvas.width / 2, 80, 100, 40, "828282", 0, 0, 0, 0); // setting up cars
var car2 = new object("car2", canvas.width / 2, 235, 100, 40, "828282", 0, 0, 0, 0);
var car3 = new object("car3", canvas.width / 2, 375, 100, 40, "828282", 0, 0, 0, 0);


var car1D, car1M, car2D, car2M, car3D, car3M; //setting up cars
if (RNG(1, 100) > 50)
{
    car1D = "right";
    car1.x = -100;
    car1M = 1;
}
else 
{
    car1D = "left";
    car1.x = 900;
    car1M = -1;
}
if (RNG(1, 100) > 50)
{
    car2D = "right";
    car2.x = -100;
    car2M = 1;
}
else 
{
    car2D = "left";
    car2.x = 900;
    car2M = -1;
}
if (RNG(1, 100) > 50)
{
    car3D = "right";
    car3.x = -100;
    car3M = 1;
}
else 
{
    car3D = "left";
    car3.x = 900;
    car3M = -1;
}


// U P D A T E   ////////////////////////////////////// s

setInterval(update, 30);
function update()
{
    BG.drawSquare(); //draws scene
    road1.drawSquare();
    road2.drawSquare();
    road3.drawSquare();
    
    if (started == false) //main menu
    {
        title.write();
        tip1.write();
        tip2.write();
        titlePlayer.drawImg()
    }
    else if(dead == true)
    {
        if (level > highscore) highscore = level;
        title.y = 125;
        title.str = "Oof! You died!";
        title.hex = "fff";
        DBG.drawSquare(); //draws death screen
        title.write();
        title.y = 200;
        title.str = "Score: "+level+", HighScore: "+highscore;
        title.write();
        title.str = "Press R to go to Main Menu!";
        title.y = 275;
        title.write();
        title.str = "Press T to try again!";
        title.y =350;
        title.write();
        title.str = "Thanks for playing!";
        title.y =425;
        title.write();

    }
    else
    {
        document.getElementById("level").innerHTML=name+" - Level "+level; //sets sign

        
        xvel = xvel * 0.86; // momentum
        yvel = yvel * 0.86;
        Player.x += xvel;
        Player.y += yvel;


        if (Player.x > 900-38) Player.x = 900-29; //collision with walls
        if (Player.x < 0) Player.x = 0;
        if (Player.y < 0) Player.y = 0;
        if (Player.y > 500-27) Player.y = 500-27;


        prize.hex="efec32"; //draws prize
        cup = prize.x;
        prize.y = 10;
        prize.drawSquare();
        prize.hex="000";
        prize.y = 35;
        prize.x += 25;
        prize.write();
        prize.x = cup;

        Player.drawImg(); //draws player

        if (Player.touching(prize) == true) //collision with prize
        {
            level+=1;   //next level
            yvel = 100;
            prize.x = RNG(0, 850);
            Player.x = canvas.width/2;
            Player.y = canvas.height - 50;
        }
        

        // cars!
        
        carMove();
        if(Player.touching(car1) == true || Player.touching(car2) == true || Player.touching(car3) == true) dead = true;

    }
}

// F U N C T I O N S   /////////////////////////////////


function carMove()
{

    car1.x += car1M;
        car2.x += car2M;
        car3.x += car3M;

        if ((car1D == "right" && car1.x > 900) || (car1D == "left" && car1.x < -100))
        {
            if (RNG(1, 100) > 50)
            {
                car1D = "right";
                car1.x = -100;
                car1M = RNG (1, level);
            }
            else 
            {
                car1D = "left";
                car1.x = 900;
                car1M = RNG(0 - level, -1);
            }
        }
        if ((car2D == "right" && car2.x > 900) || (car2D == "left" && car2.x < -100))
        {
            if (RNG(1, 100) > 50)
            {
                car2D = "right";
                car2.x = -100;
                car2M = RNG (1, level);
            }
            else 
            {
                car2D = "left";
                car2.x = 900;
                car2M = RNG(0 - level, -1);
            }
        }
        if ((car3D == "right" && car3.x > 900) || (car3D == "left" && car3.x < -100))
        {
            console.log("car 3 should be switching");
            if (RNG(1, 100) > 50)
            {
                car3D = "right";
                car3.x = -100;
                car3M = RNG (1, level);
            }
            else 
            {
                car3D = "left";
                car3.x = 900;
                car3M = RNG(0 - level, -1);
            }
        }
        car1.drawSquare();
        car2.drawSquare();
        car3.drawSquare();

}

// P R E - M A D E   F U N C T I O N S   ///////////////////////////

// supports:
// setting up canvas, adding objects, rng, updating html elements xy
// key detection, playing sound, drawing shapes
// writing text, redirecting, collision detection

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

        case 88:
            if (started == false) reDir("HTP.html");
            break;

        case 32:
            if (started == false)
            {
                name = prompt("What is your name?");
                level = 1;
                started = true;
                playSound("penguin.mp3", true);
            }
            break;

        case 87:
            if (started == true && dead == false)yvel -= 3;
            break;

        case 83:
            if (started == true && dead == false) yvel += 3;
            break;

        case 65:
            if (started == true && dead == false) xvel -= 5;
            break;

        case 68:
            if (started == true && dead == false) xvel +=5;
            break; 

        case 82:
            if (dead == true) location.reload();
            break;
        
        case 84:
            if (dead == true)
            {
                dead = false;
                level = 1;
                Player.x = canvas.width / 2;
                Player.y = canvas.height - 50;
                xvel = 0;
                yvel = 0;
            }
            break;

        default:

            console.log(e.keyCode);
    }
}

function RNG(min, max) 
{
    return (Math.floor(Math.random() * (max - min + 1)) + min);
}

// E N D   O F   S C R I P T