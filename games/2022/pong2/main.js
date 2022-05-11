var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var game = {
    "marginY": 10,
    "status": "on",
    "width": canvas.width,
    "height": canvas.height,
    "score": 0,
    "highScore": 0,
    "speed": 1.0,
    "updateText": function () {
        var elements = ["score", "highScore", "speed"];
        for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
            var element = elements_1[_i];
            document.getElementById(element).innerHTML = this[element];
        }
    },
    "increment": function () {
        this.score++;
        if (this.score > this.highScore && game.status != "speedPractice")
            this.highScore = this.score;
        this.speed += 0.05;
        this.speed = Math.round(this.speed * 100) / 100;
        this.updateText();
    },
    "newRound": function (speed) {
        // This is an ugly DRY violation but I'm not sure how to fix it while
        // keeping TypeScript happy
        this.status = speed == 1 ? "on" : "speedPractice";
        this.score = (speed - 1) / 0.05;
        this.speed = speed;
        ball.x = this.width / 2 - ballImg.img.width;
        ball.y = this.marginY;
        ball.dirX = 1;
        ball.dirY = 1;
        this.updateText();
    }
};
game.updateText();
var pressed = {
    left: false,
    right: false
};
document.onkeydown = function (e) {
    if (e.code == "ArrowRight")
        pressed.right = true;
    if (e.code == "ArrowLeft")
        pressed.left = true;
};
document.onkeyup = function (e) {
    if (e.code == "ArrowRight")
        pressed.right = false;
    if (e.code == "ArrowLeft")
        pressed.left = false;
};
var backgroundImg = {
    "img": document.getElementById("background"),
    draw: function () {
        ctx.drawImage(this.img, 0, 0);
    }
};
var ballImg = {
    "img": document.getElementById("ball"),
    draw: function () {
        ctx.drawImage(this.img, ball.x, ball.y);
    }
};
var ball = {
    "x": game.width / 2 - ballImg.img.width,
    "y": game.marginY,
    "dirX": 1,
    "dirY": 1,
    collision: function () {
        var max = game.width - ballImg.img.width;
        if (this.x > max) {
            this.x = max;
            this.dirX = -1;
        }
        if (this.x < 0) {
            this.x = 0;
            this.dirX = 1;
        }
        if (this.y < 0) {
            this.y = 0;
            this.dirY = 1;
        }
        // Touches paddle
        if (this.y > paddle.y - ballImg.img.height &&
            this.x > paddle.x - ballImg.img.width &&
            this.x < paddle.x + paddleImg.img.width) {
            this.dirY = -1;
            this.y = paddle.y - ballImg.img.height;
            game.increment();
        }
        if (this.y > game.height - ballImg.img.height) {
            game.status = "off";
            return;
        }
    },
    move: function () {
        this.x += this.dirX * game.speed;
        this.y += this.dirY * game.speed;
        this.collision();
    }
};
var paddleImg = {
    "img": document.getElementById("paddle"),
    draw: function () {
        ctx.drawImage(this.img, paddle.x, paddle.y);
    }
};
var paddle = {
    "x": game.width / 2 - paddleImg.img.width / 2,
    "y": game.height - paddleImg.img.height - game.marginY,
    constraints: function () {
        var max = game.width - paddleImg.img.width;
        if (this.x > max)
            this.x = max;
        if (this.x < 0)
            this.x = 0;
    },
    move: function () {
        if (pressed.right)
            this.x += 10;
        if (pressed.left)
            this.x -= 10;
        this.constraints();
    }
};
document.getElementById("newRound").onclick = function () {
    game.newRound(1);
};
document.getElementById("speedSubmit").onclick = function () {
    var speedInput = document.getElementById("speedInput");
    var speed = parseInt(speedInput.value);
    if (isNaN(speed))
        return;
    game.newRound(speed);
};
setInterval(function () {
    if (game.status == "off")
        return;
    backgroundImg.draw();
    paddle.move();
    paddleImg.draw();
    ball.move();
    ballImg.draw();
}, 10);
