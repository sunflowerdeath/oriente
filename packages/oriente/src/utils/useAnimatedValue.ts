import React, { useState, useEffect } from 'react'
import { useSpring, SpringConfig } from 'react-spring'

import configs from './springConfigs'

interface AnimatedValueProps {
    config?: SpringConfig
}

const useAnimatedValue = (
    to: any,
    { config = configs.stiff }: AnimatedValueProps = {}
) => {
    const [isRest, setIsRest] = useState(false)
    const [props, set] = useSpring(() => ({
        value: to,
        onRest: () => setIsRest(true),
        config
    }))
    useEffect(() => {
        setIsRest(false)
        set({ value: to })
    }, [to])
    return [props.value, isRest]
}

export default useAnimatedValue
