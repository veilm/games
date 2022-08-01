var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var selected_button = 0;
var game_screen = "main_menu";
var selected_track = 4;
var audio = new Audio();
var track_titles = ["delivery", "murasaki", "beauty", "cinema", "logo"];
var track_texts = [
    "Will this thing really bring me happiness?",
    "(I can go back to being a dog now, right?)",
    "The statue attacked!",
    "There are no graves in this city.",
    ""
];
var animals_en = [
    "Dog",
    "Bird",
    "Cat",
    "Horse"
];
var animals_jp = [
    "犬[いぬ]",
    "鳥[とり]",
    "猫[ねこ]",
    "馬[うま]"
];
var animal;
var time;
var level = 1;
var todo = 10;
function new_animal() {
    animal = Math.floor((Math.random() * 4) + 1) - 1;
}
function draw_rect(x, y, width, height, colour) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fillStyle = colour;
    ctx.fill();
    ctx.closePath();
}
function draw_text(x, y, text, font) {
    if (typeof font == "undefined")
        font = "20px monospace";
    ctx.font = font;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(text, x, y);
}
function uppercase(text) {
    return text[0].toUpperCase() + text.substring(1);
}
function draw_button(idx, x, y, text) {
    var colour = "#2c8898";
    if (idx == selected_button)
        colour = "#37abc0";
    draw_rect(x, y, 150, 40, colour);
    // "20px" is actually 12 px
    var offset = 75 - (text.length * 12 / 2);
    draw_text(x + offset, y + 25, text, "20px monospace");
}
function main_menu() {
    draw_text(105, 150, "Poke The [...]", "48px monospace");
    draw_button(0, 125, 200, "Track");
    draw_button(1, 325, 200, "Animal");
    draw_text(45, 375, "Controls: arrow keys to choose, z to submit");
}
function track_menu() {
    var image = document.getElementById(track_titles[selected_track]);
    var width = image.width;
    ctx.drawImage(image, 300 - (width / 2), 25);
    var text = track_texts[selected_track];
    draw_text(300 - (text.length * 6), 220, text);
    draw_button(0, 125, 250, uppercase(track_titles[0]));
    draw_button(1, 325, 250, uppercase(track_titles[1]));
    draw_button(2, 125, 300, uppercase(track_titles[2]));
    draw_button(3, 325, 300, uppercase(track_titles[3]));
    draw_button(4, 225, 350, "Back");
}
function reset_animal() {
    time = Date.now();
    todo = 9 + level;
    new_animal();
}
function animal_menu() {
    var text = animals_jp[animal];
    draw_text(200, 125, text, "48px monospace");
    var difference = 10 - Math.round((Date.now() - time) / 1000);
    if (difference < 0)
        reset_animal();
    text = "Level ".concat(level, ": ").concat(todo, "/").concat(9 + level, " | ").concat(difference, "s");
    draw_text(300 - (text.length * 6), 175, text);
    draw_button(0, 125, 225, animals_en[0]);
    draw_button(1, 325, 225, animals_en[1]);
    draw_button(2, 125, 275, animals_en[2]);
    draw_button(3, 325, 275, animals_en[3]);
    draw_button(4, 225, 325, "Back");
}
setInterval(function () {
    draw_rect(0, 0, ctx.canvas.width, ctx.canvas.height, "#303030");
    window[game_screen]();
}, 10);
var last_main_selection = 3;
document.onkeydown = function (key) {
    switch (key.keyCode) {
        // left arrow
        case 37:
            if ([1, 3].indexOf(selected_button) != -1)
                selected_button--;
            if (game_screen == "main_menu")
                selected_button = 0;
            break;
        // right arrow
        case 39:
            if ([0, 2].indexOf(selected_button) != -1)
                selected_button++;
            if (game_screen == "main_menu")
                selected_button = 1;
            break;
        // up arrow
        case 38:
            if ([2, 3].indexOf(selected_button) != -1)
                selected_button -= 2;
            if (selected_button == 4)
                selected_button = last_main_selection;
            break;
        // down arrow
        case 40:
            if (game_screen == "main_menu")
                break;
            if ([0, 1].indexOf(selected_button) != -1)
                selected_button += 2;
            else if ([2, 3].indexOf(selected_button) != -1) {
                last_main_selection = selected_button;
                selected_button = 4;
            }
            break;
        // z
        case 90:
            var menus = ["track_menu", "animal_menu"];
            if (game_screen == "main_menu") {
                game_screen = menus[selected_button];
                if (game_screen == "animal_menu")
                    reset_animal();
            }
            else if (selected_button == 4) {
                selected_button = menus.indexOf(game_screen);
                game_screen = "main_menu";
            }
            else if (game_screen == "track_menu") {
                selected_track = selected_button;
                audio.pause();
                var filename = "media/".concat(track_titles[selected_track], ".webm");
                audio = new Audio(filename);
                audio.loop = true;
                audio.play();
            }
            else if (game_screen == "animal_menu") {
                if (selected_button == animal) {
                    todo--;
                    if (todo == 0) {
                        level++;
                        reset_animal();
                    }
                    new_animal();
                }
                else {
                    reset_animal();
                }
            }
            break;
    }
};
