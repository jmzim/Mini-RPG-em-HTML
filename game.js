// Mini RPG em HTML/JS - Básico
const story = document.getElementById("story");
const options = document.getElementById("options");
const playerStats = document.getElementById("player-stats");
const enemyStats = document.getElementById("enemy-stats");
const inventoryDiv = document.getElementById("inventory");

// Dados do jogador
let player = {
    nome: "Herói",
    hp: 30,
    maxHp: 30,
    ataque: 6,
    cura: 5,
    inventario: ["Poção de cura"]
};

// Inimigos base
const inimigos = [
    { nome: "Goblin", hp: 15, ataque: 3 },
    { nome: "Lobo Selvagem", hp: 18, ataque: 4 },
    { nome: "Bandido", hp: 23, ataque: 6 }
];
let inimigoAtual = null;

function mostrarStatus() {
    playerStats.innerHTML = `<strong>${player.nome}</strong> - ❤️ Vida: ${player.hp}/${player.maxHp} | Ataque: ${player.ataque}`;
    if (inimigoAtual) {
        enemyStats.innerHTML = `<strong>${inimigoAtual.nome}</strong> - 🧨 Vida: ${inimigoAtual.hp}`;
    } else {
        enemyStats.innerHTML = ``;
    }
    inventoryDiv.innerHTML = `<strong>Inventário:</strong> ${player.inventario.join(", ") || "Vazio"}`;
}

function prologo() {
    story.innerHTML = `
        Você acorda em uma floresta escura.<br>
        Armado apenas com sua coragem e uma poção de cura.<br>
        <em>O que deseja fazer?</em>
    `;
    options.innerHTML = "";
    addBtn("Explorar a floresta", explorar);
    addBtn("Ver inventário", mostrarInventario);
}

function addBtn(texto, action) {
    const btn = document.createElement("button");
    btn.innerText = texto;
    btn.onclick = action;
    options.appendChild(btn);
}

function mostrarInventario() {
    alert("Você possui: " + player.inventario.join(", "));
}

function explorar() {
    options.innerHTML = "";
    const sorteio = Math.random();
    if (sorteio < 0.7) { // 70% chance de combate
        iniciarCombate();
    } else {
        story.innerHTML = "Você encontra uma clareira tranquila e descansa um pouco.<br>Recupera 5 pontos de vida!";
        player.hp = Math.min(player.maxHp, player.hp + 5);
        setTimeout(prologo, 1800);
        mostrarStatus();
    }
}

function iniciarCombate() {
    inimigoAtual = Object.assign({}, inimigos[Math.floor(Math.random()*inimigos.length)]);
    story.innerHTML = `Você encontrou um <strong>${inimigoAtual.nome}</strong>! Prepare-se para lutar.`;
    mostrarStatus();
    mostrarOpcoesCombate();
}

function mostrarOpcoesCombate() {
    options.innerHTML = "";
    addBtn("Atacar", atacar);
    addBtn("Usar Poção", usarPocao);
    addBtn("Fugir", fugirCombate);
}

function atacar() {
    inimigoAtual.hp -= player.ataque;
    if (inimigoAtual.hp <= 0) {
        story.innerHTML = `Você derrotou o ${inimigoAtual.nome}!`;
        inimigoAtual = null;
        player.hp = Math.min(player.maxHp, player.hp + 3); // recupera um pouco de vida
        player.inventario.push("Poção de cura");
        mostrarStatus();
        options.innerHTML = "";
        addBtn("Explorar mais", explorar);
        addBtn("Voltar ao início", prologo);
        return;
    }
    inimigoAtaca();
    mostrarStatus();
    mostrarOpcoesCombate();
}

function inimigoAtaca() {
    player.hp -= inimigoAtual.ataque;
    if (player.hp <= 0) {
        story.innerHTML = "Você foi derrotado! Fim de jogo.";
        options.innerHTML = "";
        addBtn("Reiniciar", reiniciarJogo);
    }
}

function usarPocao() {
    const idx = player.inventario.indexOf("Poção de cura");
    if (idx > -1) {
        player.hp = Math.min(player.maxHp, player.hp + player.cura);
        player.inventario.splice(idx, 1);
        story.innerHTML = "Você usou uma Poção de cura!";
    } else {
        story.innerHTML = "Você não tem poção!";
    }
    mostrarStatus();
    mostrarOpcoesCombate();
}

function fugirCombate() {
    const chance = Math.random();
    if (chance < 0.5) {
        story.innerHTML = "Você escapou com sucesso!";
        inimigoAtual = null;
        options.innerHTML = "";
        addBtn("Explorar de novo", explorar);
        addBtn("Voltar ao início", prologo);
    } else {
        story.innerHTML = "A fuga falhou! O inimigo ataca você.";
        inimigoAtaca();
        mostrarStatus();
        mostrarOpcoesCombate();
    }
}

function reiniciarJogo() {
    player.hp = player.maxHp;
    player.inventario = ["Poção de cura"];
    inimigoAtual = null;
    prologo();
    mostrarStatus();
}

// Inicializa o jogo
prologo();
mostrarStatus();
