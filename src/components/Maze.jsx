import { useEffect, useState, createContext, useContext, useRef } from "react";
import { AppContext, ToastContext } from "./App.jsx";
import { RBMaze } from "../generator/RBMaze.js";
import { KruskalMaze } from "../generator/KruskalMaze.js";
import Buttons from "./Buttons.jsx";

export const MazeContext = createContext();

export default function Maze() {
    const algoRef = useRef(null);
    const mazeRef = useRef(null);
    const canvasRef = useRef();
    const [mazeReset, setMazeReset] = useState(true);
    const [mazeComplete, setMazeComplete] = useState(false);

    const { 
        selectedAlgo,
        rows, 
        columns, 
        setControlsActive 
    } = useContext(AppContext);

    const { setToastState } = useContext(ToastContext);

    // Gets called on completion of maze
    const onMazeComplete = () => {
        setMazeComplete(true);
        setToastState({show: true, type: "complete"});
    };

    // Sets up the maze
    const setupMaze = () => {
        // Exit the recursive generation in the previous instance of the maze
        mazeRef.current?.setStop(true);
        
        mazeRef.current = new algoRef.current(
            canvasRef.current, 
            rows, 
            columns, 
            onMazeComplete
        );
        mazeRef.current.setup();
        setMazeReset(true);
        setControlsActive(true);
        setMazeComplete(false);
    };

    // Generates the maze after set up
    const generateMaze = () => {

        // Sets up new maze if the maze hasn't been cleared and reset
        if (!mazeReset) setupMaze();
        setMazeReset(false);
        mazeRef.current.generate();
        setControlsActive(false);
    };

    // Clears existing maze and sets up new one
    const clearMaze = () => {
        mazeRef.current?.setStop(true);
        setupMaze();
    };

    // Pauses/Resumes maze generation
    const pauseResume = () => {
        mazeRef.current?.setStop(!mazeRef.current.stop);
    };

    // Sets up the maze on mount and when rows/cols change
    useEffect(() => {
        if (selectedAlgo === "Recursive Backtracker") {
            algoRef.current = RBMaze;
        } else if (selectedAlgo === "Kruskal's Algorithm") {
            algoRef.current = KruskalMaze;
        };
        setupMaze();
    }, [rows, columns, selectedAlgo]);

    return (
        <>
            <MazeContext.Provider value={
                { 
                    mazeReset, 
                    mazeComplete, 
                    generateMaze, 
                    pauseResume, 
                    clearMaze 
                }
                
            }>
                <Buttons/>
            </MazeContext.Provider>
            <canvas ref={canvasRef}></canvas>
        </>
    );
};