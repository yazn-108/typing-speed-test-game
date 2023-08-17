"use strict";
async function jsonData() {
    let api = await fetch("json/words.json");
    let words = await api.json();
    let startButton = document.querySelector(".start");
    let levelName = document.querySelector(".message .lvl");
    let seconds = document.querySelector(".message .seconds");
    let theWord = document.querySelector(".the-word");
    let upcomingWords = document.querySelector(".upcoming-words");
    let input = document.querySelector(".input");
    let timeLeftSpan = document.querySelector(".time span");
    let scoreGot = document.querySelector(".score .got");
    let scoreTotal = document.querySelector(".score .total");
    let finishMessage = document.querySelector(".finish");
    let control = document.querySelector(".control");
    const levels = {
        "easy": 7,
        "normal": 5,
        "hard": 3
    };
    let defaultLevel;
    let defaultLevelSeconds;
    input.onpaste = () => false;
    document.querySelectorAll('input[type="radio"]').forEach((e) => {
        e.addEventListener("click", (radio) => {
            defaultLevel = radio.target.dataset.level;
            defaultLevelSeconds = levels[defaultLevel];
            levelName.innerHTML = defaultLevel;
            seconds.innerHTML = defaultLevelSeconds;
            timeLeftSpan.innerHTML = defaultLevelSeconds;
            levelWordsFunction(words[parseInt(radio.target.className)]);
            document.querySelectorAll("label").forEach((e) => {
                e.style.pointerEvents = "none";
                document.querySelector(`label[for="${radio.target.id}"]`).style.backgroundColor = "#009688";
            });
        });
    });
    function levelWordsFunction(words) {
        scoreTotal.innerHTML = words.length;
        startButton.addEventListener("click", function () {
            this.remove();
            generateWords();
            input.style.display = "block";
            control.style.display = "flex";
            document.querySelector(".game .container .levels").style.display = "none";
            input.focus();
            document.querySelector(".results").style.display = "none";
        });
        function generateWords() {
            startPlay();
            let random = words[Math.floor(Math.random() * words.length)];
            let wordIndex = words.indexOf(random);
            words.splice(wordIndex, 1);
            theWord.innerHTML = random;
            upcomingWords.innerHTML = "";
            for (let i = 0; i < words.length; i++) {
                let div = document.createElement("div");
                div.textContent = words[i];
                upcomingWords.appendChild(div);
            };
        };
        function startPlay() {
            timeLeftSpan.innerHTML = defaultLevelSeconds;
            let start = setInterval(() => {
                timeLeftSpan.innerHTML--;
                if (timeLeftSpan.innerHTML === '0') {
                    clearInterval(start);
                    if (theWord.innerHTML.toLocaleLowerCase() === input.value.toLocaleLowerCase()) {
                        input.value = "";
                        scoreGot.innerHTML++;
                        if (words.length > 0) {
                            generateWords();
                        } else {
                            input.value = "";
                            input.style.pointerEvents = "none";
                            finishMessage.style.display = "block";
                            let span = document.createElement("span");
                            span.className = "good";
                            span.textContent = "Congratulations";
                            let button = document.createElement("button");
                            button.textContent = "try again";
                            button.onclick = () => window.location.reload();
                            finishMessage.appendChild(span);
                            span.appendChild(button);
                            upcomingWords.remove();
                            let results = {
                                level: defaultLevel,
                                defaultTime: defaultLevelSeconds,
                                wordsCount: scoreGot.innerHTML,
                                totalWords: scoreTotal.innerHTML};
                            let resultsArray = JSON.parse(sessionStorage.getItem("results")) || [];
                            resultsArray.push(results);
                            sessionStorage.setItem("results", JSON.stringify(resultsArray));
                        };
                    } else {
                        input.value = "";
                        input.style.pointerEvents = "none";
                        finishMessage.style.display = "block";
                        let span = document.createElement("span");
                        span.className = 'bad';
                        span.textContent = "Game Over";
                        let button = document.createElement("button");
                        button.textContent = "try again";
                        button.onclick = () => window.location.reload();
                        finishMessage.appendChild(span);
                        span.appendChild(button);
                        let results = {
                            level: defaultLevel,
                            defaultTime: defaultLevelSeconds,
                            wordsCount: scoreGot.innerHTML,
                            totalWords: scoreTotal.innerHTML};
                        let resultsArray = JSON.parse(sessionStorage.getItem("results")) || [];
                        resultsArray.push(results);
                        sessionStorage.setItem("results", JSON.stringify(resultsArray));
                    };
                };
            }, 1000);
        };
    };
};
jsonData();
window.addEventListener("load", () => {
    let resultsData = JSON.parse(sessionStorage.getItem("results"))
    if (resultsData !== null) {
        document.querySelector(".results").style.display = "flex";
        for (let i = 0; i < resultsData.length; i++) {
            let p = document.createElement("p");
            let levelSpan = document.createElement("span");
            levelSpan.textContent = resultsData[i].level
            p.appendChild(levelSpan);
            let defaultTimeSpan = document.createElement("span");
            defaultTimeSpan.textContent = resultsData[i].defaultTime
            p.appendChild(defaultTimeSpan);
            let wordsCountSpan = document.createElement("span");
            wordsCountSpan.textContent = resultsData[i].wordsCount
            p.appendChild(wordsCountSpan);
            let totalWordsSpan = document.createElement("span");
            totalWordsSpan.textContent = resultsData[i].totalWords
            p.appendChild(totalWordsSpan);
            document.querySelector(".results").appendChild(p);
        };
    };
});
document.querySelector(".results button").onclick = () => {
    sessionStorage.clear();
    document.querySelector(".results p:not(:first-child)").style.display = "none";};