import { useRef } from 'react'

const useLatest = (value) => {
    const ref = useRef(value)
    if (ref.current !== value) ref.current = value
    return () => ref.current
}

export default useLatest
