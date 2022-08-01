// S T A R T   O F   S C R I P T   ///////////////////////////////////////////
// Made by Michael Skyba
// SGM 11.2.2

// P R E - M A D E   L O A D I N G   ///////////////////////////////////////

var canvas;
var ctx;

var xs = [""];
var ys = [""];
var objects = [""];

//  L O A D   ///////////////////////////////////////////////
// F Canv Code setUpCanvas();

setUpCanvas();
addObject(0, 0, "BG");
addObject(750, 25, "watermark");
addObject(50, 50, "Player");
addObject(canvas.width / 2, canvas.height / 2, "gameOverText");
addObject(25, 25, "Score");
addObject(canvas.width + 100, (RNG(50, canvas.height - 150)) - canvas.height, "Pipe1Top");
addObject(canvas.width + 100, y("Pipe1Top") + canvas.height + 100, "Pipe1Bottom");
addObject(canvas.width + 500, (RNG(50, canvas.height - 150)) - canvas.height, "Pipe2Top");
addObject(canvas.width + 500, y("Pipe2Top") + canvas.height + 100, "Pipe2Bottom");
addObject(canvas.width + 900, (RNG(50, canvas.height - 150)) - canvas.height, "Pipe3Top");
addObject(canvas.width + 900, y("Pipe3Top") + canvas.height + 100, "Pipe3Bottom");
var score = 0;
var vel = 0;
var gameOver = false;

// U P D A T E   ////////////////////////////////////// 
// use setInterval(function, 10);

setInterval(update, 30);

// F U N C T I O N S   /////////////////////////////////

function collisionDetecting()
{
    if ( ys[id("Player")] > canvas.height || ys[id("Player")] < -25) gameOver = true;
    var x = touching("Player", 25, 25, "Pipe1Top", 50, canvas.height);
    var x2 = touching("Player", 25, 25, "Pipe1Bottom", 50, canvas.height);
    var y = touching("Player", 25, 25, "Pipe2Top", 50, canvas.height);
    var y2 = touching("Player", 25, 25, "Pipe2Bottom", 50, canvas.height);
    var z = touching("Player", 25, 25, "Pipe3Top", 50, canvas.height);
    var z2 = touching("Player", 25, 25, "Pipe3Bottom", 50, canvas.height);

    if (x == true || x2 == true || y == true || y2 == true || z == true || z2 == true) gameOver = true;
}

function update()
{
    
    if (gameOver == false)
    {
        editObjectX("Pipe1Top", -5);
        editObjectX("Pipe1Bottom", -5);
        editObjectX("Pipe2Top", -5);
        editObjectX("Pipe2Bottom", -5);
        editObjectX("Pipe3Top", -5);
        editObjectX("Pipe3Bottom", -5);
        console.log(y("Pipe1Top"));

        score += 1;
        vel += .22;

        drawSquare("BG", canvas.width, canvas.height, "595959");

        editObjectY("Player", vel);
        drawSquare("Player", 25, 25, "ff1c1c");

        if (x("Pipe1Top") < -50)
        {
            editObjectX("Pipe1Top", canvas.width + 100);
            editObjectX("Pipe1Bottom", canvas.width + 100);
            setObjectY("Pipe1Top", RNG(50, canvas.height - 150) - canvas.height);
            setObjectY("Pipe1Bottom", y("Pipe1Top") + canvas.height + 100);
        } 
        if (x("Pipe2Top") < -50)
        {
            editObjectX("Pipe2Top", canvas.width + 100);
            editObjectX("Pipe2Bottom", canvas.width + 100);
            setObjectY("Pipe2Top", RNG(50, canvas.height - 150) - canvas.height);
            setObjectY("Pipe2Bottom", y("Pipe2Top") + canvas.height + 100);
        } 
        if (x("Pipe3Top") < -50)
        {
            editObjectX("Pipe3Top", canvas.width + 100);
            editObjectX("Pipe3Bottom", canvas.width + 100);
            setObjectY("Pipe3Top", RNG(50, canvas.height - 150) - canvas.height);
            setObjectY("Pipe3Bottom", y("Pipe3Top") + canvas.height + 100);
        } 

        drawSquare("Pipe1Top", 50, canvas.height, "fff");
        drawSquare("Pipe1Bottom", 50, canvas.height, "fff");
        drawSquare("Pipe2Top", 50, canvas.height, "fff");
        drawSquare("Pipe2Bottom", 50, canvas.height, "fff");
        drawSquare("Pipe3Top", 50, canvas.height, "fff");
        drawSquare("Pipe3Bottom", 50, canvas.height, "fff");

        write("Score", score, 18, "000000");

        collisionDetecting();
    }
    else write("gameOverText", "Game Over! Click R to try again!", 50, "000000");
    write("watermark", "Made by michael skyba", 28, "000");
}



// P R E - M A D E   F U N C T I O N S   ///////////////////////////

// supports:
// setting up canvas, changing xy, adding objects, rng, updating html elements xy
// key detection, playing sound, drawing shapes, getting quick id, setting xy
// writing text, redirecting

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
    audio.play();
    
}
        


document.onkeydown = function (e) 
{
            
    e = e || window.event;

    switch (e.keyCode)
    {

        // add more cases for key detection

        case 80:

            vel = -6;
            break;
        
        case 82:
            if (gameOver == true) location.reload();
            break;

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