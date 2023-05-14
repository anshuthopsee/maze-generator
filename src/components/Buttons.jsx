import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import RouteIcon from '@mui/icons-material/Route';
import NotStartedOutlinedIcon from '@mui/icons-material/NotStartedOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import { AppContext } from './App.jsx';
import { MazeContext } from './Maze.jsx';
import { useContext } from 'react';

export default function Buttons() {
    const { mobileView } = useContext(AppContext);
    const { 
        mazeReset, 
        mazeComplete, 
        generateMaze, 
        pauseResume, 
        clearMaze 
    } = useContext(MazeContext);

    const commonSettings = {
        sx: {
            mx: 0.5,
            fontWeight: 700,
        },
        variant: "contained",
        size: "small"
    }

    const buttonSettings = {
        generate: {
            onClick: generateMaze
        },
        pauseResume: {
            onClick: pauseResume,
            disabled: mazeReset || mazeComplete
        },
        clear: {
            onClick: clearMaze,
            disabled: mazeReset
        }
    }

    return (
        <Box display="flex" justifyContent={"center"} flexWrap={"wrap"}>
            <Button 
                {...commonSettings} 
                {...buttonSettings.generate}
            >
                {mobileView ? <RouteIcon/> : "Generate"}
            </Button>
            <Button 
                {...commonSettings} 
                {...buttonSettings.pauseResume}
            >
                {mobileView ? <NotStartedOutlinedIcon/> : "Pause/Resume"}
            </Button>
            <Button 
                {...commonSettings} 
                {...buttonSettings.clear}
            >
                {mobileView ? <ClearIcon/> : "Clear"}
            </Button>
        </Box>
    );
};