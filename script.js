const totalCasas = 100;
let playerPos = 0;
let score = 0;
let canDraw = false;

const cartas = [
    { q: "Um amigo te emprestou um brinquedo e ele quebrou. O que você faz?", opts: ["Esconde o brinquedo embaixo da cama.", "Conta a verdade para ele e pede desculpas."], correct: 1, prize: 20 },
    { q: "Você está muito cansado do barulho da sala. Como agir?", opts: ["Gritar 'Cala a boca!' para todos.", "Pedir para ir ao banheiro ou usar fone de ouvido."], correct: 1, prize: 20 },
    { q: "Como cumprimentar um colega novo?", opts: ["Dar um tchauzinho ou dizer 'Olá'.", "Ficar encarando ele em silêncio."], correct: 0, prize: 20 }
];

const superDesafios = [
    { q: "🚨 IMPECÍLIO: Alguém mudou o lugar dos seus móveis sem avisar. Como lidar?", opts: ["Chorar e quebrar algo.", "Respirar fundo e perguntar por que mudaram."], correct: 1, prize: 100 },
    { q: "🚨 IMPECÍLIO: Você perdeu um jogo. Qual a atitude correta?", opts: ["Parabenizar quem ganhou.", "Jogar as peças no chão."], correct: 0, prize: 100 }
];

function init() {
    const path = document.getElementById('game-path');
    for (let i = 0; i < totalCasas; i++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        if (i % 8 === 0 && i !== 0) tile.classList.add('obs');

        // Circuito sinuoso (formato de S)
        const x = (Math.floor(i / 10) % 2 === 0) ? (i % 10) * 120 : (9 - (i % 10)) * 120;
        const y = Math.floor(i / 10) * 120;
        
        tile.style.left = `${x}px`;
        tile.style.top = `${y}px`;
        tile.innerText = i === 0 ? "🏁" : (i % 8 === 0 ? "⚠️" : i);
        tile.id = `tile-${i}`;
        path.appendChild(tile);
    }
    updatePos();
}

function rollDice() {
    if (canDraw) return alert("Pegue uma carta primeiro!");
    const roll = Math.floor(Math.random() * 6) + 1;
    document.getElementById('dice-display').innerText = roll;
    
    playerPos = Math.min(totalCasas - 1, playerPos + roll);
    updatePos();

    // Habilita o baralho certo
    canDraw = true;
    document.getElementById('roll-btn').disabled = true;
    const isObs = document.getElementById(`tile-${playerPos}`).classList.contains('obs');
    document.getElementById(isObs ? 'draw-hard' : 'draw-normal').disabled = false;
}

function drawCard(isHard) {
    const deck = isHard ? superDesafios : cartas;
    const item = deck[Math.floor(Math.random() * deck.length)];
    
    document.getElementById('question-text').innerText = item.q;
    const box = document.getElementById('options-box');
    box.innerHTML = '';

    item.opts.forEach((opt, idx) => {
        const b = document.createElement('button');
        b.className = 'opt-btn';
        b.innerText = opt;
        b.onclick = () => {
            if (idx === item.correct) {
                score += item.prize;
                alert("✨ Muito bem! Você ganhou pontos.");
            } else {
                playerPos = Math.max(0, playerPos - 5);
                alert("❌ Atitude incorreta. Volte 5 casas.");
                updatePos();
            }
            closeModal();
        };
        box.appendChild(b);
    });
    document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
    canDraw = false;
    document.getElementById('roll-btn').disabled = false;
    document.getElementById('draw-normal').disabled = true;
    document.getElementById('draw-hard').disabled = true;
    document.getElementById('stars').innerText = score;
}

function updatePos() {
    const t = document.getElementById(`tile-${playerPos}`);
    const p = document.getElementById('player');
    p.style.left = t.style.left;
    p.style.top = (parseInt(t.style.top) - 15) + 'px';
    document.getElementById('current-step').innerText = playerPos;
    t.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

window.onload = init;
