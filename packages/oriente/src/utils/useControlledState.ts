import { useState } from "react"
import { capitalize } from "es-toolkit"

const useControlledState = <T>(
    props: Record<string, any>,
    name: string,
    defaultState: T
) => {
    const initialState = props[`initial${capitalize(name)}`]
    const [localState, setLocalState] = useState(
        initialState === undefined ? defaultState : initialState
    )
    const state = name in props ? props[name] : localState
    const setState = (value: T) => {
        if (name in props) {
            const cb = props[`onChange${capitalize(name)}`]
            if (cb) cb(value)
        } else {
            setLocalState(value)
        }
    }
    return [state, setState]
}

export default useControlledState
