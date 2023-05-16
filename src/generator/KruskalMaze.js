export class KruskalMaze {
    constructor(canvas, rows, columns, onMazeComplete) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.size = 500;
        this.rows = rows;
        this.columns = columns;
        this.cellSize = 25;
        this.grid = [];
        this.walls = [];
        this.sets = [];
        this.stop = false;
        this.setStop = (bool) => {
            this.stop = bool;
            if (!bool) this.generate();
        };
        this.onMazeComplete = onMazeComplete;
    }

    setup() {
        for (let r = 0; r < this.rows; r++) {
            let row = [];
            for (let c = 0; c < this.columns; c++) {
                let cell = new Cell(r, c, this.cellSize, this.ctx);
                row.push(cell);
                this.sets.push([cell]);
            }
            this.grid.push(row);
        }
        this.createWalls();
        this.draw(true);
    };

    createWalls() {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns; c++) {
                let cell = this.grid[r][c];
                if (r > 0) this.walls.push(new Wall(cell, this.grid[r - 1][c]));
                if (c > 0) this.walls.push(new Wall(cell, this.grid[r][c - 1]));
            };
        };
        this.shuffleWalls();
    };

    shuffleWalls() {
        for (let i = this.walls.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.walls[i], this.walls[j]] = [this.walls[j], this.walls[i]];
        };
    };

    generate() {
        if (this.stop) return;

        if (this.walls.length === 0) {
            this.onMazeComplete();
            return;
        };

        this.draw();

        setTimeout(() => {
        window.requestAnimationFrame(this.generate.bind(this));
        }, 50);
    };

    draw(setup=false) {
        this.canvas.width = this.cellSize * this.columns;
        this.canvas.height = this.cellSize * this.rows;
        this.canvas.style.background = "transparent";

        let wall = this.walls.pop();
        let set1 = this.findSet(wall.cell1);
        let set2 = this.findSet(wall.cell2);

        wall.cell1.visited = true;
        if (!setup) {
            wall.cell2.visited = true;
        };

        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns; c++) {
                let cell = this.grid[r][c];
                cell.show();
            };
        };

        if (set1 !== set2) {
            wall.cell1.removeWall(wall.cell2);
            this.mergeSets(set1, set2);
        };

        wall.cell1.highlight();
    };

    findSet(cell) {
        for (let set of this.sets) {
            if (set.includes(cell)) {
                return set;
            };
        };
        return null;
    };

    mergeSets(set1, set2) {
        set1.forEach((cell) => {
            set2.push(cell);
        });
        this.sets = this.sets.filter((set) => set !== set1);
    };
};

class Cell {
    constructor(row, column, cellSize, ctx) {
        this.row = row;
        this.column = column;
        this.cellSize = cellSize;
        this.ctx = ctx;
        this.visited = false;
        this.walls = {
            topWall: true,
            bottomWall: true,
            leftWall: true,
            rightWall: true,
        };
    };

    removeWall(otherCell) {
        let dx = this.column - otherCell.column;
        let dy = this.row - otherCell.row;

        if (dx === 1) {
            this.walls.leftWall = false;
            otherCell.walls.rightWall = false;
        } else if (dx === -1) {
            this.walls.rightWall = false;
            otherCell.walls.leftWall = false;
        } else if (dy === 1) {
            this.walls.topWall = false;
            otherCell.walls.bottomWall = false;
        } else if (dy === -1) {
            this.walls.bottomWall = false;
            otherCell.walls.topWall = false;
        };
    };

    drawTopWall(x, y) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x+this.cellSize, y);
        this.ctx.stroke();
    };

    drawBottomWall(x, y) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y+this.cellSize);
        this.ctx.lineTo(x+this.cellSize, y+this.cellSize);
        this.ctx.stroke();
    };

    drawLeftWall(x, y) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x, y+this.cellSize);
        this.ctx.stroke();
    };

    drawRightWall(x, y) {
        this.ctx.beginPath();
        this.ctx.moveTo(x+this.cellSize, y);
        this.ctx.lineTo(x+this.cellSize, y+this.cellSize);
        this.ctx.stroke();
    };

    highlight() {
        let x = this.column * this.cellSize+4;
        let y = this.row * this.cellSize+4;

        this.ctx.fillStyle = 'orange';
        this.ctx.fillRect(x, y, this.cellSize-8, this.cellSize-8)
    };

    show(size, rows, columns) {
        let x = (this.column*this.cellSize);
        let y = (this.row*this.cellSize);

        this.ctx.strokeStyle = "white";
        this.ctx.fillStyle = "#1e1f1e";
        this.ctx.lineWidth = 2;

        if (this.visited) {
            this.ctx.fillRect(x, y, (this.cellSize), (this.cellSize));
        };

        if (this.walls.topWall) this.drawTopWall(x, y, size, rows, columns);
        if (this.walls.bottomWall) this.drawBottomWall(x, y, size, rows, columns);
        if (this.walls.leftWall) this.drawLeftWall(x, y, size, rows, columns);
        if (this.walls.rightWall) this.drawRightWall(x, y, size, rows, columns);
    };
};

class Wall {
    constructor(cell1, cell2) {
        this.cell1 = cell1;
        this.cell2 = cell2;
    };
};