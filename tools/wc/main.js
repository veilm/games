var auto = document.getElementById("auto");
var convert = document.getElementById("convert");
var text = document.getElementById("input");
var words_span = document.getElementById("words");
var characters_span = document.getElementById("characters");
// Update the word and character count
function count() {
    var words = 0;
    var pchar = " ";
    var current;
    var previous;
    for (var _i = 0, _a = text.value; _i < _a.length; _i++) {
        var char = _a[_i];
        current = (char == "\n" || char == " ");
        previous = (pchar == "\n" || pchar == " ");
        if (!current && previous)
            words++;
        pchar = char;
    }
    words_span.innerHTML = words.toString();
    characters_span.innerHTML = text.value.length.toString();
}
auto.onchange = function () {
    convert.disabled = auto.checked;
    if (auto.checked)
        count();
};
convert.onclick = count;
text.oninput = function () {
    if (auto.checked)
        count();
};
