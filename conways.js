function make2DArray(rows, cols) {
    let arr = new Array(rows);
    for (let i = 0; i < rows; i++) {
        arr[i] = new Array(cols);
    }
    return arr;
}

function setupGrid(grid, rows, cols) {
    generation = 0
    document.getElementById('generation').innerHTML = generation //during setup process change the generation count to 0
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            grid[i][j] = Math.random() > 0.5 ? 1 : 0;
        }
    }
}

function drawGrid(grid, ctx, cellSize) {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            ctx.fillStyle = grid[i][j] === 1 ? 'black' : 'white';
            ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);//here we add grid boxes
            ctx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize); // we are adding grid lines 
        }
    }
}

function countNeighboringCells(grid, x, y) {
    let sum = 0;
    let rows = grid.length;
    let cols = grid[0].length;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let row = (x + i + rows) % rows;
            let col = (y + j + cols) % cols;
            sum += grid[row][col];
        }
    }
    sum -= grid[x][y];
    return sum;
}

function updateGrid(grid) {
    let nextGrid = make2DArray(grid.length, grid[0].length);
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            let state = grid[i][j];
            let neighbors = countNeighboringCells(grid, i, j);

            if (state === 0 && neighbors === 3) {
                nextGrid[i][j] = 1;
            } else if (state === 1 && (neighbors < 2 || neighbors > 3)) {
                nextGrid[i][j] = 0;
            } else {
                nextGrid[i][j] = state;
            }
        }
    }
    return nextGrid;
}

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
let generation = 0;
const rows = 30;
const cols = 30;
const cellSize = canvas.width / cols;

let grid = make2DArray(rows, cols);
setupGrid(grid, rows, cols);

let intervalId = null;

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const col = Math.floor(x /cellSize);
    const row = Math.floor(y/ cellSize);

    grid[row][col] = grid[row][col] === 1 ? 0 : 1; // Toggle the cell value
    drawGrid(grid, ctx, cellSize); // Redraw the grid
});

function gameLoop() {
    drawGrid(grid, ctx, cellSize);
    grid = updateGrid(grid);
    generation = generation+1
    document.getElementById('generation').innerHTML = generation
}

document.getElementById('startButton').addEventListener('click', () => {
    if (!intervalId) {
        intervalId = setInterval(gameLoop, 500); // Run the game loop every 500 ms
    }
});

document.getElementById('stopButton').addEventListener('click', () => {
    clearInterval(intervalId);
    intervalId = null;
});

document.getElementById('resetButton').addEventListener('click', () => {
    clearInterval(intervalId);
    intervalId = null;
    grid = make2DArray(rows, cols);
    setupGrid(grid, rows, cols);
    drawGrid(grid, ctx, cellSize);
});

drawGrid(grid, ctx, cellSize);
