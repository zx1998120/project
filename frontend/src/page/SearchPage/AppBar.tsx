import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SelectLabels from "../../component/SelectLabels.tsx";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import {useTempFilterOption, useTempFilterOptionUpdater} from "../../store/FilterOptionContext.tsx";
import {useQuery} from "@tanstack/react-query";
import {getAirport} from "../../api/AirportAPI.ts";
import {CircularProgress} from "@mui/material";
import React from 'react';
import {useNavigate, useSearchParams} from "react-router-dom";
import {useAuth} from "../../store/AuthContext.tsx";

export default function PrimarySearchAppBar() {
    const menuId = 'primary-search-account-menu';
    const setTempFilter = useTempFilterOptionUpdater()
    const tempFilter = useTempFilterOption()
    const [_, setSearchParams] = useSearchParams()
    const autoInfo = useAuth()
    const navigate = useNavigate()
    const { isLoading, error, data } = useQuery({
        queryKey: ['repoData'],
        queryFn: async () => {
            return await getAirport()
        }
    })
    if (error != null) {
        console.log(error)
    }
    return (
        <AppBar position={"sticky"} style={{background: 'white', "padding": "0.5em"}}
                elevation={1}>
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    aria-label="open drawer"
                    sx={{mr: 2}}
                >
                    <MenuIcon fontSize="inherit"/>
                </IconButton>
                <Typography
                    noWrap
                    component="div"
                    sx={{display: {xs: 'none', sm: 'block'}, color: "black"}}
                >Kaya
                </Typography>
                <Box sx={{flexGrow: 1}}/>
                <SelectLabels/>
                <Autocomplete
                    disablePortal
                    options={data ? data : []}
                    loading={isLoading}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            size="medium"
                            label="source"
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <React.Fragment>
                                        {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </React.Fragment>
                                ),
                            }}
                        />
                    )}
                    value={tempFilter.origin}
                    sx={{width: "30%", maxWidth: 300}}
                    //renderInput={(params) => <TextField {...params} size="medium" label="source"/>}
                    onChange={(_: unknown, newValue: string | null)=>setTempFilter((draft)=>{
                        draft.tempOption.origin = newValue
                    })}
                />
                <IconButton onClick={()=>setTempFilter(draft => {draft.tempOption.swapOriginDesination()})}>
                    <SwapHorizIcon/>
                </IconButton>
                <Autocomplete
                    disablePortal
                    options={data ? data : []}
                    loading={isLoading}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            size="medium"
                            label="destination"
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <React.Fragment>
                                        {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </React.Fragment>
                                ),
                            }}
                        />
                    )}
                    sx={{width: "30%", maxWidth: 300}}
                    value={tempFilter.destination}
                    //renderInput={(params) => <TextField {...params} size="medium" label="destination"/>}
                    onChange={(_: unknown, newValue: string | null)=>setTempFilter((draft)=>{
                        draft.tempOption.destination = newValue
                    })}
                />
                <IconButton onClick={()=>{
                    const params = tempFilter.serialize()
                    setSearchParams(params)
                }}>
                    <SearchIcon/>
                </IconButton>
                <Box sx={{flexGrow: 1}}/>
                <Box sx={{display: {xs: 'none', md: 'flex'}}}>
                    <IconButton size="large" aria-label="show 4 new mails">
                        <Badge badgeContent={4} color="error">
                            <MailIcon/>
                        </Badge>
                    </IconButton>
                    <IconButton
                        size="large"
                        aria-label="show 17 new notifications"
                    >
                        <Badge badgeContent={17} color="error">
                            <NotificationsIcon/>
                        </Badge>
                    </IconButton>
                    <IconButton
                        size="large"
                        edge="end"
                        aria-label="account of current user"
                        aria-controls={menuId}
                        aria-haspopup="true"
                        onClick={()=>{
                            if (autoInfo?.token.length == 0) {
                                navigate("/login")
                            }
                        }}
                    >
                        <AccountCircle/>
                    </IconButton>
                </Box>
                <Box sx={{display: {xs: 'flex', md: 'none'}}}>
                    <IconButton
                        size="large"
                        aria-label="show more"
                        aria-haspopup="true"
                    >
                        <MoreIcon/>
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
}