import {FilterButton} from "../../component/FilterButton.tsx";
import {SortingType} from "../../type/FilterOptionType.tsx";

export function FilterBar() {
    const sortings = [SortingType.SortingByDepartureDate, SortingType.SortingByArrivalDate, SortingType.SortingByPrice]
    return <div style={
        {borderBottom: "2px solid #d9e2e8"}}>
        <div style={{
            margin: "00.5em auto", display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "50%"
        }}>
            {["depart time", "arrive time", "price"].map((text, key) => {
                return <FilterButton sortingType={sortings[key]} text={text} callback={() => {
                }} key={key}/>
            })}
        </div>
    </div>
}