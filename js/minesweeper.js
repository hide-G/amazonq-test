// ゲームの設定
const DIFFICULTY = {
    EASY: { rows: 9, cols: 9, mines: 10 },
    MEDIUM: { rows: 16, cols: 16, mines: 40 },
    HARD: { rows: 16, cols: 30, mines: 99 }
};

// ゲームの状態
let gameState = {
    board: [],
    mineLocations: [],
    rows: DIFFICULTY.EASY.rows,
    cols: DIFFICULTY.EASY.cols,
    mines: DIFFICULTY.EASY.mines,
    revealedCount: 0,
    flagCount: 0,
    gameOver: false,
    gameStarted: false,
    timer: 0,
    timerInterval: null
};

// DOM要素
const gameBoard = document.getElementById('game-board');
const resetButton = document.getElementById('reset-button');
const mineCountDisplay = document.getElementById('mine-count');
const timerDisplay = document.getElementById('timer');
const easyButton = document.getElementById('easy');
const mediumButton = document.getElementById('medium');
const hardButton = document.getElementById('hard');

// イベントリスナーの設定
resetButton.addEventListener('click', resetGame);
easyButton.addEventListener('click', () => setDifficulty('EASY'));
mediumButton.addEventListener('click', () => setDifficulty('MEDIUM'));
hardButton.addEventListener('click', () => setDifficulty('HARD'));

// 難易度の設定
function setDifficulty(level) {
    gameState.rows = DIFFICULTY[level].rows;
    gameState.cols = DIFFICULTY[level].cols;
    gameState.mines = DIFFICULTY[level].mines;
    resetGame();
}

// ゲームの初期化
function initializeGame() {
    // ゲームボードのスタイル設定
    gameBoard.style.gridTemplateColumns = `repeat(${gameState.cols}, 1fr)`;
    
    // ゲームボードの作成
    gameBoard.innerHTML = '';
    gameState.board = [];
    
    for (let row = 0; row < gameState.rows; row++) {
        gameState.board[row] = [];
        for (let col = 0; col < gameState.cols; col++) {
            gameState.board[row][col] = {
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                adjacentMines: 0
            };
            
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            // 左クリックイベント
            cell.addEventListener('click', () => {
                if (!gameState.gameStarted) {
                    startGame(row, col);
                }
                revealCell(row, col);
            });
            
            // 右クリックイベント
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                if (!gameState.gameOver) {
                    toggleFlag(row, col);
                }
            });
            
            gameBoard.appendChild(cell);
        }
    }
    
    updateMineCount();
}

// ゲームのリセット
function resetGame() {
    stopTimer();
    gameState.gameOver = false;
    gameState.gameStarted = false;
    gameState.revealedCount = 0;
    gameState.flagCount = 0;
    gameState.timer = 0;
    gameState.mineLocations = [];
    resetButton.textContent = '😊';
    timerDisplay.textContent = '⏱️ 0';
    initializeGame();
}

// ゲームの開始
function startGame(firstRow, firstCol) {
    gameState.gameStarted = true;
    placeMines(firstRow, firstCol);
    calculateAdjacentMines();
    startTimer();
}

// 地雷の配置
function placeMines(safeRow, safeCol) {
    gameState.mineLocations = [];
    let minesPlaced = 0;
    
    while (minesPlaced < gameState.mines) {
        const row = Math.floor(Math.random() * gameState.rows);
        const col = Math.floor(Math.random() * gameState.cols);
        
        // 最初にクリックしたセルとその周囲には地雷を配置しない
        const isSafeZone = Math.abs(row - safeRow) <= 1 && Math.abs(col - safeCol) <= 1;
        
        if (!gameState.board[row][col].isMine && !isSafeZone) {
            gameState.board[row][col].isMine = true;
            gameState.mineLocations.push({ row, col });
            minesPlaced++;
        }
    }
}

// 隣接する地雷の数を計算
function calculateAdjacentMines() {
    for (let row = 0; row < gameState.rows; row++) {
        for (let col = 0; col < gameState.cols; col++) {
            if (!gameState.board[row][col].isMine) {
                let count = 0;
                
                // 周囲8マスをチェック
                for (let r = Math.max(0, row - 1); r <= Math.min(gameState.rows - 1, row + 1); r++) {
                    for (let c = Math.max(0, col - 1); c <= Math.min(gameState.cols - 1, col + 1); c++) {
                        if (gameState.board[r][c].isMine) {
                            count++;
                        }
                    }
                }
                
                gameState.board[row][col].adjacentMines = count;
            }
        }
    }
}

// セルを開く
function revealCell(row, col) {
    const cell = gameState.board[row][col];
    
    // すでに開かれている、フラグが立っている、またはゲームオーバーの場合は何もしない
    if (cell.isRevealed || cell.isFlagged || gameState.gameOver) {
        return;
    }
    
    cell.isRevealed = true;
    const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    cellElement.classList.add('revealed');
    
    // 地雷をクリックした場合
    if (cell.isMine) {
        gameOver(false);
        cellElement.classList.add('mine');
        cellElement.textContent = '💣';
        return;
    }
    
    // 地雷でない場合はカウントを増やす
    gameState.revealedCount++;
    
    // 隣接する地雷の数を表示
    if (cell.adjacentMines > 0) {
        cellElement.textContent = cell.adjacentMines;
        cellElement.dataset.number = cell.adjacentMines;
    } else {
        // 隣接する地雷がない場合は周囲のセルも開く
        for (let r = Math.max(0, row - 1); r <= Math.min(gameState.rows - 1, row + 1); r++) {
            for (let c = Math.max(0, col - 1); c <= Math.min(gameState.cols - 1, col + 1); c++) {
                if (r !== row || c !== col) {
                    revealCell(r, c);
                }
            }
        }
    }
    
    // 勝利条件のチェック
    checkWin();
}

// フラグの切り替え
function toggleFlag(row, col) {
    const cell = gameState.board[row][col];
    
    // すでに開かれているセルにはフラグを立てられない
    if (cell.isRevealed || gameState.gameOver) {
        return;
    }
    
    const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    
    if (cell.isFlagged) {
        cell.isFlagged = false;
        cellElement.classList.remove('flagged');
        cellElement.textContent = '';
        gameState.flagCount--;
    } else {
        cell.isFlagged = true;
        cellElement.classList.add('flagged');
        cellElement.textContent = '🚩';
        gameState.flagCount++;
    }
    
    updateMineCount();
}

// 地雷カウントの更新
function updateMineCount() {
    mineCountDisplay.textContent = `💣 ${gameState.mines - gameState.flagCount}`;
}

// タイマーの開始
function startTimer() {
    gameState.timer = 0;
    gameState.timerInterval = setInterval(() => {
        gameState.timer++;
        timerDisplay.textContent = `⏱️ ${gameState.timer}`;
    }, 1000);
}

// タイマーの停止
function stopTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
}

// 勝利条件のチェック
function checkWin() {
    const totalCells = gameState.rows * gameState.cols;
    const nonMineCells = totalCells - gameState.mines;
    
    if (gameState.revealedCount === nonMineCells) {
        gameOver(true);
    }
}

// ゲームオーバー処理
function gameOver(isWin) {
    gameState.gameOver = true;
    stopTimer();
    
    if (isWin) {
        resetButton.textContent = '😎';
        // 全ての地雷にフラグを立てる
        gameState.mineLocations.forEach(({ row, col }) => {
            if (!gameState.board[row][col].isFlagged) {
                const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                cellElement.textContent = '🚩';
                cellElement.classList.add('flagged');
            }
        });
        alert('おめでとうございます！クリアしました！');
    } else {
        resetButton.textContent = '😵';
        // 全ての地雷を表示
        gameState.mineLocations.forEach(({ row, col }) => {
            if (!gameState.board[row][col].isRevealed && !gameState.board[row][col].isFlagged) {
                const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                cellElement.textContent = '💣';
                cellElement.classList.add('mine');
            }
        });
        
        // 間違ったフラグを表示
        for (let row = 0; row < gameState.rows; row++) {
            for (let col = 0; col < gameState.cols; col++) {
                if (gameState.board[row][col].isFlagged && !gameState.board[row][col].isMine) {
                    const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                    cellElement.textContent = '❌';
                }
            }
        }
    }
}

// ゲームの初期化
resetGame();