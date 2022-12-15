var getId = function (id) { return document.getElementById(id); };
var RNG = function (min, max) {
    return Math.round(Math.random() * (max - min)) + min;
};
var operations = {
    multiplication: function (a, b) {
        return ["".concat(a, " \u00D7 ").concat(b), a * b];
    },
    addition: function (a, b) {
        return ["".concat(a, " + ").concat(b), a + b];
    }
};
var configs = [
    {
        name: "Multiplication 10-20",
        secs: 45,
        operation: function () {
            var min = 10;
            var max = 20;
            return operations.multiplication(RNG(min, max), RNG(min, max));
        }
    },
    {
        name: "Multiplication 1d by 2d",
        secs: 10,
        operation: function () {
            var a = RNG(2, 9);
            var b = RNG(10, 99);
            var answer = a * b;
            if (RNG(1, 100) % 2 == 0)
                return operations.multiplication(a, b);
            else
                return operations.multiplication(b, a);
        }
    },
    {
        name: "Addition 100-500",
        secs: 20,
        operation: function () {
            var min = 100;
            var max = 500;
            return operations.addition(RNG(min, max), RNG(min, max));
        }
    }
];
var game = {
    config: configs[0],
    lastSave: 0,
    state: "question",
    answer: 5,
    resetTimer: function () {
        this.lastSave = Date.now();
    },
    getQuestion: function () {
        var results = this.config.operation();
        this.answer = results[1];
        return results[0];
    },
    setConfig: function (config) {
        this.config = config;
        question.create();
        this.resetTimer();
    },
    step: function () {
        var elapsed = Date.now() - this.lastSave;
        var secs = this.state == "question" ? this.config.secs : 10;
        var finished = progress.update(elapsed, secs);
        if (finished) {
            if (this.state == "question") {
                this.state = "answer";
                question.setAnswer(this.answer);
            }
            else {
                this.state = "question";
                question.create();
            }
            this.resetTimer();
        }
    },
    init: function () {
        this.resetTimer();
        dropdown.create();
        question.create();
        setInterval(this.step.bind(this), 10);
    }
};
var progress = {
    el: getId("progress"),
    update: function (elapsed, limit) {
        var raw = 100 - (elapsed / 1000 / limit * 100);
        this.el.value = Math.round(raw);
        // Are we finished?
        return raw < 0;
    }
};
var question = {
    el: getId("question"),
    setAnswer: function (answer) {
        this.el.innerHTML += " = ".concat(answer);
    },
    create: function () {
        this.el.innerHTML = game.getQuestion();
    }
};
var dropdown = {
    el: getId("dropdown"),
    change: function () {
        var value = parseInt(this.el.value);
        game.setConfig(configs[value]);
    },
    create: function () {
        var _this = this;
        this.el.onchange = this.change.bind(this);
        configs.forEach(function (config, i) {
            var option = document.createElement("option");
            option.value = i.toString();
            option.innerHTML = config.name;
            _this.el.appendChild(option);
        });
    }
};
game.init();
