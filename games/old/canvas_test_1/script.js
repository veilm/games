var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width/2;
var y = canvas.height/2;
var dx = 0;
var dy = 0;
var ex = random(canvas.width, 0);
var ey = random(canvas.height, 0);
var bx = random(canvas.width, 0);
var by = random(canvas.height, 0);
var wx = Math.floor(x);
var wy = Math.floor(y);
var score = 0;
var pop = new Audio('pop.wav');
var zoop = new Audio('zoop.wav');

document.onkeydown = function (e) {
    e = e || window.event;
    
    if (e.keyCode == 65) {
    
        if (x > 0) {
    
            dx = dx - 2;
            
        }
    
    } 
    
    else {
    
        if (e.keyCode == 87) {
        
            dy = dy - 2;	
        
        }
        
        else {
        
            if (e.keyCode == 83) {
                
                dy = dy + 2;
            
            }
            
            else {
            
                if (e.keyCode == 68) {
            
                    dx = dx + 2;
                
                }
                
            }
        
        }
        
    }

}

function draw () {

    dx = dx * 0.92;
    dy = dy * 0.92;
    
    x = x + dx;
    y = y + dy;
    
    if (bx > Math.floor(x)) {
        bx = bx - 0.5;
    }
    
    else {
    
        if (Math.floor(x) > bx) {
        
            bx = bx + 0.5;
        
        }
        
        else {
        
            if (x > bx - 50 && x < bx + 50 && y > by - 50 && by + 50 > y) {
        
                score = 0;
                
                zoop.play();
                
            }
        
        }
    
    }
    
    if (by > Math.floor(y)) {
    
        by = by - 0.5;
    
    }
    
    else {
    
        if (Math.floor(y) > by) {
        
            by = by + 0.5;
        
        }
        
        else {
        
            if (bx > x - 50 && bx < x + 50 && by > y - 50 && y + 50 > by) {
                    
                    
                if (score == 0) {
                

                
                }
                
                else {
                
                    score = 0;
                
                    zoop.play();							
                
                }
                
                

                
            }
        
        }
    
    }
    
    
    
    if (0 > y) {
    
        y = 0;
    
    }
    
    if (y > 450) {
    
        y = 450;
    
    }
    
    if (x > 615) {
    
        x = 615;
    
    }
    
    if (0 > x) {
    
        x = 0;
    
    }
    
    if (x > ex - 50 && x < ex + 50 && y > ey - 50 && ey + 50 > y) {
    
        ex = random(canvas.width, 0);
        ey = random(canvas.height, 0);
        
        score = score + 1;
        
        pop.play();
        
    
    }
    
    document.getElementById("score").innerHTML = "Score: " + score;
    
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.rect(ex, ey, 50,50);
    ctx.fillStyle = "#FCE327";
    ctx.fill();
    ctx.closePath();
    
    ctx.beginPath();
    ctx.rect(bx, by, 50, 50);
    ctx.fillStyle = "#F73737";
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.rect(x, y, 50,50);
    ctx.fillStyle = "#000000";
    ctx.fill();
    ctx.closePath();

}

function random (max, min) {

    return (Math.floor(Math.random()*(max - min + 1)) + min);

}

setInterval(draw, 10);