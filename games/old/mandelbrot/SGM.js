            
 //Made By Michael Skyba
 /*Cheat Sheet:

 MouseX, MouseY = Pretty Obvious
 setUpCanvas(width, height, divID, css)
 cl(log) console.log short form
 drawSquare(x, y, width, height, hex)
 drawImg(x, y, id) make an <img> with an id 
 touching(obj1x, obj1y, obj1w, obj1h, obj2x, obj2y, obj2w, obj2h) 
 roundTD(number, decimal);
 RNG(min, max)
 reDir(url)
 rHex() returns a random hex value
 write(x, y, hex, size, string)
 sigmoid(x) for neural networks
 drawLine(startingX, startingY, endingX, endingY, width, hex);

 variable = new Audio(source);
                
if (you want it to loop)
{
    variable.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
    }, false);
}

variable.play(); to play it
variable.pause(); to pause it

variable.pause();
variable.currentTime = 0; to stop it
 */
            
            

            

var canvas; var ctx; var objects = [""]; var hexs = ["eh", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"]; var mouseX;
var mouseY; window.onload = init; function init() { if (window.Event) document.captureEvents(Event.MOUSEMOVE);
document.onmousemove = getCursorXY;} function getCursorXY(e) { mouseX = (window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
mouseY = (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);}
function RNG(min, max) {return (Math.floor(Math.random() * (max - min + 1)) + min);}
function drawSquare(x, y, width, height, hex){ ctx.beginPath(); ctx.rect(x, y, width, height); ctx.fillStyle = hex; ctx.fill(); ctx.closePath();}
function drawImg(x, y, id){var img = document.getElementById(id); if (img) ctx.drawImage(img, x, y); else console.error("There is not an img element with that ID.");}
function touching(obj1x, obj1y, obj1w, obj1h, obj2x, obj2y, obj2w, obj2h){var xj = 0;var yj = 0;if ((obj1x + obj1w) > obj2x && (obj2x + obj2w) > obj1x) xj = 1;
if ((obj1y + obj1h) > obj2y && (obj2y + obj2h) > obj1y) yj = 1;if (xj + yj == 2 )return true;else return false;}
function write(x, y, hex, size, string){ctx.font=size+"px Comic Sans MS";ctx.fillStyle = "#" + hex;ctx.textAlign = "center";ctx.fillText(string, x, y);}
function rHex(){var lal = "";for (i = 0; i < 6; i++){lal = lal + hexs[RNG(1, hexs.length-1)];}return lal;}
function setUpCanvas(width, height, divID, css){var cd = document.createElement('canvas');cd.id = "myCanvas";cd.width = width;cd.height = height;var body = document.getElementsByTagName("div")[divID];
body.appendChild(cd);cursorLayer = document.getElementById("CursorLayer");canvas = document.getElementById("myCanvas");ctx = canvas.getContext("2d");canvas.style = css;}
function reDir(url){window.location.replace(url);} function drawRotatedImg(x, y, id, angle){var img = document.getElementById(id);ctx.save();ctx.translate(x, y);
ctx.rotate((Math.PI / 180) * angle);ctx.drawImage(img, -(img.width/2), -(img.height/2));ctx.restore();}function sigmoid(t){return 1/(1+Math.pow(Math.E, -t));}
function drawLine(startingX, startingY, endingX, endingY, width, hex){ctx.beginPath();ctx.moveTo(startingX, startingY);ctx.lineTo(endingX, endingY);ctx.lineWidth=width;ctx.strokeStyle = hex;ctx.stroke();}
function roundTD(number, decimal){var a=number;a=a.toFixed(decimal);a=Number(a);return a}function cl(log){console.log(log);}