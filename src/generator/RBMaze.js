let current;

export class RBMaze {
    constructor(canvas, rows, columns, onMazeComplete) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.rows = rows;
        this.columns = columns;
        this.cellSize = 25;
        this.grid = [];
        this.stack = [];
        this.stop = false;
        this.setStop = (bool) => {
            this.stop = bool;
            if (!bool) this.generate();
        };
        this.onMazeComplete = onMazeComplete;
    };

    setup() {
        for (let r=0; r<this.rows; r++) {
            let row = [];
            for (let c=0; c<this.columns; c++) {
                let cell = new Cell(r, c, this.rows, this.columns, this.cellSize, this.grid, this.ctx);
                row.push(cell);
            };
            this.grid.push(row);
        };
        current = this.grid[0][0];
        this.draw();
    };

    generate() {
        if (this.stop) return;

        if (this.stack.length === 0) {
            this.onMazeComplete();
            return;
        };

        this.draw();

        setTimeout(() => {
            window.requestAnimationFrame(this.generate.bind(this))
        }, 50);
    };

    draw() {
        this.canvas.width = this.cellSize*this.columns;
        this.canvas.height = this.cellSize*this.rows;
        this.canvas.style.background = "transparent";
        current.visited = true;

        for (let r=0; r<this.rows; r++) {
            for (let c=0; c<this.columns; c++) {
                let grid = this.grid;
                grid[r][c].show(this.size, this.rows, this.columns);
            };
        };

        let next = current.checkNeighbours();

        if (next) {
            next.visited = true;
            this.stack.push(current);
            current.highlight(this.rows, this.columns);
            current.removeWalls(current, next);
            current = next;
        } else if (this.stack.length > 0){
            let cell = this.stack.pop();
            current = cell;
            current.highlight(this.rows, this.columns);
        };
    };
};

class Cell {
    constructor(row, column, rows, columns, cellSize, parentGrid, ctx) {
        this.row = row;
        this.column = column;
        this.rows = rows;
        this.columns = columns;
        this.cellSize = cellSize;
        this.parentGrid = parentGrid;
        this.visited = false;
        this.ctx = ctx;
        this.walls = {
            topWall: true,
            bottomWall: true,
            leftWall: true,
            rightWall: true
        };
    };

    checkNeighbours() {
        let grid = this.parentGrid;
        let row = this.row;
        let column = this.column;
        let neighbours = [];

        let top = row !== 0 ? grid[row-1][column] : undefined;
        let bottom = row !== this.rows-1 ? grid[row+1][column] : undefined;
        let left = column !== 0 ? grid[row][column-1] : undefined;
        let right = column !== this.columns-1 ? grid[row][column+1] : undefined;

        if (top && !top.visited) neighbours.push(top);
        if (right && !right.visited) neighbours.push(right);
        if (bottom && !bottom.visited) neighbours.push(bottom);
        if (left && !left.visited) neighbours.push(left);

        if(neighbours.length !==0) {
            let random = Math.floor(Math.random()*neighbours.length);
            return neighbours[random];
        } else {
            return undefined;
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

    removeWalls(cell1, cell2) {
        let x = (cell1.column - cell2.column);

        if (x==1) {
            cell1.walls.leftWall = false;
            cell2.walls.rightWall = false;
        } else if (x==-1) {
            cell1.walls.rightWall = false;
            cell2.walls.leftWall = false;
        };

        let y = (cell1.row - cell2.row);

        if (y==1) {
            cell1.walls.topWall = false;
            cell2.walls.bottomWall = false;
        } else if (y==-1) {
            cell1.walls.bottomWall = false;
            cell2.walls.topWall = false;
        };
    };

    show(size, rows, columns) {
        let x = (this.column*this.cellSize);
        let y = (this.row*this.cellSize);

        this.ctx.strokeStyle = "white";
        this.ctx.fillStyle = "black";
        this.ctx.lineWidth = 2;

        if (this.walls.topWall) this.drawTopWall(x, y, size, rows, columns);
        if (this.walls.bottomWall) this.drawBottomWall(x, y, size, rows, columns);
        if (this.walls.leftWall) this.drawLeftWall(x, y, size, rows, columns);
        if (this.walls.rightWall) this.drawRightWall(x, y, size, rows, columns);
        // if (this.visited) {
        //     this.ctx.fillRect(x+1, y+1, (this.cellSize)-2, (this.cellSize)-2);
        // };
    };
};