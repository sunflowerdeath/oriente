import { useState } from 'react'
import capitalize from 'lodash/capitalize'

const useControlledState = (props, name, defaultState) => {
    let initialState = props[`initial${capitalize(name)}`]
    let [localState, setLocalState] = useState(
        initialState === undefined ? defaultState : initialState
    )
    let state = name in props ? props[name] : localState
    let setState = (value) => {
        if (name in props) {
            let cb = props[`onChange${capitalize(name)}`]
            if (cb) cb(value)
        } else {
            setLocalState(value)
        }
    }
    return [state, setState]
}

export default useControlledState
