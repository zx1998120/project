import * as React from 'react';
import {ReactNode, useRef} from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {Box, Checkbox, FormControlLabel, FormGroup, Grid, Input, Slider, Typography} from "@mui/material";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import FlightCard from "../../component/FlightCard.tsx";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import {useSortingOpton, useTempFilterOptionUpdater} from "../../store/FilterOptionContext.tsx";
import {FilterDebugPanel} from "../../component/FilterDebugPanel.tsx";
import {SortingDirection, SortingType, StopOptionType} from "../../type/FilterOptionType.tsx";
import {useLoaderData} from "react-router-dom";
import {FlightPlan} from "../../type/FlightPlan.ts";
import {FilterBar} from "./FilterBar.tsx";

type FoldableListItemProps = {
    icon : ReactNode,
    initialState: boolean,
    primary: string
} & React.PropsWithChildren;

export function FoldableListItem({icon, initialState, children, primary}: FoldableListItemProps) {
    const [open, setOpen] = React.useState(initialState);
    const handleClick = () => {
        setOpen(!open);
    };
    return <>
        <ListItemButton onClick={handleClick} disableGutters={true}>
            <ListItemIcon>
                {icon}
            </ListItemIcon>
            <ListItemText primary={primary}/>
            {open ? <ExpandLess/> : <ExpandMore/>}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit style={{paddingLeft: "1rem"}}>
            {children}
        </Collapse>
    </>
}

type BoundedValueSlider = {
    minValue: number,
    maxValue: number
}

function inbound(i : number, minValue : number, maxValue : number) {
    return i >= minValue && i <= maxValue
}
/*
function clamp(i : number, minValue : number, maxValue : number){
    return Math.min(Math.max(i, minValue), Math.min(i, maxValue))
}
*/

export function BoundedValueSlider({minValue, maxValue}: BoundedValueSlider) {
    const [value, setValue] = React.useState<number[]>([minValue, maxValue]);

    const handleLowerInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value !== '') {
            const c = Number(event.target.value)
            if (c >= minValue && c <= maxValue && c <= value[1]) {
                setValue([c, value[1]])
            }
        }
    };
    const handleUpperInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value !== '') {
            const c = Number(event.target.value)
            if (c >= minValue && c <= maxValue && c >= value[0]) {
                setValue([value[0], c])
            }
        }
    };
    const maxRef = useRef<HTMLInputElement>()
    const minRef = useRef<HTMLInputElement>()
    const handleSliderChange = (_: Event, newValue: number | number[]) => {
        const varray = newValue as number[]
        setValue(varray)
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
            setValue([tmp_minValue, tmp_maxValue])
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

function FlightList() {
    const sortingOption = useSortingOpton()
    const data = useLoaderData() as FlightPlan[]
    const sortedData = [...data].sort((e1, e2)=> {
        // todo : fix the comparison here,
        // currently we use the information from first flight to do the comparison
        const f1 = e1.flights[0]
        const f2 = e2.flights[0]
        let cmp : boolean = false
        switch (sortingOption.sortingType) {
            case SortingType.None:
                cmp = f1.id < f2.id
                break
            case SortingType.SortingByPrice:
                cmp = f1.price < f2.price
                break
            case SortingType.SortingByArrivalDate:
                cmp = f1.arriveTime.utc.isBefore(f2.arriveTime.utc)
                break
            case SortingType.SortingByDepartureDate:
                cmp = f1.departTime.utc.isBefore(f2.departTime.utc)
                break
            case SortingType.SortingByTravelTime:
                cmp = f1.duration < f2.duration
                break
        }
        if (sortingOption.sortingDirection == SortingDirection.Ascending) {
            cmp = !cmp
        }
        return cmp ? 1 : -1
    })
    console.log(sortingOption)
    console.log(sortedData.map((i)=>{
        return i.flights[0].id
    }))
    return <div style={{maxWidth:"900px", margin:"auto"}}>
        {
            sortedData.map((i, index) => {
                return (<div key={index}>
                    <FlightCard plan={i}/>
                </div>)
            })
        }
    </div>
}

export default function SearchPage() {
    const setTempFilter = useTempFilterOptionUpdater()
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTempFilter((draft) => {
            draft.tempOption.setStopType(Number(event.target.value), event.target.checked)
            console.log(draft)
        })
    }
    return (
        <Grid container>
            <Grid item sx={{
                'padding': "0em 1rem",
                'border': "1px solid #d9e2e8",
                width: '20%', minWidth: 300, maxWidth: 400,
            }}>
                <List
                    sx={{
                        width: '100%',
                    }}
                    component="div"
                    aria-labelledby="nested-list-subheader"
                    subheader={
                        <ListSubheader component="div" id="nested-list-subheader" sx={{fontSize:"1.5em", backgroundColor: "transparent"}}>
                            Filter
                        </ListSubheader>
                    }
                >
                    <DatePicker label="Depart Date" sx={{marginBottom:"1em"}}/>
                    <DatePicker label="Arrive Date" sx={{marginBottom:"1em"}}/>
                    <FoldableListItem icon={<AirportShuttleIcon/>} primary="Stops" initialState={false}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox onChange={handleChange} defaultChecked value={StopOptionType.NonStop}/>}  label="Nonstop"/>
                            <FormControlLabel control={<Checkbox onChange={handleChange} defaultChecked value={StopOptionType.OneStop}/>}  label="1 stop"/>
                            <FormControlLabel control={<Checkbox onChange={handleChange} defaultChecked value={StopOptionType.TwoStop}/>}  label="2 stop"/>
                        </FormGroup>
                    </FoldableListItem>
                    <FoldableListItem icon={<MonetizationOnIcon/>}  primary="Price" initialState={false}>
                        <BoundedValueSlider minValue={100} maxValue={200}/>
                    </FoldableListItem>
                    <ListItemButton disableGutters={true}>
                        <ListItemIcon>
                            <SendIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Sent mail"/>
                    </ListItemButton>
                </List>
            </Grid>
            <Grid item sx={{flexGrow: 1}}>
                <FilterBar/>
                <FilterDebugPanel/>
                <FlightList/>
            </Grid>
        </Grid>

    );
}