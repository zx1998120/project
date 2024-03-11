import {FilterOptionType, SortingDirection, SortingType} from "../type/FilterOptionType.tsx";
import {createContext, PropsWithChildren, useContext, useEffect} from "react";
import {Updater, useImmer} from "use-immer";
import {useLoaderData} from "react-router-dom";

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
    sortingOption: SortingOption
    sortingUpdater: Updater<SortingOption>
}

const initialFilterOptionContextValue: FilterOptionContextValue = {
    options: {
        currentOption: new FilterOptionType(),
        tempOption: new FilterOptionType()
    },
    updater: () => {
    },
    sortingOption: {
        sortingType: SortingType.None,
        sortingDirection: SortingDirection.Ascending
    },
    sortingUpdater: () => {
    }
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
        updater: option.sortingUpdater
    }
}


export function FilterOptionContextProvider({children}: PropsWithChildren) {
    const params = (useLoaderData() as { context: URLSearchParams }).context
    // create a copy by parsing twice...
    const pair: FilterOptionPair = {
        currentOption: FilterOptionType.parse(params),
        tempOption: FilterOptionType.parse(params)
    }

    const [filterOption, setFilterOption] = useImmer(pair)
    const [sortingOption, setSortingOption] = useImmer(initialFilterOptionContextValue.sortingOption)
    useEffect(()=>{
        setFilterOption(pair)
    }, [params])
    const contextValue = {
        options: filterOption,
        updater: setFilterOption,
        sortingOption: sortingOption,
        sortingUpdater: setSortingOption
    }
    console.log(contextValue)
    return (
        <FilterOptionContext.Provider value={contextValue}>
            {children}
        </FilterOptionContext.Provider>
    );
}