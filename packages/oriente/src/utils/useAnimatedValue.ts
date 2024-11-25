import { useState, useLayoutEffect } from 'react'
import { useSpring, SpringConfig } from 'react-spring'

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
    const [props, api] = useSpring(() => ({
        value: to,
        onRest: () => setIsRest(true),
        config
    }))
    useLayoutEffect(() => {
        if (prevValue !== to) {
            setPrevValue(to)
            setIsRest(false)
            // console.log("API", api)
            api.start({ value: to })
        }
    }, [to])
    return [props.value, isRest]
}

export default useAnimatedValue
