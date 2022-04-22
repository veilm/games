function getResponse() {
    return [
        "Outlook: not so good.",
        "Don't count on it.",
        "My sources say no.",
        "Without a doubt.",
        "Reply hazy. Try again.",
        "It is certain.",
        "My reply is 'no'.",
        "As I see it, yes."
    ][Math.floor(Math.random() * 8)];
}
document.getElementById("submit").onclick = function () {
    document.getElementById("output").innerHTML = getResponse();
};
