import * as React from 'react';
import {ReactNode} from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {Checkbox, FormControlLabel, FormGroup, Grid} from "@mui/material";
import FlightCard from "../../component/FlightCard.tsx";
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import {useSortingOpton, useTempFilterOptionUpdater} from "../../store/FilterOptionContext.tsx";
import {SortingDirection, SortingType, StopOptionType} from "../../type/FilterOptionType.tsx";
import {useLoaderData} from "react-router-dom";
import {FlightPlan} from "../../type/FlightPlan.ts";
import {FilterBar} from "./FilterBar.tsx";
import {Moment} from "moment-timezone";
import {DateWithZone} from "../../type/TimeZone.ts";
import {FilterDebugPanel} from "../../component/FilterDebugPanel.tsx";
import {BoundedValueSlider} from "../../component/BoundedValueSlider.tsx";
import AccessTimeIcon from '@mui/icons-material/AccessTime';

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

/*
function clamp(i : number, minValue : number, maxValue : number){
    return Math.min(Math.max(i, minValue), Math.min(i, maxValue))
}
*/


function FlightList() {
    const sortingOption = useSortingOpton()
    const data = (useLoaderData() as {data:FlightPlan[]}).data
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
        })
    }
    return (
        <Grid container sx={{flexWrap:"nowrap"}}>
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
                    <DatePicker label="Depart Date"
                                sx={{marginBottom:"1em"}} onChange={(v)=>setTempFilter(draft => {
                        const m = v as Moment
                        const s = m.utc().format()
                        draft.tempOption.departDate = new DateWithZone(s, "UTC")
                    })} />
                    <DatePicker label="Arrive Date" sx={{marginBottom:"1EM"}}
                                onChange={(v)=>setTempFilter(draft => {
                        const m = v as Moment
                        const s = m.utc().format()
                        draft.tempOption.arriveDate = new DateWithZone(s, "UTC")
                    })} />
                    <FoldableListItem icon={<AirportShuttleIcon/>} primary="Stops" initialState={false}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox onChange={handleChange} defaultChecked value={StopOptionType.NonStop}/>}  label="Nonstop"/>
                            <FormControlLabel control={<Checkbox onChange={handleChange} defaultChecked value={StopOptionType.OneStop}/>}  label="1 stop"/>
                            <FormControlLabel control={<Checkbox onChange={handleChange} defaultChecked value={StopOptionType.TwoStop}/>}  label="2 stop"/>
                        </FormGroup>
                    </FoldableListItem>
                    <FoldableListItem icon={<MonetizationOnIcon/>}  primary="Price" initialState={false}>
                        <BoundedValueSlider minValue={100} maxValue={200} onRangeChange={(minValue, maxValue)=>{
                            setTempFilter((draft)=>{
                                draft.tempOption.priceRange.minValue = minValue
                                draft.tempOption.priceRange.maxValue = maxValue
                            })
                        }}/>
                    </FoldableListItem>
                    <FoldableListItem icon={<AccessTimeIcon/>}  primary="Duration" initialState={false}>
                        <BoundedValueSlider minValue={100} maxValue={200} onRangeChange={(minValue, maxValue)=>{
                            setTempFilter((draft)=>{
                                draft.tempOption.durationRange.minValue = minValue
                                draft.tempOption.durationRange.maxValue = maxValue
                            })
                        }}/>
                    </FoldableListItem>
                </List>
            </Grid>
            <Grid item sx={{flex:"1 0 auto",maxWidth:"1200px", margin:"auto"}}>
                <FilterDebugPanel/>
                <FilterBar/>
                <FlightList/>
            </Grid>
        </Grid>
    );
}