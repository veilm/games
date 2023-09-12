"use strict";
var output = document.getElementById("math_output");
var input = document.getElementById("math_input");
document.getElementById("render").onclick = function () {
    // Delete existing elements
    while (output.children.length != 0) {
        output.children[0].remove();
    }
    // Create an element for each line of math input
    input.value.split("\n").forEach(function (line) {
        var p = document.createElement("p");
        p.innerHTML = "`" + line + "`";
        output.appendChild(p);
    });
    // Tell MathJax to re-render
    MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'math-display']);
};
