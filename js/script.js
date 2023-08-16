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
        "hard": 3};
    let defaultLevel;
    let defaultLevelSeconds;
    input.onpaste = () => false;
    document.querySelectorAll('input[type="radio"]').forEach((e) => {
        e.addEventListener("click",(radio) => {
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
        startButton.addEventListener("click", function(){
            this.remove();
            generateWords();
            input.style.display = "block";
            control.style.display = "flex";
            document.querySelector(".game .container .levels").style.display = "none";
            input.focus();
        });
        function generateWords() {
            startPlay();
            let random = words[Math.floor(Math.random() * words.length)];
            let wordIndex = words.indexOf(random);
            words.splice(wordIndex,1);
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
                if(timeLeftSpan.innerHTML === '0'){
                    clearInterval(start);
                    if(theWord.innerHTML.toLocaleLowerCase() === input.value.toLocaleLowerCase()){
                        input.value = "";
                        scoreGot.innerHTML++;
                        if(words.length > 0){
                            generateWords();
                        }else{
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
                        };
                    }else{
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
                    };
                };
            }, 1000);
        };
    };
};
jsonData();