export const findMaxRows = () => {
    const num = Math.floor((window.innerHeight-180)/26);
    return num > 25 ? 25 : num < 2 ? 2 : num;
  };
  
export const findMaxColumns = () => {
    const num = Math.floor(window.innerWidth/26);
    return num > 40 ? 40 : num < 2 ? 2 : num;
};

export const generateClassName = (grid, walls, r, c) => {
    let classNames = {cell: "", playerPos: ""};
    let cell = grid[r][c];

    Object.keys(walls).forEach((wall) => {
    if (walls[wall]) classNames.cell+=(` border-${wall}`);
    });

    if (cell.visited) classNames.cell+=` background-purple`;

    if (cell.currentPos) {
    cell.playerVisited = true;
    classNames.playerPos='player-position';
    };

    return classNames;
};