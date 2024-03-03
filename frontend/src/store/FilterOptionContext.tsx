import {FilterOptionType, SortingDirection, SortingType} from "../type/FilterOptionType.tsx";
import {createContext, PropsWithChildren, useContext, useMemo} from "react";
import {Updater, useImmer} from "use-immer";

type FilterOptionPair = {
    currentOption: FilterOptionType
    tempOption: FilterOptionType
}

export type SortingOption = {
    sortingType: SortingType
    sortingDirection: SortingDirection
}
type FilterOptionContextValue = {
    options: FilterOptionPair
    updater: Updater<FilterOptionPair>
    sortingOption : SortingOption
    sortingUpdater : Updater<SortingOption>
}

const initialFilterOptionContextValue: FilterOptionContextValue = {
    options: {
        currentOption: new FilterOptionType(),
        tempOption: new FilterOptionType()
    },
    updater: () => {
    },
    sortingOption : {sortingType: SortingType.None,
    sortingDirection: SortingDirection.Ascending},
    sortingUpdater :()=>{}
}

const FilterOptionContext = createContext(initialFilterOptionContextValue)

export function useCurrentFilterOption() {
    return useContext(FilterOptionContext).options.currentOption
}

export function useTempFilterOption() {
    return useContext(FilterOptionContext).options.tempOption
}

export function useTempFilterOptionUpdater() {
    return useContext(FilterOptionContext).updater
}

export function useSortingOpton() {
    const option = useContext(FilterOptionContext)
    return {
        sortingType: option.sortingOption.sortingType,
        sortingDirection: option.sortingOption.sortingDirection,
        updater : option.sortingUpdater
    }
}
export function FilterOptionContextProvider({children}: PropsWithChildren) {
    const [filterOption, setFilterOption] = useImmer(() => initialFilterOptionContextValue.options)
    const [sortingOption, setSortingOption] = useImmer(() => initialFilterOptionContextValue.sortingOption)
    const contextValue = useMemo<FilterOptionContextValue>(() => {
        return {
            options: filterOption,
            updater: setFilterOption,
            sortingOption : sortingOption,
            sortingUpdater: setSortingOption
        }
    }, [filterOption, sortingOption])
    return (
        <FilterOptionContext.Provider value={contextValue}>
            {children}
        </FilterOptionContext.Provider>
    );
}