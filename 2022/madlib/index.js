var div = document.getElementById("input");
var start = document.getElementById("start");
var state = "input";
var title;
var template;
function add_p(text) {
    var p = document.createElement("p");
    p.innerHTML = text;
    document.getElementById("output").appendChild(p);
}
fetch("https://madlibz.herokuapp.com/api/random")
    .then(function (response) { return response.json(); })
    .then(function (data) {
    data.blanks.forEach(function (value, idx) {
        var input = document.createElement("input");
        input.type = "text";
        input.placeholder = value;
        div.appendChild(input);
    });
    title = data.title;
    template = data.value;
    template.pop();
});
start.onclick = function () {
    if (state == "input") {
        var children = div.children;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child.value == "") {
                alert("You haven't filled in the boxes yet!");
                return;
            }
        }
        document.getElementById("input").style.display = "none";
        document.getElementById("instructions").style.display = "none";
        start.value = "Try again";
        state = "refresh";
        add_p(title);
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            template[i] += child.value;
        }
        add_p(template.join(""));
    }
    else
        location.reload();
};
