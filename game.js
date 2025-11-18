// Mini RPG Evoluído em HTML/JS
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
    inventario: ["Poção de cura"],
    xp: 0,
    nivel: 1,
    xpProx: 15
};

// Inimigos base e raros
const inimigos = [
    { nome: "Goblin", hp: 15, ataque: 3, xp: 8 },
    { nome: "Lobo Selvagem", hp: 18, ataque: 4, xp: 10 },
    { nome: "Bandido", hp: 23, ataque: 6, xp: 15 },
    { nome: "Aranha Gigante", hp: 25, ataque: 7, xp: 16 },
    { nome: "Slime Venenoso", hp: 28, ataque: 5, xp: 18, especial: "veneno" }, // inimigo raro
    { nome: "Golem de Pedra", hp: 36, ataque: 9, xp: 22, especial: "defesa" }, // inimigo raro
    { nome: "Dragão Jovem", hp: 50, ataque: 15, xp: 50, especial: "fogo" }     // chefe!
];
let inimigoAtual = null;

function mostrarStatus() {
    playerStats.innerHTML = `<strong>${player.nome}</strong> - 
        <br>🧬 Nivel: ${player.nivel} | XP: ${player.xp}/${player.xpProx}
        <br>❤️ Vida: ${player.hp}/${player.maxHp} | Ataque: ${player.ataque}`;
    if (inimigoAtual) {
        enemyStats.innerHTML = `<strong>${inimigoAtual.nome}</strong> - 🧨 Vida: ${inimigoAtual.hp}`;
        if (inimigoAtual.especial) enemyStats.innerHTML += ` <span style="color:#fe8b8b;">(Especial: ${inimigoAtual.especial})</span>`;
    } else {
        enemyStats.innerHTML = ``;
    }
    inventoryDiv.innerHTML = `<strong>Inventário:</strong> ${player.inventario.join(", ") || "Vazio"}`;
}

function prologo() {
    story.innerHTML = `
        Você acorda em uma floresta escura.<br>
        Agora há rumores de monstros raros e um dragão jovem nas proximidades.<br>
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
    if (sorteio < 0.8) { // mais chance de combate agora!
        iniciarCombate();
    } else {
        story.innerHTML = "Você encontra uma clareira tranquila e descansa um pouco.<br>Recupera 7 pontos de vida!";
        player.hp = Math.min(player.maxHp, player.hp + 7);
        setTimeout(prologo, 1600);
        mostrarStatus();
    }
}

function iniciarCombate() {
    // inimigos do jogador sobem de acordo com o nivel
    let idx = Math.floor(Math.random() * (player.nivel + 3));
    if (idx >= inimigos.length) idx = inimigos.length - 1;
    inimigoAtual = Object.assign({}, inimigos[idx]);
    // aumenta hp/atk do inimigo conforme o nível do jogador
    inimigoAtual.hp += player.nivel * 5;
    inimigoAtual.ataque += Math.floor(player.nivel * 0.8);
    story.innerHTML = `Você encontrou um <strong>${inimigoAtual.nome}</strong>! Prepare-se para lutar.`;
    mostrarStatus();
    mostrarOpcoesCombate();
}

function mostrarOpcoesCombate() {
    options.innerHTML = "";
    addBtn("Atacar", atacar);
    addBtn("Usar Poção", usarPocao);
    addBtn("Fugir", fugirCombate);
    if (player.nivel >= 3) addBtn("Ataque Especial", ataqueEspecial);
}

function atacar() {
    let dano = player.ataque + Math.floor(Math.random()*2);
    inimigoAtual.hp -= dano;
    story.innerHTML = `Você atacou o ${inimigoAtual.nome} causou ${dano} de dano!`;
    if (inimigoAtual.hp <= 0) {
        story.innerHTML += `<br>Você derrotou o ${inimigoAtual.nome}! Ganhou ${inimigoAtual.xp} XP.`;
        player.xp += inimigoAtual.xp;
        if (player.xp >= player.xpProx) {
            subirNivel();
        }
        inimigoAtual = null;
        player.hp = Math.min(player.maxHp, player.hp + 5); // recupera mais vida por nivel
        if (Math.random() < 0.7) player.inventario.push("Poção de cura");
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
    let dano = inimigoAtual.ataque;
    let texto = `O ${inimigoAtual.nome} atacou causando ${dano} de dano!`;
    // inimigos raros podem usar efeitos especiais
    if (inimigoAtual.especial === "veneno" && Math.random() < 0.3) {
        player.hp -= 3;
        texto += " E você foi envenenado! Perde 3 de vida extra."; 
    }
    if (inimigoAtual.especial === "fogo" && Math.random() < 0.2) {
        player.hp -= 6;
        texto += " O dragão cospe fogo! Perde 6 de vida extra!";
    }
    if (inimigoAtual.especial === "defesa" && Math.random() < 0.4) {
        inimigoAtual.hp += 8;
        texto += " O golem regenera vida (+8)";
    }
    player.hp -= dano;
    story.innerHTML += `<br>${texto}`;
    if (player.hp <= 0) {
        story.innerHTML = "Você foi derrotado! Fim de jogo.";
        options.innerHTML = "";
        addBtn("Reiniciar", reiniciarJogo);
    }
}

function usarPocao() {
    const idx = player.inventario.indexOf("Poção de cura");
    if (idx > -1) {
        player.hp = Math.min(player.maxHp, player.hp + player.cura + player.nivel);
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
    if (chance < 0.4) {
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

// Nova função: subir de nível!
function subirNivel() {
    player.nivel++;
    player.xp = player.xp - player.xpProx;
    player.xpProx = Math.floor(player.xpProx * 1.6 + (player.nivel*8));
    player.maxHp += 8;
    player.ataque += 2;
    player.cura += 2;
    player.hp = player.maxHp; // cura ao subir de nível
    story.innerHTML += `<br><strong>🎉 Você subiu para o nível ${player.nivel}!</strong>
    <br>Stats aumentados!`;
}

function ataqueEspecial() {
    if (player.nivel < 3) return;
    let dano = Math.floor(player.ataque * 1.8) + Math.floor(Math.random()*2*player.nivel);
    inimigoAtual.hp -= dano;
    story.innerHTML = `Você usou ATAQUE ESPECIAL e causou ${dano} de dano! (Tempo de recarga: 2 turnos, simule como quiser)`;
    if (inimigoAtual.hp <= 0) {
        story.innerHTML += `<br>Você derrotou o ${inimigoAtual.nome}! Ganhou ${inimigoAtual.xp} XP.`;
        player.xp += inimigoAtual.xp;
        if (player.xp >= player.xpProx) {
            subirNivel();
        }
        inimigoAtual = null;
        player.hp = Math.min(player.maxHp, player.hp + 7);
        if (Math.random() < 0.7) player.inventario.push("Poção de cura");
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

function reiniciarJogo() {
    player.hp = 30;
    player.maxHp = 30;
    player.ataque = 6;
    player.cura = 5;
    player.xp = 0;
    player.nivel = 1;
    player.xpProx = 15;
    player.inventario = ["Poção de cura"];
    inimigoAtual = null;
    prologo();
    mostrarStatus();
}

// Inicializa o jogo
prologo();
mostrarStatus();
