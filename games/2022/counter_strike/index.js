var existing = [0, 1];
var current = 2;
existing.forEach(function (value) {
    document.getElementById("function_" + value).onchange = function () {
        render_button(value);
    };
    document.getElementById("button_" + value).onclick = function () {
        execute_function(value);
    };
});
function execute_function(id) {
    var input = document.getElementById("function_" + id);
    var counter = document.getElementById("counter");
    var x = parseInt(counter.innerHTML);
    input.value.split("\n").forEach(function (line) {
        eval(line);
    });
    counter.innerHTML = x.toString();
}
function render_button(id) {
    var input = document.getElementById("function_" + id);
    var line = input.value.split("\n")[0];
    var title = "function #" + id;
    if (line.substring(0, 3) == "// " && line.length > 3)
        title = line.substring(3);
    var output = document.getElementById("button_" + id);
    output.value = title;
}
document.getElementById("add").onclick = function () {
    // Otherwise, textarea.onchange and button.onclick
    // will use the global "current", which will change
    var saved = current;
    var textarea = document.createElement("textarea");
    textarea.id = "function_" + saved;
    textarea.value = "// function #" + (saved + 1) + "\nx++";
    textarea.onchange = function () { render_button(saved); };
    var button = document.createElement("input");
    button.type = "button";
    button.id = "button_" + saved;
    button.onclick = function () { execute_function(saved); };
    document.getElementById("input").appendChild(textarea);
    document.getElementById("output").appendChild(button);
    render_button(saved);
    current++;
};
