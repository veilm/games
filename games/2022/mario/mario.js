var jump_button = document.getElementById("jump_button");
var audio = new Audio("jump.mp3");
jump_button.onclick = function () {
    audio.play();
};
