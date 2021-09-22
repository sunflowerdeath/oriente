import React, { useState, useEffect } from 'react'
import { useSpring, SpringConfig, AnimatedValue } from 'react-spring'

import configs from './springConfigs'

interface AnimatedValueProps {
    config?: SpringConfig
}

const useAnimatedValue = (
    to: any,
    { config = configs.stiff }: AnimatedValueProps = {}
) => {
    const [isRest, setIsRest] = useState(true)
    const [prevValue, setPrevValue] = useState(to)
    const [props, set] = useSpring(() => ({
        value: to,
        onRest: () => setIsRest(true),
        config
    }))
    useEffect(() => {
        if (prevValue !== to) {
            setPrevValue(to)
            setIsRest(false)
            set({ value: to })
        }
    }, [to])
    return [props.value, isRest]
}

export default useAnimatedValue
