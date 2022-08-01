// S T A R T   O F   S C R I P T   ///////////////////////////////////////////
// Made by Michael Skyba
// NSGM 1.0.1

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

//  L O A D   ///////////////////////////////////////////////
// F Canv Code setUpCanvas(width, height);

setUpCanvas(900, 500);

var BG = new object("BG", 0, 0, canvas.width, canvas.height, "a2f421", 0, "", 0, "");
var text = new object("text", canvas.width / 2, 100, 0, 0, "000", 50, "Instructions", 0, "");
var text1 = new object("text1", canvas.width / 2, 175, 0, 0, "000", 30, "Use WASD to move your player!", 0, "");
var text2 = new object("text2", canvas.width / 2, 250, 0, 0, "000", 30, "Get your player past the highway to the prize!", 0, "");
var text3 = new object("text3", canvas.width / 2, 325, 0, 0, "000", 30, "Watch out for the dangerous cars!", 0, "");
var text4 = new object("text4", canvas.width / 2, 400, 0, 0, "000", 30, "Click B to go back to the Main Menu!", 0, "");

BG.drawSquare();
text.write();
text1.write();
text2.write();
text3.write();
text4.write();

// U P D A T E   ////////////////////////////////////// 


// F U N C T I O N S   /////////////////////////////////



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
            console.log(objectName+" working fine!");
        }

        this.drawSquare = function() 
        {
            ctx.beginPath();
            ctx.rect(x, y, width, height); 
            ctx.fillStyle = ("#"+hex);
            ctx.fill();
            ctx.closePath();
        }
        
        this.drawImg = function()
        {
            var img = document.getElementById(id);
            if (img) ctx.drawImage(img, x, y);
            else console.error("ID ERR: ELEMENT ASSIGNED WITH SUGGESTED ID NOT FOUND");
        }

        this.touching = function(obj)
        {
            var x = 0;
            var y = 0;
            if ((x + width) > obj.x && (obj.x + obj.width) > x) x = 1;
            if ((y + height) > obj.y && (obj.y + obj.height) > y) y = 1;
            if (x + y == 2 )return true;
            else return false;
        }

        this.write = function()
        {
            ctx.font=fontSize+"px Comic Sans MS";
            ctx.fillStyle = "#" + hex;
            ctx.textAlign = "center";
            ctx.fillText(str, x, y);
        }

        this.drawCircle = function()
        {
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2); 
            ctx.fillStyle = ("#" + hex);
            ctx.fill();
            ctx.closePath();
        }

        this.update = function()
        {
            var myEle = document.getElementById(id);
            if(myEle) 
            {
                    console.log("ELE WAR: ERROR MAY SHOW IF POSITION IS NOT ABSOLUTE");
                    myEle.style.left = x;
                    myEle.style.top = y;

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
        case 66:

            reDir("highway.html");
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