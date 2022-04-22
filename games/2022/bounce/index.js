var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var x_input = document.getElementById("x_input");
var y_input = document.getElementById("y_input");
var vel_x = 0;
var vel_y = 0;
var x = 300;
var y = 200;
function draw_rect(x, y, width, height, colour) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fillStyle = colour;
    ctx.fill();
    ctx.closePath();
}
setInterval(function () {
    draw_rect(0, 0, ctx.canvas.width, ctx.canvas.height, "#303030");
    draw_rect(x - 5, y - 5, 10, 10, "#fff");
    x += vel_x;
    y += vel_y;
    vel_x *= 0.98;
    vel_y *= 0.98;
    if (x > 600) {
        x = 600;
        vel_x *= -1;
    }
    if (x < 0) {
        x = 0;
        vel_x *= -1;
    }
    if (y > 400) {
        y = 400;
        vel_y *= -1;
    }
    if (y < 0) {
        y = 0;
        vel_y *= -1;
    }
}, 10);
document.getElementById("submit").onclick = function () {
    var add_x = parseInt(x_input.value);
    var add_y = parseInt(y_input.value);
    if (!isNaN(add_x))
        vel_x += add_x;
    if (!isNaN(add_y))
        vel_y += add_y;
};
