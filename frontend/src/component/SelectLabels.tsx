import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {RoundTripOptionType} from "../type/FilterOptionType.tsx";
import {useTempFilterOption, useTempFilterOptionUpdater} from "../store/FilterOptionContext.tsx";

export default function SelectLabels() {
    const tempFilter = useTempFilterOption()
    const setTempFilter = useTempFilterOptionUpdater()
    const handleChange = (event: SelectChangeEvent) => {
        setTempFilter((draft) => {
            draft.tempOption.setRoundTripType(Number(event.target.value))
        })
    };

    return (
        <div>
            <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}  size="medium">
                <InputLabel id="demo-simple-select-helper-label">round trip</InputLabel>
                <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    value={tempFilter.roundtrip.toString()}
                    onChange={handleChange}
                >
                    <MenuItem value={RoundTripOptionType.OneWay}>OneWay</MenuItem>
                    <MenuItem value={RoundTripOptionType.RoundTrip}>RoundTrip</MenuItem>
                </Select>
            </FormControl>
        </div>
    );
}