var joke_split = joke_input.split(";");
var button_1 = document.getElementById("button_" + 1);
var button_2 = document.getElementById("button_" + 2);
var button_3 = document.getElementById("button_" + 3);
var part_1 = document.getElementById("part_" + 1);
var part_2 = document.getElementById("part_" + 2);
var part_3 = document.getElementById("part_" + 3);
var joke_1 = document.getElementById("joke_1");
var joke_2 = document.getElementById("joke_2");
button_1.onclick = function () {
    part_1.style.display = "none";
    part_2.style.display = "block";
    joke_1.innerHTML = joke_split[0];
    button_2.value = joke_split[0] + " who?";
};
button_2.onclick = function () {
    part_2.style.display = "none";
    part_3.style.display = "block";
    joke_2.innerHTML = joke_split[1];
};
button_3.onclick = function () {
    location.reload();
};
