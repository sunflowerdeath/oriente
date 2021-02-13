import React, {
    useRef,
    useMemo,
    useState,
    cloneElement,
    useEffect,
    useCallback,
    forwardRef
} from 'react'
import { useStyles } from 'floral'
import Taply from 'taply/lib/new'
import { useSpring, animated } from 'react-spring'

import mergeRefs from '../utils/mergeRefs'
import useControlledState from '../utils/useControlledState'

import {
    FloralProps,
    TapState,
    initialTapState,
    PopupPlacement
} from '../types'

import { Layer } from './layers'
import Popup from './Popup'

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

interface AppearAnimationProps extends React.HTMLProps<HTMLDivElement> {
    openValue: any
    children: React.ReactNode
}

type AppearAnimation = (props: AppearAnimationProps) => React.Node

const OpacityAnimation = forwardRef(
    (
        { children, openValue, style, ...restProps }: AppearAnimationProps,
        ref
    ) => (
        <animated.div
            ref={ref}
            style={{ ...style, opacity: openValue }}
            {...restProps}
        >
            {children}
        </animated.div>
    )
)

interface SlideAnimationProps extends AppearAnimationProps {
    side?: 'top' | 'right' | 'left' | 'bottom'
    distance?: number
}

const SlideAnimation = forwardRef(
    (
        {
            children,
            openValue,
            side = 'bottom',
            distance = 10,
            style,
            ...restProps
        }: AppearAnimationProps,
        ref
    ) => {
        let axis = side === 'left' || side === 'right' ? 'X' : 'Y'
        let dir = side === 'left' || side === 'bottom' ? 1 : -1
        let resStyle = {
            ...style,
            opacity: openValue,
            transform: openValue
                .interpolate([0, 1], [distance * dir, 0])
                .interpolate((v) => `translate${axis}(${v}px)`)
        }
        return (
            <animated.div {...restProps} ref={ref} style={resStyle}>
                {children}
            </animated.div>
        )
    }
)

// TODO animations, arrow

interface TooltipProps extends FloralProps {
    placement: PopupPlacement
    showOnTap: boolean
    showOnHover: boolean
    showOnFocus: boolean
    showDelay: number
    hideDelay: number
    tooltip: React.ReactNode
    children: React.ReactElement<any>
    Animation: AppearAnimation
}

const Tooltip = (props: TooltipProps) => {
    let {
        placement,
        showOnTap,
        showOnHover,
        showOnFocus,
        showDelay,
        hideDelay,
        tooltip,
        children,
        Animation
    } = props

    let [isOpen, setIsOpen] = useControlledState(props, 'isOpen', false)
    let styles = useStyles(null, [props, { isOpen }])
    let [tapState, setTapState] = useState<TapState>(initialTapState)
    let [tooltipTapState, setTooltipTapState] = useState<TapState>(
        initialTapState
    )
    let state = useRef('rest')
    let timer = useRef<number>()
    let [openValue, isRest] = useAnimatedValue(isOpen ? 1 : 0)

    let openWithDelay = useCallback(() => {
        if (state.current === 'opening') return
        state.current = 'opening'
        clearTimeout(timer.current)
        timer.current = window.setTimeout(
            () => setIsOpen(true),
            tooltipTapState.isHovered ? 0 : showDelay
        )
    }, [showDelay])

    let closeWithDelay = useCallback(() => {
        if (state.current === 'closing') return
        state.current = 'closing'
        clearTimeout(timer.current)
        timer.current = window.setTimeout(() => setIsOpen(false), hideDelay)
    }, [hideDelay])

    useEffect(() => {
        let openByFocus = showOnFocus && tapState.isFocused
        let openByHover =
            showOnHover && (tapState.isHovered || tooltipTapState.isHovered)
        let nextIsOpen = openByFocus || openByHover
        if (nextIsOpen !== isOpen) {
            if (nextIsOpen) openWithDelay()
            else closeWithDelay()
        }
    }, [tapState, tooltipTapState])

    useEffect(() => () => clearTimeout(timer.current), [])

    let onTap = useCallback(() => {
        if (showOnTap) setIsOpen((val) => !val)
    }, [])

    let popup = useCallback(
        (ref) => (
            <Taply onChangeTapState={setTooltipTapState}>
                <div ref={ref}>
                    <Animation openValue={openValue} style={styles.root}>
                        {tooltip}
                    </Animation>
                </div>
            </Taply>
        ),
        [tooltip]
    )

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

    return (
        <Popup isActive={isOpen || !isRest} placement={placement} popup={popup}>
            {target}
        </Popup>
    )
}

Tooltip.defaultProps = {
    showDelay: 150,
    hideDelay: 0,
    showOnHover: true,
    showOnFocus: true,
    showOnTap: false,
    placement: {
        side: 'top',
        align: 'center',
        offset: 5
    },
    Animation: SlideAnimation
}

export default Tooltip
