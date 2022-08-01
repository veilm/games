var input = document.getElementById("input");
var output = document.getElementById("output");
function create_option(value) {
    var option = document.createElement("option");
    option.value = value;
    option.innerHTML = value;
    return option;
}
function render_entry(entry, idx) {
    var button = document.createElement("input");
    button.type = "button";
    button.value = entry.title;
    button.className = "entry";
    button.style.backgroundColor = entry.bg;
    button.style.color = entry.fg;
    button.onclick = function () {
        var shown = document.getElementsByClassName("shown")[0];
        if (shown) {
            shown.style.display = "none";
            shown.className = "";
        }
        if (shown != select) {
            select.style.display = "block";
            select.className = "shown";
        }
    };
    var select = document.createElement("select");
    select.appendChild(create_option(entry.title));
    entry.opt.forEach(function (title) {
        select.appendChild(create_option(title));
    });
    select.onchange = function () {
        button.value = select.value;
    };
    output.appendChild(button);
    output.appendChild(select);
}
document.getElementById("render_button").onclick = function () {
    while (output.children.length > 0) {
        output.children[0].remove();
    }
    var entry = {
        title: "",
        bg: "#000000",
        fg: "#ffffff",
        opt: []
    };
    input.value.split("\n").forEach(function (line, idx) {
        if (line == "")
            return;
        if (line.length > 1 && line[0] == "+" && line[1] == " ") {
            var colon = line.indexOf(":");
            if (colon == -1)
                return;
            var setting = line.substring(2, colon);
            var value = line.substring(colon + 1);
            if (setting == "bg" || setting == "fg")
                entry[setting] = value;
            if (setting == "opt")
                entry.opt.push(value);
        }
        else {
            if (entry.title == "") {
                entry.title = line;
                return;
            }
            render_entry(entry, idx);
            entry = {
                title: line,
                bg: "#000000",
                fg: "#ffffff",
                opt: []
            };
        }
    });
    render_entry(entry, -1);
};
