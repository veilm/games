"use strict";
var input = document.getElementById("input");
var output = document.getElementById("output");
var inputStatus = document.getElementById("status");
var transIDs = ["x1", "y1", "x2", "y2"];
function addStatusMessage(message) {
    var li = document.createElement("li");
    li.innerHTML = message;
    inputStatus.appendChild(li);
}
function parseCoords(lines) {
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
}
function parseTransformation() {
    var transformation = {};
    transIDs.forEach(function (id) {
        var el = document.getElementById(id);
        transformation[id] = Number(el.value);
        if (el.value == "")
            addStatusMessage("No ".concat(id, " provided"));
        else if (isNaN(transformation[id]))
            addStatusMessage("Invalid ".concat(id, " \"").concat(el.value, "\""));
    });
    return transformation;
}
function transform(inputCoords, transformation) {
    /*
    (1, 0) --> (x1, y1)
    (0, 1) --> (x2, y2)

    (x, y) = x(1, 0) + y(0, 1)
    x(1, 0) + y(0, 1) --> x(x1, y1) + y(x2, y2)
    = (x(x1) + y(x2)), (x(y1) + y(y2))
    */
    var coords = inputCoords;
    for (var i = 0; i < coords.length; i++) {
        if (!coords[i].valid)
            continue;
        coords[i].x = coords[i].x * transformation.x1 + coords[i].y * transformation.x2;
        coords[i].y = coords[i].x * transformation.y1 + coords[i].y * transformation.y2;
    }
    return coords;
}
function showOutput(coords) {
    var outText = [];
    coords.forEach(function (coord) {
        if (coord.valid)
            outText.push("(".concat(coord.x, ", ").concat(coord.y, ")"));
        else
            outText.push("-");
    });
    output.value = outText.join("\n");
}
function update() {
    Array.from(inputStatus.children).forEach(function (child) { child.remove(); });
    var coords = parseCoords(input.value);
    var transformation = parseTransformation();
    if (inputStatus.children.length > 0)
        return;
    addStatusMessage("All input valid");
    showOutput(transform(coords, transformation));
}
input.addEventListener("input", update);
transIDs.forEach(function (id) {
    document.getElementById(id).addEventListener("input", update);
});
update();
