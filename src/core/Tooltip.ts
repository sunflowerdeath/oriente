import React, {
    useRef,
    useMemo,
    useState,
    cloneElement,
    useEffect,
    useCallback
} from 'react'
import { useStyles } from 'floral'
import Taply from 'taply/lib/new'
import { useSpring, animated } from 'react-spring'

import Animated from 'animated/lib/targets/react-dom'

import mergeRefs from '../utils/mergeRefs'
import useControlledState from '../utils/useControlledState'

import { FloralProps, TapState, PopupPlacement } from '../types'

import { Layer } from './layers'
import Popup from './Popup'

const useAnimatedValue = (to: any) => {
    let value = useMemo(() => new Animated.Value(to), [])
    let [isRest, setIsRest] = useState(false)
    useEffect(() => {
        setIsRest(false)
        value.stopAnimation()
        Animated.spring(value, { toValue: to }).start(() => {
            setIsRest(true)
        })
    }, [to])
    return [value.current, isRest]
}

// TODO animations, showOnTap, showOnFocus, show on hover tooltip

interface TooltipProps extends FloralProps {
    placement: PopupPlacement
    showOnTap: boolean
    showOnHover: boolean
    showOnFocus: boolean
    showTimeout: number
    hideTimeout: number
    tooltip: React.ReactNode
    children: React.ReactElement<any>
}

const Tooltip = (props: TooltipProps) => {
    let {
        placement,
        showOnTap,
        showOnHover,
        showOnFocus,
        showTimeout,
        hideTimeout,
        tooltip,
        children
    } = props
    let [isOpen, setIsOpen] = useControlledState(props, 'isOpen', false)
    let styles = useStyles(null, [props, { isOpen }])
    let closeTimerRef = useRef()
    let [tapState, setTapState] = useState({})
    let [tooltipTapState, setTooltipTapState] = useState({})
    let state = useRef('rest')
    let timer = useRef()
    let [openValue, isRest] = useAnimatedValue(isOpen ? 1 : 0)
    useEffect(() => {
        console.log(tapState, tooltipTapState)
        let openByFocus = showOnFocus && tapState.isFocused
        let openByHover =
            showOnHover && (tapState.isHovered || tooltipTapState.isHovered)
        let nextIsOpen = openByFocus || openByHover
        if (nextIsOpen !== isOpen) {
            if (nextIsOpen) {
                if (state.current === 'opening') return
                state.current = 'opening'
                clearTimeout(timer.current)
                timer.current = setTimeout(
                    () => {
                        state.current = 'rest'
                        console.log('open')
                        setIsOpen(true)
                    },
                    tooltipTapState.isHovered ? 0 : showTimeout
                )
            } else {
                if (state.current === 'closing') return
                clearTimeout(timer.current)
                timer.current = setTimeout(() => {
                    state.current = 'rest'
                    setIsOpen(false)
                    console.log('close')
                }, hideTimeout)
            }
        }
        return () => clearTimeout(timer.current)
    }, [tapState, tooltipTapState])

    let onTap = () => {
        if (showOnTap) setIsOpen((val) => !val)
    }

    let popup = useCallback((ref) => (
        <Taply onChangeTapState={setTooltipTapState}>
            <div
                ref={ref}
                style={{
                    ...styles.root
                }}
            >
                {tooltip}
            </div>
        </Taply>
    ))

    let target = (popupRef) =>
        typeof children === 'function' ? (
            children({ onChangeTapState: setTapState, onTap, popupRef })
        ) : (
            <Taply onChangeTapState={setTapState} onTap={onTap}>
                {(taplyState, taplyRef) =>
                    cloneElement(children, {
                        ref: mergeRefs(children.ref, popupRef, taplyRef)
                    })
                }
            </Taply>
        )

    console.log('render', isOpen, isRest)
    return (
        <Popup isActive={isOpen || !isRest} placement={placement} popup={popup}>
            {target}
        </Popup>
    )
}

Tooltip.defaultProps = {
    showTimeout: 250,
    hideTimeout: 0,
    showOnHover: true,
    showOnFocus: true,
    showOnTap: false,
    placement: {
        side: 'top',
        align: 'center',
        offset: 5
    }
}

export default Tooltip
