import { useState } from 'react'

import useFirstRender from './useFirstRender'
import useLatest from './useLatest'

const useSetState = (initialState = {}) => {
    const [state, setState] = useState(initialState)
	const getState = useLatest(state)
	return [getState, newState => setState({ ...getState(), ...newState })]
}
