import { useContext } from 'react';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { AppContext } from './App.jsx';

export default function Controls() {
    const { 
        rows, 
        setRows, 
        columns, 
        setColumns, 
        controlsActive, 
        maxRows, 
        maxColumns, 
        mobileView 
    } = useContext(AppContext);

    const commonSettings = {
        "aria-label": "Default",
        disabled: !controlsActive
    };

    const getValue = (type, max=false) => {
        if (max) {
            return type === "Rows" ? maxRows : maxColumns;
        };
        return type === "Rows" ? rows : columns;
    };

    const handleChange = (type) => (e) => {
        let val = e.target.value;
        if (type === "Rows") setRows(parseInt(val));
        if (type === "Columns") setColumns(parseInt(val));
    };

    const sliderSettings = (type) => {
        if (type === "Rows") {
            return {
                min: 2, 
                max: maxRows,
                value: rows,
                onChange: (e) => setRows(parseInt(e.target.value)),
                valueLabelDisplay: "auto" ,
                marks: [...sliderMarks(type)]
            };
        } else {
            return {
                min: 2, 
                max: maxColumns,
                value: columns,
                onChange: (e) => setColumns(parseInt(e.target.value)),
                valueLabelDisplay: "auto",
                marks: [...sliderMarks(type)]
            };
        };
    };

    const sliderMarks = (type) => {
        const max = getValue(type, true);
        return [
            {
              value: 2,
              label: "2",
            },
            {
              value: max,
              label: `${max}`,
            }
        ];
    };

    const dropdownSettings = (type) => {
        return {
            size: "small",
            value: getValue(type),
            onChange: handleChange(type),
            label: type,
            labelId: type.toLowerCase(),
            MenuProps: {
                PaperProps: {
                    style: {
                        maxHeight: 500
                    }
                }
            }
        }
    };

    const renderOptions = (type) => {
        const options = Array.from({ 
            length: type === "Rows" ? maxRows-1 : maxColumns-1
        }, (_, index) => index + 2);

        return (
            <FormControl fullWidth sx={{my: 1}} {...commonSettings}>
                <InputLabel id={type.toLowerCase()}>{type}</InputLabel>
                <Select 
                    {...dropdownSettings(type)} 
                    labelId={type.toLowerCase()}
                >
                    {options.map((option) => {
                        return (
                            <MenuItem 
                                key={option} 
                                value={option}
                            >
                                {option}
                            </MenuItem>
                        )
                    })}
                </Select>
            </FormControl>
        );
    };

    const renderControls = () => {
        const controls = ["Rows", "Columns"];

        return controls.map((type) => {
            const slider = sliderSettings(type);
            return (
                <Grid item key={type} xs={5}>
                    {!mobileView ? (
                    <>
                        <Typography 
                            id={type.toLowerCase()} 
                            color="primary.light"
                        >
                            {type}
                        </Typography>
                        <Slider {...slider} {...commonSettings}/>
                    </>
                    ) : (
                    renderOptions(type)
                    )}
                </Grid>
            );
        });
    };

    return (
        <Grid 
            sx={{m: 1}} 
            container 
            columnGap={5} 
            justifyContent="center" 
            alignItems={"center"} 
            direction="row"
        >
            {renderControls()}
        </Grid>
    );
};