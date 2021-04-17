import React, {
    useRef,
    useState,
    cloneElement,
    useEffect,
    useCallback
} from 'react'
// @ts-ignore
import { useStyles } from 'floral'
// @ts-ignore
import Taply from 'taply'

import mergeRefs from '../utils/mergeRefs'
import useControlledState from '../utils/useControlledState'
import useAnimatedValue from '../utils/useAnimatedValue'
import { AppearAnimation, SlideAnimation } from './animations'

import {
    FloralProps,
    TapState,
    initialTapState,
    PopupPlacement
} from '../types'

import Popup from './Popup'

interface TooltipArrowProps
    extends Omit<React.HTMLProps<HTMLDivElement>, 'style'>,
        FloralProps {
    /**
     * Side of the tooltip
     */
    side: 'top' | 'bottom' | 'left' | 'right'
    /** // Align of the arrow on the tooltip's side */
    align: 'begin' | 'center' | 'end'
    /** Width of the arrow, for the orientation like this: "/\" */
    width: number | string
    // Height of the arrow
    height: number | string
    // Margin between arrow and tooltip's corner
    margin: number | string
}

const tooltipArrowStyles = ({
    side,
    align,
    width,
    height,
    margin
}: TooltipArrowProps) => {
    let style: React.CSSProperties = {}

    if (side === 'top') style.top = 0
    else if (side === 'bottom') style.bottom = 0
    else if (side === 'left') style.right = 0
    else if (side === 'right') style.left = 0

    let translateAcross = side === 'right' || side === 'top' ? '-100%' : 0
    let translateAlong
    if (align === 'begin') translateAcross = '0'
    else if (align === 'center') translateAlong = '-50%'
    else translateAlong = '-100%'

    if (side === 'top' || side === 'bottom') {
        style.width = width
        style.height = height
        if (align === 'begin') style.left = margin
        else if (align === 'center') style.left = '50%'
        else if (align === 'end') style.right = margin
        style.transform = `translateX(${translateAcross}) translateY(${translateAlong})`
    } else {
        style.width = height
        style.height = width
        if (align === 'begin') style.top = margin
        else if (align === 'center') style.top = '50%'
        else if (align === 'end') style.bottom = margin
        style.transform = `translateX(${translateAlong}) translateY(${translateAcross})`
    }

    return { root: style }
}

const TooltipArrow = (props: TooltipArrowProps) => {
    let styles = useStyles(tooltipArrowStyles, [props])
    let { side, align, width, height, margin, ...restProps } = props
    return <div {...restProps} style={styles.root} />
}

interface TooltipProps extends FloralProps {
    /** Content of the tooltip */
    tooltip: React.ReactNode

    /** Target element for the tooltip */
    children: React.ReactElement<any>

    /** Placement of the tooltip relative to the target */
    placement: PopupPlacement

    /** Tooltip will show and hide on tap on the target element */
    showOnTap: boolean

    /** Tooltip will show when the target element is hovered */
    showOnHover: boolean

    /** Tooltip will show when the target element is focused */
    showOnFocus: boolean

    /** Delay in ms before showing the tooltip after the show event */
    showDelay: number

    /**
     * Delay in ms before hiding the tooltip after the hide event.
     * Hide will be cancelled if you will hover the tooltip when `showOnHover` is `true`.
     * This is useful, when you want to copy text from the tooltip or click a link in it.
     */
    hideDelay: number

    /** Component for hide and show animation */
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

    let state = useRef('closed')
    let [isOpen, setIsOpen] = useControlledState(props, 'isOpen', false)
    let styles = useStyles(null, [props, { isOpen }])
    let [tapState, setTapState] = useState<TapState>(initialTapState)
    let [tooltipTapState, setTooltipTapState] = useState<TapState>(
        initialTapState
    )
    let timer = useRef<number>()
    let [openValue, isRest] = useAnimatedValue(isOpen ? 1 : 0)

    /*
    let isVert = placement.side === 'top' || placement.side === 'bottom'
    let isFlipped = isVert ? flip.vert : flip.horiz
    let arrowSide = isFlipped ? placement.side : oppositeSides[placement.side]
    */

    let openWithDelay = useCallback(() => {
        if (state.current === 'open' || state.current === 'willOpen') return
        clearTimeout(timer.current)
        if (state.current === 'willClose') {
            state.current = 'open'
            return
        }
        state.current = 'willOpen'
        timer.current = setTimeout(
            () => {
                setIsOpen(true)
                state.current = 'open'
            },
            tooltipTapState.isHovered ? 0 : showDelay
        )
    }, [showDelay])

    let closeWithDelay = useCallback(() => {
        if (state.current === 'closed' || state.current === 'willClose') return
        clearTimeout(timer.current)
        if (state.current === 'willOpen') {
            state.current = 'closed'
            return
        }
        state.current = 'willClose'
        timer.current = setTimeout(() => {
            setIsOpen(false)
            state.current = 'closed'
        }, hideDelay)
    }, [hideDelay])

    useEffect(() => {
        let openByFocus = showOnFocus && tapState.isFocused
        let openByHover =
            showOnHover && (tapState.isHovered || tooltipTapState.isHovered)
        let nextIsOpen = openByFocus || openByHover
        if (nextIsOpen) openWithDelay()
        else closeWithDelay()
    }, [tapState, tooltipTapState])

    useEffect(() => () => clearTimeout(timer.current), [])

    let onTap = useCallback(() => {
        if (showOnTap) setIsOpen((val) => !val)
    }, [])

    let popup = useCallback(
        (ref) => (
            <div ref={ref}>
                <Taply onChangeTapState={setTooltipTapState}>
                    <Animation openValue={openValue} style={styles.root}>
                        {tooltip}
                    </Animation>
                </Taply>
            </div>
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
        offset: 8
    },
    Animation: SlideAnimation
}

export default Tooltip
