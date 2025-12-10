const main = document.getElementById("main");
const cards = Array.from(document.querySelectorAll(".card"));
const restartBtn = document.getElementById("restart");

const p1Display = document.getElementById("p1");
const p2Display = document.getElementById("p2");
const turnDisplay = document.getElementById("turn");

let clickSound = new Audio("click.mp3");

let firstCard = null;
let lock = false;

let playerTurn = 1;
let p1score = 0;
let p2score = 0;

function shuffleCards() {
    const nodes = cards.slice();
    for (let i = nodes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nodes[i], nodes[j]] = [nodes[j], nodes[i]];
    }
    nodes.forEach(n => main.appendChild(n));
}

function switchTurn() {
    playerTurn = playerTurn === 1 ? 2 : 1;
    turnDisplay.textContent = playerTurn === 1 ? "Player 1" : "Player 2";
}

function onCardClick(e) {
    const card = e.currentTarget;
    if (lock || card === firstCard || card.dataset.matched === "true") return;

    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});

    card.classList.add("flipped");

    if (!firstCard) {
        firstCard = card;
        return;
    }

    const secondCard = card;

    if (firstCard.dataset.set === secondCard.dataset.set) {

        firstCard.dataset.matched = "true";
        secondCard.dataset.matched = "true";

        firstCard.style.pointerEvents = "none";
        secondCard.style.pointerEvents = "none";

        if (playerTurn === 1) {
            p1score++;
            p1Display.textContent = p1score;
        } else {
            p2score++;
            p2Display.textContent = p2score;
        }

        firstCard = null;

        const allMatched = cards.every(c => c.dataset.matched === "true");
        if (allMatched) {
            setTimeout(() => {
                if (p1score > p2score) alert("🎉 Player 1 Wins!");
                else if (p2score > p1score) alert("🎉 Player 2 Wins!");
                else alert("🤝 It's a Tie!");
            }, 200);
        }

    } else {
        lock = true;
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            firstCard = null;
            lock = false;

            switchTurn();
        }, 800);
    }
}

function restartGame() {
    cards.forEach(c => {
        c.classList.remove("flipped");
        c.dataset.matched = "false";
        c.style.pointerEvents = "auto";
    });

    p1score = 0;
    p2score = 0;
    p1Display.textContent = "0";
    p2Display.textContent = "0";

    playerTurn = 1;
    turnDisplay.textContent = "Player 1";

    firstCard = null;
    lock = false;

    setTimeout(shuffleCards, 150);
}

cards.forEach(card => {
    card.removeEventListener("click", onCardClick);
    card.addEventListener("click", onCardClick);
});

restartBtn.addEventListener("click", restartGame);

shuffleCards();
