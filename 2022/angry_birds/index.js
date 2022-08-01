var input = document.getElementById("level");
// We can't access consts with window[x] so we use var
var blues = function (lvl) { return lvl > 17; };
var bomb = function (lvl) { return lvl <= 17; };
var bubbles = function (lvl) { return lvl != 17; };
var chuck = function (lvl) { return lvl > 5 && lvl < 25; };
var hal = function (lvl) { return lvl < 6 || lvl > 20; };
var matilda = function (lvl) { return lvl > 25 && lvl < 50; };
var red = function (lvl) { return lvl != 12 && lvl != 18; };
var stella = function (lvl) { return lvl < 10 || lvl > 30; };
var birds = [
    "blues",
    "bomb",
    "bubbles",
    "chuck",
    "hal",
    "matilda",
    "red",
    "stella"
];
document.getElementById("submit").onclick = function () {
    var lvl = parseInt(input.value);
    if (isNaN(lvl))
        return;
    birds.forEach(function (bird) {
        var display = "none";
        if (window[bird](lvl))
            display = "inline";
        document.getElementById(bird).style.display = display;
    });
};
