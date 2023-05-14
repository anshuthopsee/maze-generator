import { useEffect, useState, createContext, useContext, useMemo, useRef } from "react";
import { AppContext } from "./App.jsx";
import { GenerateDFSMaze } from "./utils.js";
import Buttons from "./Buttons.jsx";

export const MazeContext = createContext();

export default function Maze() {
    const mazeRef = useRef(null);
    const mazePaused = useRef(false);
    const [grid, setGrid] = useState(null);
    const [mazeStatus, setMazeStatus] = useState("setup");
    const firstRun = useRef(true);
    const { rows, columns, setControlsActive } = useContext(AppContext);

    const isLastCell = (row, column) => {
      return row===rows-1 && column===columns-1;
    };  

    const generateClassName = (walls, r, c) => {
        let className = ["", ""];
        let cell = grid[r][c];
    
        Object.keys(walls).forEach((wall) => {
          if (walls[wall]) className[0]+=(` border-${wall}`);
        });
    
        if (cell.visited) className[0]+=` background-purple`;

        // if (cell.path && !cell.playerVisited && c) className[1]+='path';
        if (cell.currentPos) {
          cell.playerVisited = true;
          className[1]='player-position';
        };

        if (isLastCell(r, c)) className[1]+=' finish';
    
        return className;
      };

    const drawMaze = useMemo(() => {
      if (grid !== null) {
        return grid.map((row, i) => {
          return <tr className="table-row" key={i}>
            {row.map((col, j) => {
              let [cellClassName, playerPosClassName] = generateClassName(col.walls, i, j);
              return <td className={`table-col${cellClassName}`} key={j}><div className={playerPosClassName}/></td>
            })}
          </tr>
        });
      };
    }, [grid]);

    const generateMaze = (maze, mazeReset=false) => {
      if (mazeReset) mazePaused.current = false;
      if (mazePaused.current) {
        return;
      };

      const { grid, complete } = mazeRef.current.draw(maze);

      setGrid(() => [...grid]);

      if (complete) {
        setMazeStatus("complete");
      } else {
        setTimeout(() => generateMaze(grid), 10);
      };
    };

    const draw = () => {
      setupMaze();
      setMazeStatus("generating");
      generateMaze(undefined, true);
      setControlsActive(false);
    };

    const setupMaze = () => {
      setMazeStatus("setup");
      mazeRef.current = new GenerateDFSMaze(rows, columns, setGrid);
      mazeRef.current.setup();
      setControlsActive(true);
    };

    const clearMaze = () => {
      mazePaused.current = true;
      setupMaze();
    };

    const pauseResume = () => {
      mazePaused.current = !mazePaused.current;

      if (!mazePaused.current) {
        generateMaze([...grid]);
      };
    };

    useEffect(() => {
     
        setupMaze();
        firstRun.current = false;
    }, [rows, columns]);

    return (
      <>
        <MazeContext.Provider value={{mazeStatus, draw, pauseResume, clearMaze }}>
          <Buttons/>
        </MazeContext.Provider>
        <table>
          <tbody>
            {drawMaze}
          </tbody>
        </table>
      </>
    );
};