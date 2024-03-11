import './App.css'
import PrimarySearchAppBar from "./page/SearchPage/AppBar.tsx";
import {FilterOptionContextProvider} from "./store/FilterOptionContext.tsx";
import SearchPage from "./page/SearchPage/SearchPage.tsx";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import {LocalizationProvider} from "@mui/x-date-pickers";

function App() {
  return (
    <>
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="en">
            <FilterOptionContextProvider>
                <PrimarySearchAppBar/>
                <SearchPage/>
            </FilterOptionContextProvider>
        </LocalizationProvider>
    </>
  )
}

export default App
