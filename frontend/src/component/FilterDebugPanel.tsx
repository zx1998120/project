import {
    useCurrentFilterOption,
    useSortingOpton,
    useTempFilterOption
} from "../store/FilterOptionContext.tsx";

function replacer(_: unknown, value: unknown[]) {
    if (value instanceof Map) {
        return {
            dataType: 'Map',
            value: Array.from(value.entries()), // or with spread: value: [...value]
        };
    } else {
        return value;
    }
}

export function FilterDebugPanel() {

    const json1 = JSON.stringify(useCurrentFilterOption(), replacer)
    const json2 = JSON.stringify(useTempFilterOption(), replacer)
    const json3 = JSON.stringify(useSortingOpton(), replacer)
    const s = {whiteSpace:"normal", color:"black"}
    return <>
        <pre style={s}>{json1}</pre>
        <pre style={s}>{json2}</pre>
        <pre style={s}>{json3}</pre>
    </>
        }