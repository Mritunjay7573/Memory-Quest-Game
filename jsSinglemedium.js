const main = document.getElementById('main');
const cards = Array.from(document.querySelectorAll('.card'));
const restartBtn = document.getElementById('restart');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');

let clickSound = new Audio('click.mp3');
let firstCard = null;
let lock = false;
let score = 0;
let timer = null;
let time = 0;

function shuffleCards() {
    const nodes = cards.slice();
    for (let i = nodes.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nodes[i], nodes[j]] = [nodes[j], nodes[i]];
    }
    nodes.forEach(n => main.appendChild(n));
}

function startTimerOnce() {
    if (timer) return;
    timer = setInterval(() => {
        time++;
        timerDisplay.textContent = time < 10 ? '0' + time : time;
    }, 1000);
}

function onCardClick(e) {
    const card = e.currentTarget;
    if (lock || card === firstCard || card.dataset.matched === 'true') return;

    startTimerOnce();

    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});

    card.classList.add('flipped');

    if (!firstCard) {
        firstCard = card;
        return;
    }

    const secondCard = card;
    if (firstCard.dataset.set === secondCard.dataset.set) {
        firstCard.dataset.matched = 'true';
        secondCard.dataset.matched = 'true';
        firstCard.style.pointerEvents = 'none';
        secondCard.style.pointerEvents = 'none';
        score++;
        scoreDisplay.textContent = score;
        firstCard = null;

        const allMatched = cards.every(c => c.dataset.matched === 'true');
        if (allMatched) {
            clearInterval(timer);
            timer = null;
            setTimeout(() => {
                alert("Congratulations!");
            }, 200);
        }

    } else {
        lock = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            firstCard = null;
            lock = false;
        }, 800);
    }
}

function restartGame() {
    clearInterval(timer);
    timer = null;
    time = 0;
    timerDisplay.textContent = '00';

    score = 0;
    scoreDisplay.textContent = '0';

    cards.forEach(c => {
        c.classList.remove('flipped');
        c.dataset.matched = 'false';
        c.style.pointerEvents = 'auto';
    });

    firstCard = null;
    lock = false;

    setTimeout(shuffleCards, 150);
}

cards.forEach(card => {
    card.removeEventListener('click', onCardClick);
    card.addEventListener('click', onCardClick);
});

restartBtn.addEventListener('click', restartGame);

shuffleCards();
timerDisplay.textContent = '00';
scoreDisplay.textContent = '0';
