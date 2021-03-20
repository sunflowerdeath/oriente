import React, { useState, useEffect } from 'react'
import { useSpring } from 'react-spring'

const useAnimatedValue = (to: any) => {
    let [isRest, setIsRest] = useState(false)
    let [props, set] = useSpring(() => ({
        value: to,
        onRest: () => setIsRest(true)
    }))
    useEffect(() => {
        setIsRest(false)
        set({ value: to })
    }, [to])
    return [props.value, isRest]
}

export default useAnimatedValue
