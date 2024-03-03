import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";

export default function TopAppBar() {
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
            </Toolbar>
        </AppBar>
    )
}
