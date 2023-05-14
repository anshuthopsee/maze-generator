import { useState, useEffect, createContext, useRef } from "react";
import { findMaxRows, findMaxColumns } from "../helper/helper.js";
import Box from '@mui/material/Box';
import Maze from "./Maze.jsx";
import Navbar from "./Navbar.jsx";
import Controls from "./Controls.jsx";
import Toast from "./Toast.jsx";
import { ThemeProvider, createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const boxSettings = {
    display: "flex", 
    width: "100%", 
    alignItems: "center", 
    justifyContent: "center", 
    flexDirection: "column"
};

export const AppContext = createContext();
export const ToastContext = createContext();

function App() {
    const [selectedAlgo, setSelectedAlgo] = useState("Recursive Backtracker");
    const [controlsActive, setControlsActive] = useState(false);
    const [rows, setRows] = useState(10);
    const [columns, setColumns] = useState(10);
    const [maxRows, setMaxRows] = useState(25);
    const [maxColumns, setMaxColumns] = useState(40);
    const [mobileView, setMobileView] = useState(window.innerWidth <= 500);
    const [toastState, setToastState] = useState({show: false, type: ""});

    const debounceTimerRef = useRef();

    const debounceUpdate = () => {
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

        debounceTimerRef.current = setTimeout(() => {
            updateValues();
        }, 100);

        toggleMobileView();
    };

    const toggleMobileView = () => {
        if (window.innerWidth < 500) {
            setMobileView(true);
        } else {
            setMobileView(false);
        };
    };

    const updateValues = () => {
        const row = findMaxRows();
        setMaxRows(row);
        setRows((prevRows) => {
            if (prevRows*26+180 > window.innerHeight) {
                setShowToast({show: true, type: "dimension"});
                return row;
            };

            return prevRows;
        });

        const col = findMaxColumns();
        setMaxColumns(col);
        setColumns((prevColumns) => {
            if (prevColumns*26 > window.innerWidth) {
                setShowToast({show: true, type: "dimension"});
                return col;
            };

            return prevColumns;
        });
    };

    useEffect(() => {
        updateValues();

        window.addEventListener("resize", debounceUpdate);

        return () => {
            window.removeEventListener("resize", debounceUpdate);
        };

    }, []);

    return (
        <ThemeProvider theme={darkTheme}>
            <ToastContext.Provider value={
                {
                    toastState,
                    setToastState
                }
            }>
            <div className="container">
                    <AppContext.Provider value={
                        { 
                            selectedAlgo,
                            setSelectedAlgo,
                            rows, 
                            setRows, 
                            columns, 
                            setColumns, 
                            controlsActive, 
                            setControlsActive,
                            maxRows, 
                            maxColumns, 
                            mobileView 
                        }
                    }>
                        <Navbar/>
                        <Box {...boxSettings}>
                            <Controls/>
                            <Maze/>
                        </Box>
                    </AppContext.Provider>
                </div>
                <Toast/>
            </ToastContext.Provider>
        </ThemeProvider>
    );
};

export default App;