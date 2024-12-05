const words = [
    "JESUS", "GRACE", "FAITH", "LOVE", "MERCY", "HOPE", "PRAYER", "PEACE", 
    "HOLY", "CROSS", "TRUTH", "BIBLE", "GLORY", "WORSHIP", "SAVIOR", 
    "LIGHT", "SINNER", "HEAVEN", "PROMISE", "MIRACLE"
];
const gridSize = 15;
let foundWords = [];
let selectedCells = [];

// Generate the word puzzle grid
function generateGrid() {
    const grid = Array.from({ length: gridSize }, () =>
        Array.from({ length: gridSize }, () => "")
    );

    words.forEach((word) => placeWord(grid, word));

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            if (grid[row][col] === "") {
                grid[row][col] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
            }
        }
    }

    console.log("Generated Grid:", grid); // Debugging grid generation
    return grid;
}

function placeWord(grid, word) {
    let placed = false;
    while (!placed) {
        const direction = Math.random() > 0.5 ? "horizontal" : "vertical";
        const startRow = Math.floor(Math.random() * gridSize);
        const startCol = Math.floor(Math.random() * gridSize);

        if (direction === "horizontal" && startCol + word.length <= gridSize) {
            let canPlace = true;
            for (let i = 0; i < word.length; i++) {
                if (grid[startRow][startCol + i] !== "" && grid[startRow][startCol + i] !== word[i]) {
                    canPlace = false;
                    break;
                }
            }
            if (canPlace) {
                for (let i = 0; i < word.length; i++) {
                    grid[startRow][startCol + i] = word[i];
                }
                placed = true;
            }
        } else if (direction === "vertical" && startRow + word.length <= gridSize) {
            let canPlace = true;
            for (let i = 0; i < word.length; i++) {
                if (grid[startRow + i][startCol] !== "" && grid[startRow + i][startCol] !== word[i]) {
                    canPlace = false;
                    break;
                }
            }
            if (canPlace) {
                for (let i = 0; i < word.length; i++) {
                    grid[startRow + i][startCol] = word[i];
                }
                placed = true;
            }
        }
    }
}

function createGridElement(grid) {
    const gridContainer = document.getElementById("grid-container");
    gridContainer.innerHTML = "";

    grid.forEach((row, rowIndex) => {
        row.forEach((letter, colIndex) => {
            const cell = document.createElement("div");
            cell.classList.add("grid-item");
            cell.textContent = letter;
            cell.dataset.row = rowIndex;
            cell.dataset.col = colIndex;

            cell.addEventListener("click", () => selectCell(cell));

            gridContainer.appendChild(cell);
        });
    });

    console.log("Grid Rendered!"); // Debugging grid rendering
}

function selectCell(cell) {
    cell.classList.toggle("selected");

    const row = parseInt(cell.dataset.row, 10);
    const col = parseInt(cell.dataset.col, 10);
    const letter = cell.textContent;

    const index = selectedCells.findIndex((c) => c.row === row && c.col === col);

    if (index > -1) {
        selectedCells.splice(index, 1);
    } else {
        selectedCells.push({ row, col, letter });
    }

    checkWord();
}

function checkWord() {
    const word = selectedCells.map((c) => c.letter).join("");
    if (words.includes(word) && !foundWords.includes(word)) {
        alert(`You found the word: ${word}!`);
        selectedCells.forEach((cell) => {
            const cellElement = document.querySelector(
                `.grid-item[data-row="${cell.row}"][data-col="${cell.col}"]`
            );
            cellElement.classList.remove("selected");
            cellElement.classList.add("found");
        });

        foundWords.push(word);
        updateWordList();

        if (foundWords.length === words.length) {
            makeWordsFall();
        }

        selectedCells = [];
    }
}

function updateWordList() {
    const wordListElement = document.getElementById("words");
    wordListElement.innerHTML = words
        .map((w) => (foundWords.includes(w) ? `<s>${w}</s>` : w))
        .join(", ");
}

function makeWordsFall() {
    document.querySelectorAll(".grid-item").forEach((cell) => {
        cell.classList.add("fall");
    });

    setTimeout(() => {
        document.getElementById("congratulations").classList.add("visible");
    }, 2000);
}

function initGame() {
    foundWords = [];
    selectedCells = [];
    const grid = generateGrid();
    createGridElement(grid);
    updateWordList();
}

initGame();
