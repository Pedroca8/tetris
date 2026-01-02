// ==== VARIÁVEIS GLOBAIS ====
let canvas, ctx;
let grid = [];
const COLS = 30; // 300px / 10px
const ROWS = 50; // 500px / 10px
const BLOCK_SIZE = 10; // tamanho de cada block de 10px
let currentPiece; // peça atual em movimento
let nextPiece; // proxima peça 
let score = 0; // pontuação 
let gameSpeed = 500; //velocidade inicial (ms)
let gameloop; // referencia de loop do jogo 
let isPaused = false; // estado de pausa 
let isGameOver = false; // estado de fim de jogo 

// definição das peças de tetris 
const PIECES = [
    // I (5 blocos retos - vermelho)
    {
        shape: [
            [0,0,0,0,0],
            [0,0,0,0,0],
            [1,1,1,1,1],
            [0,0,0,0,0],
            [0,0,0,0,0]
        ],
        color: 'red',
        size: 5
    },
    // o (cubo 4x4 - azul)
    {
        shape:[
            [1,1],
            [1,1]
        ],
        color: 'blue',
        size: 2
    },
    // T (3 retos com um no meio - verde)
    {
        shape:[
            [0,1,0],
            [1,1,1],
            [0,0,0]
        ],
        color: 'green',
        size: 3
    },
    // L (formato de L - roxo)
    {
         shape: [
            [0,0,1],
            [1,1,1],
            [0,0,0]
        ],
        color:'purple',
        size: 3
    }
];
// ==== INICIALIZAR ====
function init() {
    const boxGame = document.querySelector('.box-game');
    canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 500;
    canvas.style.background = 'white';
    boxGame.innerHTML =''; // limpa o conteudo 
    boxGame.appendChild(canvas);
    ctx = canvas.getContext('2d');

    //inicializa a grade vazia
    for (let r = 0; r < ROWS; r++){
        grid[r] = [];
        for (let c = 0; c < COLS; c++){
            grid[r][c] = 0;
        }
    }
    // criar peças iniciais
    currentPiece = createRandomPiece();
    nextPiece = createRandomPiece();

    // atualiza a cisualização da próxima peça
    updateNextPiecePreview();

    // inicia o loop do jogo 
    startGameLoop();

    // configura controles
    setupControls();

    // atualiza o score inicial
    updateScore();
}

// ==== funções de peças ==== 

function createRandomPiece(){
    // pega uma peça aleatória 
    const randomIndex = Math.floor(Math.random() * PIECES.length);
    const piece = PIECES[randomIndex];

    // calcula a posição sentral no topo
    const startCol = Math.floor((COLS - piece.size) / 2);

    return {
        shape: piece.shape,
        color: piece.color,
        row: 0,
        col: startCol,
        size: piece.size
    };
}
function drawPiece(piece, isCurrent = true){
    //desenhando a peça na tela 
    for (let r = 0; r < piece.size; r++){
        for (let c = 0; c < piece.size; c++){
            if (piece.shape[r][c]){
                const x = piece.col * BLOCK_SIZE + c * BLOCK_SIZE;
                const y = piece.row * BLOCK_SIZE + r * BLOCK_SIZE;

                //desenha o bloco
                ctx.fillStyle = piece.color;
                ctx.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE);

                // adiciona borda para melhor visualização 
                ctx.strokeStyle = 'rgba(0,0,0, 0.2)';
                ctx.strokeRect(x,y, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}
function drawGrid(){
    //limpa o canvas 
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // desenha a grade fixa (blocos já colocados)
    for (let r = 0; r < ROWS; r++){
        for (let c = 0; c < COLS; c++){
            if (grid[r][c]){
                ctx.fillStyle = grid[r][c];
                ctx.fillRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);

                   // Adiciona borda
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
                ctx.strokeRect(c * BLOCK_SIZE, r * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
    // desenha a peça atual 
    drawPiece(currentPiece);
}

// ==== funções de colisão ==== 
function isValidMove(piece, rowOffset = 0, colOffset = 0){
    // cerifaca se o movimento e valido 
    for (let r = 0; r < piece.size; r++) {
        for(let c = 0; c < piece.size; c++) {
            if (piece.shape[r][c]) {
                const newRow = piece.row + r + rowOffset;
                const newCol = piece.col + c + colOffset;

                // verifica limites
                if (newCol < 0 || newCol >= COLS || newRow >= ROWS){
                    return false;
                }

                // verifica colisão com outros blocos 
                if (newRow >= 0 && grid[newRow][newCol]) {
                    return false;
                }
            }
        }
    }
    return true;
}
function mergePiece(){
    //funde a peça atual com a grade 
    for (let r = 0; r < currentPiece.size; r++){
        for (let c = 0; c <currentPiece.size; c++){
            if (currentPiece.shape[r][c]) {
                const gridRow = currentPiece.row + r;
                const gridCol = currentPiece.col + c;

                //verifica se o jogo acabau (peça saiu do topo)
                if(gridRow < 0) {
                    gameOver();
                    return;
                }
                grid[gridRow][gridCol] = currentPiece.color;
            }
        }
    }
    // verifica linhas comletas 
    checkLines();

    //cria nova peça
    currentPiece = nextPiece;
    nextPiece = createRandomPiece();
    updateNextPiecePreview();

    // se a nova peça não puder ser colocada, fim de jogo
    if (!isValidMove(currentPiece)){
        gameOver();
    }
}

// ==== funçoes de jogo ====
function movePieceDown(){
    if (isPaused || isGameOver) return;

    if (isValidMove(currentPiece, 1, 0)){
        currentPiece.row++;
        drawGrid();
      }else{
        mergePiece();
    }
}

function movePieceLeft(){
    if (isPaused || isGameOver) return;

    if (isValidMove(currentPiece, 0, -1)){
        currentPiece.col--;
        drawGrid();
    }
}
function movePieceRight(){
    if (isPaused || isGameOver) return;

    if (isValidMove(currentPiece, 0, 1)){
        currentPiece.col++;
        drawGrid();
    }
}

function rotatePiece() {
    if(isPaused || isGameOver) return;

    // cria uma cópia da peça para testar rotação 
    const rotated = JSON.parse(JSON.stringify(currentPiece));

    // transpõe a matriz (gira 90 graus)
    for (let r = 0; r < rotated.size; r++){
        for(let c = 0; c < r; c++){
            [rotated.shape[r][c], rotated.shape[c][r]] = [rotated.shape[c][r], rotated.shape[r][c]];
        }
    }

    // inverte as colunas para rotação horaria 
    for (let r = 0; r < rotated.size; r++){
        rotated.shape[r].reverse();
    }
    //testa se a rotação e valida
    if (isValidMove(rotated)){
        currentPiece.shape = rotated.shape;
        drawGrid();
    }
}
// ==== funçães de linhas e score ====
function checkLines(){
    let linesCleared = 0;
    
    // verifica cada linha de baixo para cima 
    for(let r = ROWS - 1; r >= 0; r--){
        if(isLineComplete(r)){
            removeLine(r);
            linesCleared++;
            r++; // re-verifica a mesma posição após remoção
        }
    }
    // arualiza score baseado no número de linhas 
    if (linesCleared > 0){
        // sistema de pontuação do tetris
        const points = [100, 300, 500, 800]; // 1, 2, 3, 4, 5 linhas
        score += linesCleared <= 4 ? points[linesCleared - 1]:800;
        updateScore();

        // aumenta velocidade a cada 1000 pontos 
        if (score % 1000 < 100 && gameSpeed > 100) {
            gameSpeed -=50;
            restartGameLoop();
        }
    }
}

function isLineComplete(row){
    // varifica se uma linha está completa
    for(let c = 0; c < COLS; c++){
        if (!grid[row][c]){
            return false;
        }
    }
    return true;
}
function removeLine(row){
    // remove uma linha e move todos acima para baixo 
    for (let r = row; r > 0; r--){
        for(let c = 0; c < COLS; c++){
            grid[r][c] = grid[r-1][c];
        }
    }
    // limpa a linha do topo 
    for (let c = 0; c < COLS; c++){
    grid[0][c] = 0;
    }
}

function updateScore(){
    // arualiza o display do score
    const scoreElement = document.querySelector('.score span');
    scoreElement.textContent = score.toString().padStart(4,'0');
}

// ==== funções de visualização ==== 
function updateNextPiecePreview(){
    // cria ou autualiza a visualização da próxima peça
    let previewContainer = document.querySelector('.next-piece-preview');

    if(!previewContainer){
        // cria o container se nao existir 
        previewContainer = document.createElement('div');
            previewContainer.className = 'next-piece-preview';
            previewContainer.style.cssText = `
            margin-top: 20px;
            padding: 10px;
            background: rgba(255,255,255,0.1);
            boder-radius: 5px;
            text-align: center;
            color: white;
            font-family: Arial;
            `;
            const title = document.createElement('h3');
            title.textContent = 'Próxima Peça';
            title.style.marginBottom = '10px';
            title.style.fontSize = '16px';

            const canvasContainer = document.createElement('div')

            canvasContainer.id = 'nextPieceCanvas';
            previewContainer.appendChild(title);
            previewContainer.appendChild(canvasContainer);

            // adiciona após o score
            document.querySelector('.score').appendChild(previewContainer);
    }
    // cria canvas para a próxima peça
    const previewCanvas = document.createElement('canvas');
    previewCanvas.width = 60;
    previewCanvas.height = 60;

    const previewCtx = previewCanvas.getContext('2d');
    previewCtx.clearRect(0, 0, 60, 60);

    // calcula posição para centralizar 
    const offsetX = (60 - nextPiece.size * 10) / 2;
    const offsetY = (60 - nextPiece.size * 10) / 2;

    // desenha a próxima peça 
    for (let r = 0; r < nextPiece.size; r++){
        for (let c = 0; c < nextPiece.size; c++){
            if (nextPiece.shape[r][c]){
                previewCtx.fillStyle = nextPiece.color;
                previewCtx.fillRect(
                    offsetX + c * 10,
                    offsetY + r * 10,
                    10,10
                );

                previewCtx.strokeStyle = 'rgba(0,0,0,0.2)';
                previewCtx.strokeRect(
                    offsetX + c * 10,
                    offsetY + r * 10,
                    10,10
                );

            }
        }
    }
    //atualiza o container 
    const container = document.getElementById('nextPieceCanvas');
    container.innerHTML = '';
    container.appendChild(previewCanvas);
}
// ==== controles e loop ====
function setupControls(){
    //configura os controles do teclado 
    document.addEventListener('keydown', (e) =>{
        switch(e.key){
            case 'ArrowLeft':
                movePieceLeft();
                break;
            case 'ArrowRight':
                movePieceRight();
                break;
            case 'ArrowDown':
                //acelera a queda
                clearInterval(gameloop);
                movePieceDown();
                gameloop = setInterval(movePieceDown, 50);
                break;
                case 'ArrowUp':
                    rotatePiece();
                    break;
                    case ' ':
                        // pausa com espaço
                        togglePause();
                        break;
        }
    });

    // retorna á velocidade normal quando solta a seta para baixo 
    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowDown') {
            restartGameLoop();
        }
    });
}

function startGameLoop(){
    //inicia o loop principal do jogo 
    gameloop = setInterval(movePieceDown, gameSpeed);
}

function restartGameLoop(){
    // reinicia o loop com velocidade atual 
    clearInterval(gameloop);
    gameloop = setInterval(movePieceDown, gameSpeed);
}

function togglePause(){
    // pausa ou despausa o jogo 
    isPaused = !isPaused;
    if (isPaused){
        clearInterval(gameloop);
        showMessage('PAUSADO');
    } else{
        startGameLoop();
    }
}

function gameOver(){
    //finaliza o jogo 
    isGameOver = true;
    clearInterval(gameloop);
    showMessage('GAME OVER')
}
function showMessage(text){
    //mostra mensagen no canvas
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0,0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(text, canvas.width/2, canvas.height/2);

    //instruções para recomeçar 
    ctx.font = '16px Arial';
    ctx.fillText('Recarregue a pagina para jogar novamente', canvas.width/2, canvas.height/2 + 40);
}
// ==== inicia o jogo ====
// inicia quando a pagina carregar 
window.addEventListener('load',init);

//adiciona css para a pré-visualização
const style = document.createElement('style');
style.textContent = `
        .next-piece-preview h3 {
        color: white;
        margin-bottom: 10px;
        font-size: 16px;
    }
    
    .score {
        margin-left: 20px;
    }
    
    .grid {
        align-items: flex-start;
    }
`;
document.head.appendChild(style);
