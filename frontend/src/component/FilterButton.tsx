import {MouseEventHandler} from "react";
import styles from "./FilterButton.module.css"
import {SortingDirection, SortingType} from "../type/FilterOptionType.tsx";
import {useSortingOpton} from "../store/FilterOptionContext.tsx";

type FilterButtonProp = {
    text: string,
    callback: MouseEventHandler<HTMLButtonElement>
    sortingType: SortingType
}

export function FilterButton({text, callback, sortingType}: FilterButtonProp) {
    const sortingOption = useSortingOpton()
    const className = (sortingOption.sortingType == SortingType.None || sortingOption.sortingDirection == SortingDirection.Ascending) ? styles.ascending : styles.descending
    return (<button className={styles.button}
            onClick={(event) => {
                if (sortingOption.sortingType != sortingType) {
                    sortingOption.updater((draft) => {
                        draft.sortingType = sortingType
                        draft.sortingDirection = SortingDirection.Ascending
                    })
                } else {
                    sortingOption.updater((draft) => {
                        if (draft.sortingDirection == SortingDirection.Ascending) {
                            draft.sortingDirection =  SortingDirection.Descending
                        }
                        else {
                            draft.sortingType = SortingType.None
                            draft.sortingDirection = SortingDirection.Ascending
                        }
                    })
                }
                callback(event)
            }}
                >
            <div
                className={`${sortingOption.sortingType != sortingType ? styles.none : className} ${styles.icons}`}>{sortingOption.sortingType != sortingType  ? "◯" : "▼"}</div>
            <span>{text}</span>
        </button>
    )
}
