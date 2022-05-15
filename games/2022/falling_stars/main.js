var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var tick = new Date().getTime();
var squareLength = 50;
var RNG = function (min, max) {
    return Math.round(Math.random() * (max - min)) + min;
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
var Drawing = /** @class */ (function () {
    function Drawing(id, x, y) {
        this.x = x;
        this.y = y;
        this.img = document.getElementById(id);
    }
    Drawing.prototype.draw = function () {
        ctx.drawImage(this.img, this.x, this.y);
    };
    return Drawing;
}());
var Falling = /** @class */ (function (_super) {
    __extends(Falling, _super);
    function Falling(id, cy, ccy, cx) {
        var _this = this;
        var x = RNG(0, background.img.width - squareLength);
        _this = _super.call(this, id, x, -1 * squareLength) || this;
        _this.cy = cy;
        _this.ccy = ccy;
        _this.cx = cx * (x > player.x ? -1 : 1);
        return _this;
    }
    Falling.prototype.move = function () {
        this.y += this.cy;
        this.cy += this.ccy;
        this.x += this.cx;
    };
    return Falling;
}(Drawing));
var Star = /** @class */ (function (_super) {
    __extends(Star, _super);
    function Star() {
        return _super.call(this, "star", 1, RNG(1, 5) / 100, 0) || this;
    }
    return Star;
}(Falling));
var Enemy = /** @class */ (function (_super) {
    __extends(Enemy, _super);
    function Enemy() {
        return _super.call(this, "enemy", RNG(50, 500) / 100, RNG(0, 3) / 100, RNG(0, 75) / 100) || this;
    }
    return Enemy;
}(Falling));
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player() {
        return _super.call(this, "player", background.img.width / 2 - squareLength / 2, background.img.height - squareLength * 2) || this;
    }
    Player.prototype.overlaps = function (entity) {
        return (this.x > entity.x - squareLength &&
            this.x < entity.x + squareLength &&
            this.y > entity.y - squareLength &&
            this.y < entity.y + squareLength);
    };
    Player.prototype.move = function () {
        var speed = pressed.shift ? 3 : 6;
        if (pressed.left)
            this.x -= speed;
        if (pressed.right)
            this.x += speed;
        if (pressed.up)
            this.y -= speed;
        if (pressed.down)
            this.y += speed;
    };
    // Stop player from moving past walls
    Player.prototype.walls = function () {
        var xMax = background.img.width - squareLength;
        var yMax = background.img.height - squareLength;
        if (this.x > xMax)
            this.x = xMax;
        if (this.x < 0)
            this.x = 0;
        if (this.y > yMax)
            this.y = yMax;
        if (this.y < 0)
            this.y = 0;
    };
    Player.prototype.collision = function () {
        if (this.overlaps(star)) {
            star = new Star();
            values.score += 200;
            values.lives++;
        }
        for (var i = 0; i < enemies.length; i++) {
            if (this.overlaps(enemies[i])) {
                enemies.splice(i, 1);
                values.lives--;
                if (values.lives < 1)
                    values.status = "off";
            }
        }
    };
    return Player;
}(Drawing));
var background = new Drawing("background", 0, 0);
var player = new Player();
var star = new Star();
var enemies = [];
var drawText = function (x, text) {
    ctx.fillText(text, x, background.img.height - 20);
};
ctx.font = "20px monospace";
ctx.fillStyle = "white";
var values = {
    lives: 5,
    score: 1,
    enemySpawn: 750,
    status: "on"
};
var Game = /** @class */ (function () {
    function Game() {
    }
    Game.prototype.draw = function () {
        player.move();
        player.walls();
        star.move();
        if (star.y > background.img.height)
            star = new Star();
        // Move enemies but delete them if they leave the screen If we don't
        // delete them, trying to render / move them will continue to take
        // resources.
        for (var i = 0; i < enemies.length; i++) {
            enemies[i].move();
            if (enemies[i].y > background.img.height)
                enemies.splice(i, 1);
        }
        player.collision();
        // Periodically spawn a new enemy
        var cur = new Date().getTime();
        if (cur - tick > values.enemySpawn) {
            enemies.push(new Enemy());
            tick = cur;
            values.enemySpawn -= 1;
            if (values.enemySpawn < 0)
                values.enemySpawn = 0;
        }
        background.draw();
        player.draw();
        star.draw();
        for (var _i = 0, enemies_1 = enemies; _i < enemies_1.length; _i++) {
            var enemy = enemies_1[_i];
            enemy.draw();
        }
        values.score++;
        drawText(50, "Score ".concat(values.score, " | Lives ").concat(values.lives, " | Spawn Interval ").concat(values.enemySpawn));
        if (values.status == "on")
            window.requestAnimationFrame(game.draw);
    };
    return Game;
}());
var game = new Game();
window.requestAnimationFrame(game.draw);
