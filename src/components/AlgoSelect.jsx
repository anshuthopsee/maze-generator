import { useContext } from 'react';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { AppContext } from './App.jsx';

export default function AlgoSelect() {
    const { selectedAlgo, setSelectedAlgo, controlsActive } = useContext(AppContext);

    const styles = {
        color: "black",
        '.MuiOutlinedInput-notchedOutline': {
          borderColor: 'black',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: 'black',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: 'black',
        },
        '.MuiSvgIcon-root ': {
          fill: "black",
        }
      };

    const handleChange = (e) => {
        setSelectedAlgo(e.target.value)
    };

    return (
        <FormControl variant="standard">
            <Select size="small" value={selectedAlgo} onChange={handleChange} sx={{...styles}}>
                <MenuItem disabled={!controlsActive} value={"Recursive Backtracker"}>Recursive Backtracker</MenuItem>
                <MenuItem disabled={!controlsActive} value={"Kruskal's Algorithm"}>Kruskal's Algorithm</MenuItem>
            </Select>
        </FormControl>
    );
};
