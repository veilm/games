var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var background = document.getElementById("background");
var ball = document.getElementById("ball");
var paddle = document.getElementById("paddle");
setInterval(function () {
    ctx.drawImage(background, 0, 0);
    ctx.drawImage(ball, 50, 50);
    ctx.drawImage(paddle, 50, 150);
}, 10);
