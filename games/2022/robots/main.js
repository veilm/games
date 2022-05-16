var scoreElement = document.getElementById("score");
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var RNG = function (min, max) {
    return Math.round(Math.random() * (max - min)) + min;
};
var game = {
    score: 0
};
var Robot = /** @class */ (function () {
    function Robot(colour, y, dir) {
        this.costume = 0;
        this.switchThreshold = RNG(350, 1000);
        this.lastSwitch = new Date().getTime();
        this.dir = dir;
        this.changeX = dir == "right" ? 1 : -1;
        this.y = y;
        this.images = {
            left: [
                document.getElementById("robot_".concat(colour, "_l1")),
                document.getElementById("robot_".concat(colour, "_l2"))
            ],
            right: [
                document.getElementById("robot_".concat(colour, "_r1")),
                document.getElementById("robot_".concat(colour, "_r2"))
            ]
        };
        this.maxX = canvas.width - this.images[dir][0].width;
        // Start on the left/right side based on direction
        this.x = dir == "right" ? 0 : this.maxX;
    }
    Robot.prototype.move = function () {
        this.x += this.changeX;
        // Flip direction when hitting the game border
        if (this.x > this.maxX) {
            this.x = this.maxX;
            this.dir = "left";
            this.changeX = -1 * Math.round(RNG(1000, 1000 + game.score) / 1000);
        }
        else if (this.x < 0) {
            this.x = 0;
            this.dir = "right";
            this.changeX = Math.round(RNG(1000, 1000 + game.score) / 1000);
        }
    };
    Robot.prototype.draw = function () {
        // Switch robot animation frame every (switchThreshold) ms
        if (new Date().getTime() - this.lastSwitch >= this.switchThreshold) {
            this.costume = 1 - this.costume;
            this.lastSwitch = new Date().getTime();
        }
        var img = this.images[this.dir][this.costume];
        ctx.drawImage(img, this.x, this.y);
    };
    return Robot;
}());
var robots = [];
var colours = ["red", "green", "blue", "yellow"];
for (var i = 0; i < colours.length; i++) {
    // The green one is shorter, so let's center it
    var y = i == 1 ? 165 : i * 150;
    // Alternate direction
    var dir = i % 2 == 0 ? "right" : "left";
    robots.push(new Robot(colours[i], y, dir));
}
var background = {
    img: document.getElementById("background"),
    draw: function () {
        ctx.drawImage(this.img, 0, 0);
    }
};
var pressed = {
    left: false,
    right: false,
    down: false,
    up: false,
    shift: false
};
document.onkeydown = function (e) {
    if (e.code == "ArrowRight")
        pressed.right = true;
    if (e.code == "ArrowLeft")
        pressed.left = true;
    if (e.code == "ArrowUp")
        pressed.up = true;
    if (e.code == "ArrowDown")
        pressed.down = true;
    if (e.code == "ShiftLeft")
        pressed.shift = true;
};
document.onkeyup = function (e) {
    if (e.code == "ArrowRight")
        pressed.right = false;
    if (e.code == "ArrowLeft")
        pressed.left = false;
    if (e.code == "ArrowUp")
        pressed.up = false;
    if (e.code == "ArrowDown")
        pressed.down = false;
    if (e.code == "ShiftLeft")
        pressed.shift = false;
};
var player = {
    length: 50,
    border: 5,
    x: canvas.width / 2 - length / 2,
    y: canvas.height / 2 - length / 2,
    // Check if the player overlaps a robot (fail)
    overlap: function (robot) {
        // "left" is arbitrary, both sizes are the same
        var img = robot.images.left[robot.costume];
        return (robot.x > this.x - img.width &&
            robot.x < this.x + this.length &&
            robot.y > this.y - img.height &&
            robot.y < this.y + this.length);
    },
    move: function () {
        if (pressed.right)
            this.x += 5;
        if (pressed.left)
            this.x -= 5;
        if (pressed.down)
            this.y += 5;
        if (pressed.up)
            this.y -= 5;
        // Enclose borders
        var maxX = forcefield.right - this.length;
        var minX = forcefield.left;
        var maxY = canvas.height - this.length;
        if (this.x > maxX)
            this.x = maxX;
        if (this.x < minX)
            this.x = minX;
        if (this.y > maxY)
            this.y = maxY;
        if (this.y < 0)
            this.y = 0;
    },
    draw: function () {
        var length = this.length - this.border;
        ctx.beginPath();
        ctx.rect(this.x, this.y, length, length);
        ctx.fill();
        ctx.stroke();
    }
};
ctx.fillStyle = "#f9f9f9";
ctx.strokeStyle = "#395EA7";
ctx.lineWidth = player.border;
// The shrinking walls
var forcefield = {
    left: 0,
    right: canvas.width,
    leftMax: canvas.width / 2 - 100,
    rightMin: canvas.width / 2 + 100,
    draw: function () {
        ctx.rect(0, 0, this.left, canvas.height);
        ctx.rect(this.right, 0, canvas.width - this.right, canvas.height);
        ctx.fill();
    }
};
function step() {
    background.draw();
    forcefield.draw();
    player.move();
    player.draw();
    for (var _i = 0, robots_1 = robots; _i < robots_1.length; _i++) {
        var robot = robots_1[_i];
        robot.move();
        robot.draw();
    }
    // Separate loop to esnure all robots are drawn before terminating
    for (var _a = 0, robots_2 = robots; _a < robots_2.length; _a++) {
        var robot = robots_2[_a];
        // The function ends and has no chance to cal requestAnimationFrame() again
        if (player.overlap(robot))
            return;
    }
    // Shrink field of play
    if (forcefield.left < forcefield.leftMax)
        forcefield.left += 0.1;
    if (forcefield.right > forcefield.rightMin)
        forcefield.right -= 0.1;
    game.score++;
    scoreElement.innerHTML = game.score.toString();
    window.requestAnimationFrame(step);
}
window.requestAnimationFrame(step);
