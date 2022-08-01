//I might add supprot for several different color schemes/different functions besides z^2+c, idks
setUpCanvas(400, 400, 1, "display:block; float: right; top: 0px; margin-right: 10%; margin-top: 2%;"); 
var iteration = 0;

ctx.clearRect(0, 0, 400, 400);
var visual = ctx.getImageData(0, 0, 400, 400);
var pixels = visual.data;
var mandelbrot = [];
var mandelbrot2 = [];

for (i = 0; i < 401; i++)
{
    for (ii = 0; ii < 401; ii++) {
        var x = ii;
        var y = i;
        var r, g, b;

        if (Math.sqrt(Math.abs(x-200)**2 + Math.abs(y-200)**2)>200)
        {
            r = 50;
            g = 50;
            b = 50;
        }
        else
        {
            r=0;g=0;b=0;
            mandelbrot.push([x, y]);
        }

        var off = (y * 400 + x) * 4;
        pixels[off] = r;
        pixels[off + 1] = g;
        pixels[off + 2] = b;
        pixels[off + 3] = 255;
    }
    
}
ctx.putImageData(visual, 0, 0);

function it()
{
    iteration+=1;

    for (i = 0; i < mandelbrot.length; i++)
    {
        x = (mandelbrot[i][0]-200)/100;
        y = (mandelbrot[i][1]-200)/100;
        y*=-1;
        
        var next = fzc(x, y, iteration);

        if (Math.sqrt(Math.abs(next[0])**2 + Math.abs(next[1])**2)>2)
        {
            r = (iteration+5)*10;
            g = (iteration+5)*10;
            b = (iteration+5)*10;
        }
        else
        {
            r=0;g=0;b=0;
            mandelbrot2.push([mandelbrot[i][0], mandelbrot[i][1]]);
        }

        off = (mandelbrot[i][1] * 400 + mandelbrot[i][0]) * 4;
        pixels[off] = r;
        pixels[off + 1] = g;
        pixels[off + 2] = b;
        pixels[off + 3] = 255;
    }

    mandelbrot=mandelbrot2;
    mandelbrot2=[];
    ctx.putImageData(visual, 0, 0);
}


function fzc(x, y, iii)
{
    var cx = x;
    var cy = y;
    var cx2;
    var cy2;
    for (a=0; a<iii; a++)
    {
        cx2=cx**2-cy**2;
        cy2=2*cx*cy;
        cx=cx2;
        cx2=0;
        cy=cy2;
        cy2=0;
        cx+=x;
        cy+=y;
    }
    return [cx, cy];
}