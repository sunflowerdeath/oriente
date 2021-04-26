import { useRef, useEffect, useCallback, useState } from 'react'

const useForceUpdate = () => {
    const unmountedRef = useRef(false)
    const [count, setCount] = useState(0)
    useEffect(
        () => () => {
            unmountedRef.current = true
        },
        []
    )
    return useCallback(() => {
        if (!unmountedRef.current) setCount(count + 1)
    }, [count])
}

export default useForceUpdate
