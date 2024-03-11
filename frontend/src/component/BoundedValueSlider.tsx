import * as React from "react";
import {useRef} from "react";
import {Box, Grid, Input, Slider, Typography} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

type BoundedValueSlider = {
    minValue: number,
    maxValue: number,
    onRangeChange(min : number, max:number) : void | undefined
}

function inbound(i : number, minValue : number, maxValue : number) {
    return i >= minValue && i <= maxValue
}
export function BoundedValueSlider({minValue, maxValue, onRangeChange}: BoundedValueSlider) {
    const [value, setValue] = React.useState<number[]>([minValue, maxValue]);
    function setValueWrapper(minValue : number, maxValue : number) {
        setValue([minValue, maxValue])
        if (onRangeChange != undefined){
            onRangeChange(minValue, maxValue)
        }
    }
    const handleLowerInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value !== '') {
            const c = Number(event.target.value)
            if (c >= minValue && c <= maxValue && c <= value[1]) {
                setValueWrapper(c, value[1])
            }
        }
    };
    const handleUpperInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value !== '') {
            const c = Number(event.target.value)
            if (c >= minValue && c <= maxValue && c >= value[0]) {
                setValueWrapper(value[0], c)
            }
        }
    };
    const maxRef = useRef<HTMLInputElement>()
    const minRef = useRef<HTMLInputElement>()
    const handleSliderChange = (_: Event, newValue: number | number[]) => {
        const varray = newValue as number[]
        setValueWrapper(varray[0], varray[1])
        const maxc = maxRef.current
        const minc = minRef.current
        if (maxc && minc) {
            minc.value = varray[0].toString()
            maxc.value = varray[1].toString()
        }
    };
    const handleBlur = () => {
        const maxc = maxRef.current
        const minc = minRef.current
        if (maxc && minc) {
            let tmp_maxValue = parseInt(maxc.value)
            let tmp_minValue = parseInt(minc.value)
            if (!inbound(tmp_minValue, minValue, maxValue)) {
                tmp_minValue = minValue
            }
            if (!inbound(tmp_maxValue, minValue, maxValue)) {
                tmp_maxValue = maxValue
            }
            minc.value = tmp_minValue.toString()
            maxc.value = tmp_maxValue.toString()
            setValueWrapper(tmp_minValue, tmp_maxValue)
        }
    }

    return (
        <Box sx={{width: 250}}>
            <Grid container spacing={0.5} alignItems="center">
                <Typography>From</Typography>
                <Grid item>
                    <Input
                        inputRef={minRef}
                        defaultValue={minValue}
                        size="small"
                        onChange={handleLowerInputChange}
                        onBlur={handleBlur}
                        inputProps={{
                            min: minValue,
                            max: value[1],
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                            style: {textAlign: 'center'}
                        }}
                    />
                </Grid>
                <Typography>To</Typography>
                <Grid item>
                    <Input
                        inputRef={maxRef}
                        defaultValue={maxValue}
                        size="small"
                        onChange={handleUpperInputChange}
                        onBlur={handleBlur}
                        inputProps={{
                            min: value[0],
                            max: maxValue,
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                            style: {textAlign: 'center'}
                        }}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item>
                    <AttachMoneyIcon/>
                </Grid>
                <Grid item xs>
                    <Slider
                        disableSwap
                        min={minValue}
                        max={maxValue}
                        defaultValue={value}
                        value={value}
                        onChange={handleSliderChange}
                        aria-labelledby="input-slider"
                        valueLabelDisplay="auto"
                    />
                </Grid>
            </Grid>
        </Box>
    );
}