var gameMode;
var backgroundRGB = [249, 249, 249];
var round = 1;
var playerWins = 0;
var compWins = 0;
var loseStreak = 0;
var playerOption;
var compOption;
var initDate = Date.now();
var play = document.getElementById("play");
var results = document.getElementById("results");
var roundText = document.getElementById("round");
var resultText = document.getElementById("result");
var streakWholeText = document.getElementById("streakText");
var streakCountText = document.getElementById("streak");
var playerWinRate = document.getElementById("playerWinRate");
var compWinRate = document.getElementById("compWinRate");
var playerImg = document.getElementById("playerOption");
var compImg = document.getElementById("compOption");
// logic[x] is y if x wins against y
var logic = {
    rock: "scissors",
    paper: "rock",
    scissors: "paper"
};
var shorts = {
    r: "rock",
    p: "paper",
    s: "scissors",
};
var hex = {
    tie: "#4a4a4a",
    win: "#2c8898",
    lose: "#982c2c"
};
var RGB = {
    tie: [74, 74, 74],
    win: [44, 136, 152],
    lose: [152, 44, 44]
};
// Psychology PhD Game history
var pHistory = [];
var options = ["r", "p", "s"];
var pHead = pNode();
document.getElementById("random").onclick = function () { return setGameMode("random"); };
document.getElementById("reddit").onclick = function () { return setGameMode("reddit"); };
document.getElementById("psychology").onclick = function () { return setGameMode("psychology"); };
document.getElementById("rock").onclick = function () { return playOption("rock"); };
document.getElementById("paper").onclick = function () { return playOption("paper"); };
document.getElementById("scissors").onclick = function () { return playOption("scissors"); };
document.getElementById("next").onclick = function () {
    results.style.display = "none";
    play.style.display = "block";
};
function RNG(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}
/*
Original Psychology PhD mode idea

- Each pattern and its result is stored
e.g.
R, R --> Tie
P, S --> Win
R, S --> Lose
Would store
1.
    (R = tie)
2.
    (S = win)
    (S after (R,R) = win)
3.
    (S = Lose)
    (S after (P,S) = lose)
    (S after (R,R),(P,S) = lose)
--
Then, in the future, if the game state ever leads to (P,S), it would be less
likely to play S on the next round, because this pattern has lost in the past
--
Also: It wouldn't just look at the last round, it would look at the entire game
history for patterns
So if the round was (P,S), it might not want to do S this round
BUT
There might be many wins for (R,R)(P,S) and many losses for (S,P)(P,S)
Here it would be looking at the last two rounds instead of just the last one
*/
// Stores performance of option for given pattern path
function pOption() {
    return {
        games: 0,
        wins: 0
    };
}
// Stores branching game paths and success of different options at current path
// The branching paths are assigned later, not initially
function pNode() {
    var node = {};
    // Stores the performance of each option on this path
    options.forEach(function (option) {
        node[option] = pOption();
    });
    // The actual paths branching from this node are added later
    // The notation is node[xy] where x is the player option and y is the comp
    // option
    return node;
}
// Result: (0, 0.45, 1) for (L, T, W)
// 0.45 is used for ties so that it's not used over the default of 0.5,
// encouraging the model to learn more and not be satisfied with ties
// Remember, round[0] is player and round[1] is comp
function getResults(round) {
    var a = shorts[round[0]];
    var b = shorts[round[1]];
    // A tie counts as the winner, since there's no loser
    if (a == b)
        return 0.45;
    else if (logic[a] == b)
        return 0;
    else
        return 1;
}
function pAddSinglePath(path) {
    var node = pHead;
    // We have to go one less than the whole path
    // Because we're recording the performance after a path, not with a path
    // Idk this whole concept is so convoluted that I don't think I can make it
    // possible to understand no matter how well I explain it
    var length = path.length - 1;
    for (var i = 0; i < length; i++) {
        var game = path[i];
        // Connect a node to the path if it doesn't exist
        if (node[game] == undefined)
            node[game] = pNode();
        // Traverse to next node
        node = node[game];
    }
    // Add stats to this path
    var tail = path[length];
    var option = tail[1];
    node[option].wins += getResults(tail);
    node[option].games++;
}
// Works for path = [], which returns the base (head) performance
function pGetPerformance(path) {
    var node = pHead;
    for (var i = 0; i < path.length; i++) {
        var game = path[i];
        // We've never had this path before
        // e.g. ["pr", "sr", "rr"] - we don't have any performance statistics
        // for post-rr, so we can't make any prediction based on it
        // Instead, it would just look at global rps stats
        if (node[game] == undefined)
            return null;
        // Traverse to next node
        node = node[game];
    }
    var rt = {};
    // Use Laplace's rule of succession
    // Add 1 favourable and 1 unfavourable outcome
    // aka matching + 1, total + 2
    options.forEach(function (opt) {
        rt[opt] = (node[opt].wins + 1) / (node[opt].games + 2);
    });
    return rt;
}
/*
Add all subpaths of path

e.g. ["rr", "ps", "ss"]
would add
s after ["rr", "ps"] = tie
s after ["ps"] = tie
s = tie
*/
function pAddAllPaths(path) {
    for (var i = 0; i < path.length; i++) {
        pAddSinglePath(path.slice(i));
    }
}
function updateRounds() {
    round++;
    roundText.innerHTML = round.toString();
}
function setGameMode(mode) {
    gameMode = mode;
    document.getElementById("title").style.display = "none";
    document.getElementById("game").style.display = "block";
}
// The performances of each option relevant to the current history pattern
function pGetRelevantPerformances() {
    var path = [];
    var perfs = [];
    perfs.push(pGetPerformance(path));
    /*
    Doing it backwards lets us cut off the check as soon as a subpath is not
    found. For example, in
    ["sr", "rr", pr"]
    we know we don't have to check rr-pr or sr-rr-pr because pr is not found
    (pr is not found because it was just played - we don't know what happens
    after it. See pAddSinglePath comment)
    */
    for (var i = pHistory.length - 1; i >= 0; i--) {
        path.unshift(pHistory[i]);
        var perf = pGetPerformance(path);
        if (perf == null)
            break;
        perfs.push(perf);
    }
    return perfs;
}
function pGetAverage(perfs) {
    var avg = {
        r: 0,
        p: 0,
        s: 0
    };
    perfs.forEach(function (perf) {
        options.forEach(function (opt) {
            avg[opt] += perf[opt];
        });
    });
    var length = perfs.length;
    options.forEach(function (opt) {
        avg[opt] = avg[opt] / length;
    });
    return avg;
}
function pGetCompOption() {
    var perfs = pGetRelevantPerformances();
    var avg = pGetAverage(perfs);
    // Find highest
    var max = "r";
    if (avg.p > avg[max])
        max = "p";
    if (avg.s > avg[max])
        max = "s";
    return shorts[max];
}
function getRandom() {
    var option = RNG(0, 100) % 3;
    return ["rock", "paper", "scissors"][option];
}
function getReddit() {
    // playerOption and compOption are of the previous round right now
    // If we tied or it's the first round, choose randomly
    if (playerOption == null || playerOption == compOption)
        return getRandom();
    // If we won last round, play what we would have lost against
    // (We're expecting the player to copy us)
    if (logic[compOption] == playerOption)
        return logic[playerOption];
    // If we lost the last round, play what would have won against the player
    // (We're expecting the player to play the same thing again)
    return logic[compOption];
}
function getCompOption() {
    if (gameMode == "random")
        return getRandom();
    else if (gameMode == "reddit")
        return getReddit();
    else
        return pGetCompOption();
}
function updateLoseStreak(result) {
    if (result == "lose")
        loseStreak++;
    else
        loseStreak = 0;
    if (loseStreak >= 2) {
        streakCountText.innerHTML = loseStreak.toString();
        streakWholeText.style.display = "block";
    }
    else
        streakWholeText.style.display = "none";
}
function updateWinRate(result) {
    // Don't count ties in the win rate
    if (result == "tie")
        return;
    if (result == "win")
        playerWins++;
    else
        compWins++;
    var rate;
    rate = Math.round(playerWins / round * 100);
    playerWinRate.innerHTML = rate.toString();
    rate = Math.round(compWins / round * 100);
    compWinRate.innerHTML = rate.toString();
    updateRounds();
}
function displayResults() {
    playerImg.src = "".concat(playerOption, ".png");
    compImg.src = "".concat(compOption, ".png");
    var result;
    if (playerOption == compOption)
        result = "tie";
    else if (logic[playerOption] == compOption)
        result = "win";
    else
        result = "lose";
    updateLoseStreak(result);
    updateWinRate(result);
    resultText.innerHTML = "Result: ".concat(result);
    document.body.style.color = hex[result];
    backgroundRGB = RGB[result];
    initDate = Date.now();
}
function pUpdateModel() {
    if (gameMode != "psychology")
        return;
    pHistory.push(playerOption[0] + compOption[0]);
    pAddAllPaths(pHistory);
}
function playOption(option) {
    compOption = getCompOption();
    playerOption = option;
    pUpdateModel();
    displayResults();
    play.style.display = "none";
    results.style.display = "grid";
}
function updateBackground() {
    var diff = Date.now() - initDate;
    var duration = 500;
    if (diff < duration) {
        var progress = diff / duration;
        // [249, 249, 249] is the default
        var updated = [0, 0, 0];
        for (var i = 0; i < 3; i++) {
            var c = backgroundRGB[i];
            updated[i] = c + (249 - c) * progress;
        }
        var r = updated[0];
        var g = updated[1];
        var b = updated[2];
        document.body.style.backgroundColor = "rgb(".concat(r, ", ").concat(g, ", ").concat(b, ")");
    }
    window.requestAnimationFrame(updateBackground);
}
window.requestAnimationFrame(updateBackground);
