{ //setUp and variables

    var base = document.getElementById("base");
    var effect = document.getElementById("effect");
    var inCounter = false;
    var time = 0;
    var baseColour = "255255255"
    var RedGreenBlue = "255255255"
    setUpCanvas(400, 350, 3, "display:block; margin: auto;"); 

    {
    document.addEventListener("keyup", keyUpHandler, false); document.addEventListener("keydown", keyDownHandler, false); 
    var rightPressed = false; var leftPressed = false; var downPressed = false; var upPressed = false;

    function keyDownHandler(e){ //wasd 87 65 83 68 //arrows ^<v> 38 37 40 39 //space 32 
        if(e.keyCode == 39 || e.keyCode == 68) rightPressed = true;
        else if(e.keyCode == 37 || e.keyCode == 65) leftPressed = true;
        else if(e.keyCode == 38 || e.keyCode == 87) upPressed = true;
        else if(e.keyCode == 40 || e.keyCode == 83) downPressed = true;
    }
    function keyUpHandler(e){
        if(e.keyCode == 39 || e.keyCode == 68) rightPressed = false;
        else if(e.keyCode == 37 || e.keyCode == 65) leftPressed = false;
        else if(e.keyCode == 38 || e.keyCode == 87) upPressed = false;
        else if(e.keyCode == 40 || e.keyCode == 83) downPressed = false;
    }

    setInterval(render, 25)

    document.onkeydown = function(e)
    {
        e = e || window.event;
        switch(e.keyCode)
        {
            
        }
    }
    }
    
}

function submit() //when user clicks submit
{
    var correct = true

    if (base.readOnly == false) //if we havent chosen base yet
    {
    
        for (i = 0; i<23; i++) //make sure theres no error
        {
            if (base.value[i] != "0" && base.value[i] != "1")
            {
                correct = false;
                break;
            }
        }
        if (correct == true) //what to do if theres no error
        {
            red = 0;
            green = 0;
            blue = 0;
            base.readOnly = true;
            document.getElementById("effectP").innerHTML="Randomizer";
            effect.placeholder = "Enter a new random string of 1s and 0s.";
            effect.readOnly = false;
            
            var ar = [0, 0, 0]

            for (i = 0; i<3; i++) //convert binary to rgb
            {
                console.log(base.value);
                console.log(ar)
                ar[i]+=parseInt(base.value[0 + (8 * i)]) * 128;
                console.log(ar)
                ar[i]+=parseInt(base.value[1 + (8 * i)]) * 64;
                console.log(ar)
                ar[i]+=parseInt(base.value[2 + (8 * i)]) * 32;
                console.log(ar)
                ar[i]+=parseInt(base.value[3 + (8 * i)]) * 16;
                console.log(ar)
                ar[i]+=parseInt(base.value[4 + (8 * i)]) * 8;
                console.log(ar)
                ar[i]+=parseInt(base.value[5 + (8 * i)]) * 4;
                console.log(ar)
                ar[i]+=parseInt(base.value[6 + (8 * i)]) * 2;
                console.log(ar)
                ar[i]+=parseInt(base.value[7 + (8 * i)]);
                console.log(ar)
                if (ar[i] == 0) ar[i] = "000";
                else if (ar[i] < 10) ar[i] ="00"+String(ar[i]);
                else if (ar[i] < 100) ar[i]="0"+String(ar[i]);
                else ar[i] = String(ar[i]);
                console.log(ar)
                
            }

            baseColour=ar[0]+ar[1]+ar[2]; //plug in rgb
            RedGreenBlue = baseColour;
        }
        else {inCounter = true; time=0} //if theres something wrong
    }
    else //if we've chosen base
    {
        for (i = 0; i<23; i++) //make sure effect has no error
        {
            if (base.value[i] != "0" && base.value[i] != "1")
            {
                correct = false;
                break;
            }
        }
        if (correct == true) //if theres no error
        {
            var newColour = "";
            var ar = [0, 0, 0];

            for (i = 0; i < 24; i++) //randomize
            {
                if (base.value[i] != effect.value[i]) newColour += "1";
                else newColour += "0";
            }
            for (i = 0; i<3; i++) //convert binary to rgb
            {
                ar[i]+=parseInt(newColour[0 + (8 * i)]) * 128;
                ar[i]+=parseInt(newColour[1 + (8 * i)]) * 64;
                ar[i]+=parseInt(newColour[2 + (8 * i)]) * 32;
                ar[i]+=parseInt(newColour[3 + (8 * i)]) * 16;
                ar[i]+=parseInt(newColour[4 + (8 * i)]) * 8;
                ar[i]+=parseInt(newColour[5 + (8 * i)]) * 4;
                ar[i]+=parseInt(newColour[6 + (8 * i)]) * 2;
                ar[i]+=parseInt(newColour[7 + (8 * i)]);
                if (ar[i] == 0) ar[i] = "000";
                else if (ar[i] < 10) ar[i] ="00"+String(ar[i]);
                else if (ar[i] < 100) ar[i]="0"+String(ar[i]);
                else ar[i] = String(ar[i]);

            }

            RedGreenBlue=ar[0]+ar[1]+ar[2]; //plug in rgb
        }
        else {inCounter = true; time=0} //show error message
    }
}

function reset()
{
    base.value="";
    base.readOnly = false;
    effect.readOnly = true;
    effect.placeholder ="-";
    effect.value="";
    baseColour="255255255";
    document.getElementById("effectP").innerHTML="-";
    RedGreenBlue=baseColour;
}

function back()
{
    RedGreenBlue=baseColour;
    effect.value="";
}

function render()
{
    time += 1;
    if (time > 39)
    {
        time = 0;
        inCounter = false;
    }
    drawSquare(0, 0, 400, 350, "rgb("+RedGreenBlue.slice(0, 3)+", "+RedGreenBlue.slice(3, 6)+", "+RedGreenBlue.slice(6, 9)+")");
    if (inCounter == true)
    {
        write(200, 75, "000", 40, "Wrong input")
        write(200, 175, "fff", 40, "Wrong input")
    }
}