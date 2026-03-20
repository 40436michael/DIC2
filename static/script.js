const ROWS = 5;
const COLS = 5;

let startCell = [0, 0];
let endCell = [4, 4];
let blockCells = [[1, 1], [2, 2], [3, 3]];

let currentMode = 'setStart'; // 'setStart', 'setEnd', 'toggleBlock'

const gridContainer = document.getElementById('grid-container');

// Arrow mappings
const arrowIcons = {
    'Up': '<i class="fa-solid fa-arrow-up"></i>',
    'Down': '<i class="fa-solid fa-arrow-down"></i>',
    'Left': '<i class="fa-solid fa-arrow-left"></i>',
    'Right': '<i class="fa-solid fa-arrow-right"></i>'
};

function initGrid() {
    gridContainer.innerHTML = '';
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.r = r;
            cell.dataset.c = c;

            const valSpan = document.createElement('div');
            valSpan.className = 'cell-value';

            const iconSpan = document.createElement('div');
            iconSpan.className = 'cell-icon';

            cell.appendChild(valSpan);
            cell.appendChild(iconSpan);

            cell.addEventListener('click', () => handleCellClick(r, c));
            gridContainer.appendChild(cell);
        }
    }
    updateGridVisuals();
}

function handleCellClick(r, c) {
    if (currentMode === 'setStart') {
        if (!isSameCell([r, c], endCell) && !isBlock([r, c])) {
            startCell = [r, c];
        }
    } else if (currentMode === 'setEnd') {
        if (!isSameCell([r, c], startCell) && !isBlock([r, c])) {
            endCell = [r, c];
        }
    } else if (currentMode === 'toggleBlock') {
        if (!isSameCell([r, c], startCell) && !isSameCell([r, c], endCell)) {
            const idx = getBlockIndex([r, c]);
            if (idx > -1) {
                blockCells.splice(idx, 1);
            } else {
                blockCells.push([r, c]);
            }
        }
    }

    // Clear previous values/policies when grid structural changes
    clearValuesAndPolicy();
    updateGridVisuals();
}

function isSameCell(c1, c2) {
    return c1[0] === c2[0] && c1[1] === c2[1];
}

function isBlock(cell) {
    return getBlockIndex(cell) > -1;
}

function getBlockIndex(cell) {
    return blockCells.findIndex(b => b[0] === cell[0] && b[1] === cell[1]);
}

function clearValuesAndPolicy() {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cellElem = getCellElement(r, c);
            cellElem.querySelector('.cell-value').innerText = '';
            const iconWrap = cellElem.querySelector('.cell-icon');
            iconWrap.innerHTML = '';
            iconWrap.classList.remove('animate-pop');
        }
    }
}

function updateGridVisuals() {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cellElem = getCellElement(r, c);
            cellElem.className = 'cell'; // reset classes

            if (isSameCell([r, c], startCell)) {
                cellElem.classList.add('start');
                cellElem.querySelector('.cell-icon').innerHTML = '<i class="fa-solid fa-play"></i>';
            } else if (isSameCell([r, c], endCell)) {
                cellElem.classList.add('end');
                cellElem.querySelector('.cell-icon').innerHTML = '<i class="fa-solid fa-flag-checkered"></i>';
            } else if (isBlock([r, c])) {
                cellElem.classList.add('block');
                cellElem.querySelector('.cell-icon').innerHTML = '<i class="fa-solid fa-ban"></i>';
            }
        }
    }
}

function getCellElement(r, c) {
    return gridContainer.children[r * COLS + c];
}

// Controls
document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentMode = e.target.dataset.mode;
    });
});

document.getElementById('btnReset').addEventListener('click', () => {
    startCell = [0, 0];
    endCell = [4, 4];
    blockCells = [[1, 1], [2, 2], [3, 3]];
    clearValuesAndPolicy();
    updateGridVisuals();
});

document.getElementById('btnRandom').addEventListener('click', () => {
    clearValuesAndPolicy();
    updateGridVisuals(); // Re-apply start/end/block icons

    const actions = ['Up', 'Down', 'Left', 'Right'];
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (!isSameCell([r, c], endCell) && !isBlock([r, c])) {
                const randomAct = actions[Math.floor(Math.random() * actions.length)];
                const iconWrap = getCellElement(r, c).querySelector('.cell-icon');
                // Only override if not start (or append if start)
                if (isSameCell([r, c], startCell)) {
                    iconWrap.innerHTML = arrowIcons[randomAct];
                } else {
                    iconWrap.innerHTML = arrowIcons[randomAct];
                }

                // Add staggered animation
                setTimeout(() => {
                    iconWrap.classList.remove('animate-pop');
                    void iconWrap.offsetWidth; // trigger reflow
                    iconWrap.classList.add('animate-pop');
                }, (r * COLS + c) * 30);
            }
        }
    }
});

document.getElementById('btnValueIter').addEventListener('click', async () => {
    try {
        const response = await fetch('/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                start: startCell,
                end: endCell,
                blocks: blockCells
            })
        });

        const data = await response.json();

        clearValuesAndPolicy();
        updateGridVisuals();

        let currTime = 0;
        // Display results
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                if (isBlock([r, c])) continue;

                const cellElem = getCellElement(r, c);
                const valElem = cellElem.querySelector('.cell-value');
                const iconElem = cellElem.querySelector('.cell-icon');

                // Format value to 2 decimal places
                valElem.innerText = data.values[r][c].toFixed(2);

                if (data.policy[r][c]) {
                    iconElem.innerHTML = arrowIcons[data.policy[r][c]];
                } else if (isSameCell([r, c], endCell)) {
                    iconElem.innerHTML = '<i class="fa-solid fa-flag-checkered"></i>';
                }

                // Animation
                setTimeout(() => {
                    valElem.classList.remove('animate-pop');
                    iconElem.classList.remove('animate-pop');
                    void valElem.offsetWidth;
                    valElem.classList.add('animate-pop');
                    iconElem.classList.add('animate-pop');
                }, (r * COLS + c) * 30);

                currTime = Math.max(currTime, (r * COLS + c) * 30);
            }
        }

        // Highlight specific optimal path after showing values
        setTimeout(() => {
            highlightPath(data.policy);
        }, currTime + 300);

    } catch (err) {
        console.error("Failed to run value iteration", err);
        alert("Server error running value iteration. Make sure the python backend is running.");
    }
});

// Initialize on load
initGrid();

function highlightPath(policy) {
    let curr = [startCell[0], startCell[1]];
    let visited = new Set();

    // Stagger animation for path highlighting
    let delay = 0;

    while (!isSameCell(curr, endCell)) {
        let r = curr[0];
        let c = curr[1];
        let stateKey = `${r},${c}`;

        if (visited.has(stateKey) || isBlock(curr)) {
            break;
        }
        visited.add(stateKey);

        const cellElem = getCellElement(r, c);
        if (!isSameCell(curr, startCell)) {
            setTimeout(() => {
                cellElem.classList.add('path');
            }, delay);
            delay += 100; // 100ms per cell in path
        }

        let act = policy[r][c];
        if (!act) break;

        if (act === 'Up') curr = [r - 1, c];
        else if (act === 'Down') curr = [r + 1, c];
        else if (act === 'Left') curr = [r, c - 1];
        else if (act === 'Right') curr = [r, c + 1];
        else break;

        // Boundaries
        if (curr[0] < 0) curr[0] = 0;
        if (curr[0] >= ROWS) curr[0] = ROWS - 1;
        if (curr[1] < 0) curr[1] = 0;
        if (curr[1] >= COLS) curr[1] = COLS - 1;
    }
}
