var input = document.getElementById("input");
var output = document.getElementById("output");
var inputStatus = document.getElementById("status");
var addStatusMessage = function (message) {
    var li = document.createElement("li");
    li.innerHTML = message;
    inputStatus.appendChild(li);
};
var parseCoords = function (lines) {
    var coords = [];
    lines.split("\n").forEach(function (coordsLine, i) {
        var invalid = function () {
            addStatusMessage("Invalid entry \"".concat(coordsLine, "\" on line ").concat(i + 1));
            coords.push({ x: 0, y: 0, valid: false });
        };
        var validLength = coordsLine.length >= "(0, 0)".length;
        if (!validLength || coordsLine[0] != "(" || coordsLine.at(-1) != ")") {
            invalid();
            return;
        }
        var split = coordsLine.split(", ");
        if (split.length != 2) {
            invalid();
            return;
        }
        var x = Number(split[0].slice(1));
        var y = Number(split[1].slice(0, -1));
        if (isNaN(x) || isNaN(y)) {
            invalid();
            return;
        }
        coords.push({ x: x, y: y, valid: true });
    });
    return coords;
};
var update = function () {
    Array.from(inputStatus.children).forEach(function (child) { child.remove(); });
    var coords = parseCoords(input.value);
    if (inputStatus.children.length == 0)
        addStatusMessage("All input valid");
};
input.addEventListener("input", update);
update();
