// P R E - M A D E   L O A D I N G   ///////////////////////////////////////

var canvas;
var ctx;

var xs = [""];
var ys = [""];
var objects = [""];

//  L O A D   ///////////////////////////////////////////////
// F Canv Code setUpCanvas();

let background_music = new Audio("royalty_free.wav")
background_music.addEventListener("ended", function()
{
    background_music.pause();
    background_music.currentTime = 0;
    background_music.play();
})

setUpCanvas();

addObject(0, 0, "BG")

addObject(0, 0, "Room1Wall1");
addObject(0, 0, "Room1Wall2");
addObject(0, canvas.height - 50, "Room1Wall3");

addObject((canvas.width / 2) - 25, (canvas.height / 2) - 25, "Player");

addObject(450,350,"Puddle");

addObject(canvas.width-50, 0, "Room2Wall2");
addObject(0, canvas.height - 50, "Room2Wall3");

addObject(0, 0, "Room2Wall1Back");
addObject(canvas.width / 3, 0, "Room2Wall1Front");
addObject(canvas.width / 2, 25, "Lock")

addObject(0, 0, "Room3Wall2");
addObject(0, 0, "Room3Wall1");
addObject(canvas.width - 50, 0, "Room3Wall3");

addObject(canvas.width / 3 * 2, canvas.height / 4, "Key");

addObject(canvas.width / 3, canvas.height / 4, "SignFront");
addObject(canvas.width / 3 + 50, canvas.height / 4 + 30, "SignBack");

addObject(canvas.width / 2, canvas.height / 2, "PuddleText");
addObject(canvas.width / 2, canvas.height / 4 * 3, "SignText");

var room = 1;

var touchingPuddle = false;
var steppedPuddle = false;
var gottenKey = false;
var openedDoor = false;
var seenSign = false;
var touchingSign = false;

var velX = 0;
var velY = 0;



// U P D A T E   ////////////////////////////////////// 
// use setInterval(function(), 10);

let count = 0;
setInterval(update, 10);

// F U N C T I O N S   /////////////////////////////////

function update()
{
    count+=1;
    if (count == 1000) background_music.play();

    //clr
    clearScreen();

    //draw bg
    drawSquare("BG", canvas.width, canvas.height, "adadad");

    //draws rooms
    if (room == 1) drawRoom1();
    else if (room == 2) drawRoom2();
    else drawRoom3();

    //draw player
    drawPlayer();
}

function drawRoom1() // just draws the walls and maybe the key
{
    drawSquare("Room1Wall1", canvas.width, 50, "75472a");
    drawSquare("Room1Wall2", 50, canvas.height, "75472a");
    drawSquare("Room1Wall3", canvas.width, 50, "75472a");

    if (steppedPuddle == true && gottenKey == false) {
        
        drawSquare("Key", 75, 25, "f8ff38");

        var x = touching("Player", 50, 50, "Key", 75, 25);
        if (x == true) gottenKey = true;
        
    }


    
}

function drawRoom2()
{
    drawSquare("Room2Wall2", 50, canvas.height, "75472a");
    drawSquare("Room2Wall3", canvas.width, 50, "75472a");
    
    if (openedDoor == false)
    {
        drawSquare("Room2Wall1Back", canvas.width, 50, "75472a");
        drawSquare("Room2Wall1Front", canvas.width / 3, 50, "383838");
        drawSquare("Lock", 10, 20, "000000");
    }

    drawSquare("Puddle", 75, 50, "374fc6");

    var x = touching("Player", 50, 50, "Puddle", 75, 50);
    if (x == true && steppedPuddle == false)
    {
        write("PuddleText", "Click E to step in the Puddle!", 30, "000000");
        touchingPuddle = true;
    }
    
}

function drawRoom3()
{
    
    drawSquare("Room3Wall1", 50, canvas.height, "75472a");
    drawSquare("Room3Wall2", canvas.width, 50, "75472a");
    drawSquare("Room3Wall3", 50, canvas.height, "75472a");
    drawSquare("SignBack", 25, 50, "382113");
    drawSquare("SignFront", 150, 50, "6d3f24");

    var x = touching("Player", 50, 50, "SignFront", 150, 50);
    if (x == true){ write("SignText", "Room1Wall3", 30, "000000"); seenSign = true;}

}

function drawPlayer()
{
    velX = velX * 0.86; // momentum
    velY = velY * 0.86;
    editObjectX("Player", velX);
    editObjectY("Player", velY);

    if (room == 1)
    {
        if (xs[id("Player")] < 50) setObjectX("Player", 50); // make sure he isnt going off the screen left
        if (ys[id("Player")] < 50) setObjectY("Player", 50); // top

        if (ys[id("Player")] > canvas.height - 100) //bottom
        {
            if(seenSign == false) setObjectY("Player", canvas.height - 100);
            else
            {
                reDir("Ending.html");
            }
        }
        if (xs[id("Player")] > canvas.width - 100) // if right
        {
            room = 2; //bring next room
            setObjectX("Player", 100);
        }
    }

    else if (room == 2)
    {

        if (xs[id("Player")] > canvas.width - 100) setObjectX("Player", canvas.width - 100); // make sure he isnt going off the screen right
        if (ys[id("Player")] > canvas.height - 100) setObjectY("Player", canvas.height - 100);//bottom
        if (xs[id("Player")] < 50) // if right
        {
            room = 1; //bring room 1
            setObjectX("Player", canvas.width - 150);
        }
        if (ys[id("Player")] < 50)
        {
            if (gottenKey == false) setObjectY("Player", 50); // top
            else if (openedDoor == true)
            {
                room = 3;
                setObjectY("Player", canvas.height - 100);
            }
            else if (gottenKey == true && xs[id("Player")] > canvas.width / 3 && xs[id("Player")] < canvas.width / 3 * 2) 
            {
                openedDoor = true;
                room = 3;
                setObjectY("Player",canvas.height - 150);
            }
            else setObjectY("Player", 50);
        }

    }

    else
    {
        if (ys[id("Player")] < 50) setObjectY("Player", 50);
        if (xs[id("Player")] > canvas.width - 100) setObjectX("Player", canvas.width - 100);
        if (xs[id("Player")] < 50) setObjectX("Player", 50);
        if (ys[id("Player")] > canvas.height - 100)
        {
            room = 2;
            setObjectY("Player", 100);
        }
    }

    drawSquare("Player", 50, 50, "753131");
}

// P R E - M A D E   F U N C T I O N S   ///////////////////////////

// supports:
// setting up canvas, changing xy, adding objects, rng, updating html elements xy
// key detection, playing sound, drawing shapes, getting quick id, setting xy
// writing text, redirecting, detecting if two things are touching

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

        case 69:

            if (touchingPuddle == true) steppedPuddle = true;
            break;

        case 87:

            velY = velY - 5;
            break;

        case 83:

            velY = velY + 5;
            break;

        case 65:

            velX -= 5;
            break;

        case 68:

            velX += 5;
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