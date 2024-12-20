import React, {
    useRef,
    useState,
    cloneElement,
    useEffect,
    useCallback,
    useMemo,
    createContext,
    useContext
} from 'react'
import { SpringConfig } from 'react-spring'

import { useStyles, StyleProps, StyleMap } from './styles'
import { useTaply, TapState, initialTapState } from './taply'
import mergeRefs from './utils/mergeRefs'
import useControlledState from './utils/useControlledState'
import configs from './utils/springConfigs'
import {
    OpenAnimation,
    AnimationFunction,
    animationFunctions,
    useAnimatedValue
} from './animation'
import {
    oppositeSides,
    defaultPlacement,
    PopupSide,
    PopupAlign,
    PopupPlacement
} from './PopupController'
import { Popup } from './popup'

export type TooltipChildrenProps = {
    onChangeTapState: (tapState: TapState) => void
    onClick: () => void
    popupRef: React.Ref<HTMLElement>
}

export interface TooltipProps extends StyleProps<[TooltipProps]> {
    /** Content of the tooltip */
    tooltip: React.ReactNode

    /** Target element for the tooltip */
    children:
        | React.ReactElement<any>
        | ((props: TooltipChildrenProps) => React.ReactNode)

    /** Placement of the tooltip relative to the target */
    placement?: Partial<PopupPlacement>

    /** Tooltip will show and hide on tap on the target element */
    showOnTap?: boolean

    /** Tooltip will show when the target element is hovered */
    showOnHover?: boolean

    /** Tooltip will show when the target element is focused */
    showOnFocus?: boolean

    /** Delay in ms before showing the tooltip after the show event */
    showDelay?: number

    /**
     * Delay in ms before hiding the tooltip after the hide event.
     * Hide will be cancelled if you will hover the tooltip when `showOnHover`
     * is `true`. This is useful, when you want to allow copying text
     * from the tooltip or clicking a link in it.
     */
    hideDelay?: number

    /** Component for hide and show animation */
    animation?: AnimationFunction

    /** Config for `react-spring` animation */
    springConfig?: SpringConfig
}

export interface TooltipArrowProps
    extends StyleProps<[TooltipArrowProps]>,
        React.HTMLProps<HTMLDivElement> {
    /** Width of the arrow, for the orientation like this: "^" */
    width: number | string

    /** Height of the arrow */
    height: number | string

    /** Margin between arrow and tooltip's corner */
    margin: number | string

    /** Color of the arrow */
    color: string
}

interface TooltipContextProps {
    side: PopupSide
    align: PopupAlign
}

const TooltipContext = createContext<TooltipContextProps | undefined>(undefined)

const tooltipArrowStyles = (
    { width, height, margin, color }: TooltipArrowProps,
    { side, align }: TooltipContextProps
) => {
    const root: React.CSSProperties = { position: 'absolute' }

    const triangle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        fill: color
    }
    if (side === 'left' || side === 'top') triangle.transform = 'rotate(180deg)'

    if (side === 'top') root.bottom = 0
    else if (side === 'bottom') root.top = 0
    else if (side === 'left') root.left = 0
    else if (side === 'right') root.top = 0

    let translateAcross =
        side === 'left' || side === 'bottom' ? '-100%' : '100%'
    let translateAlong
    if (align === 'start') translateAcross = '0'
    else if (align === 'center') translateAlong = '-50%'
    else translateAlong = '-100%'

    if (side === 'top' || side === 'bottom') {
        root.width = width
        root.height = height
        if (align === 'start') root.left = margin
        else if (align === 'center') root.left = '50%'
        else if (align === 'end') root.right = margin
        root.transform = `translateY(${translateAcross}) translateX(${translateAlong})`
    } else {
        root.width = height
        root.height = width
        if (align === 'start') root.top = margin
        else if (align === 'center') root.top = '50%'
        else if (align === 'end') root.bottom = margin
        root.transform = `translateY(${translateAlong}) translateX(${translateAcross})`
    }

    return { root, triangle }
}

const tooltipArrowDefaultProps = {
    width: 16,
    height: 8,
    margin: 8,
    color: 'white'
}

const TooltipArrow = (inProps: TooltipArrowProps) => {
    const props = { ...tooltipArrowDefaultProps, ...inProps }
    const context = useContext(TooltipContext)
    if (!context) {
        throw new Error(
            'You can use <TooltipArrow> only inside <Tooltip> component'
        )
    }
    const styles = useStyles(tooltipArrowStyles, [props, context])
    const { width, height, margin, ...restProps } = props
    return (
        <div {...restProps} style={styles.root}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 10 10"
                preserveAspectRatio="none"
                style={styles.triangle}
            >
                {context.side === 'top' || context.side === 'bottom' ? (
                    // ^
                    <path d="M5 0L0 10H10L5 0Z" />
                ) : (
                    // >
                    <path d="M10 5L0 0V10L10 5Z" />
                )}
            </svg>
        </div>
    )
}

type TooltipState = 'closed' | 'willClose' | 'open' | 'willOpen'

const tooltipDefaultPlacement: Partial<PopupPlacement> = {
    side: 'top',
    align: 'center',
    offset: 8
}
const tooltipDefaultProps = {
    showDelay: 0, // 150,
    hideDelay: 0,
    showOnHover: true,
    showOnFocus: true,
    showOnTap: false,
    placement: tooltipDefaultPlacement,
    animation: animationFunctions.fade,
    springConfig: configs.stiff
}

const Tooltip = (inProps: TooltipProps) => {
    const props = { ...tooltipDefaultProps, ...inProps }
    const {
        placement,
        showOnTap,
        showOnHover,
        showOnFocus,
        showDelay,
        hideDelay,
        tooltip,
        children,
        animation,
        springConfig
    } = props

    const state = useRef<TooltipState>('closed')
    const [isOpen, setIsOpen] = useControlledState(props, 'isOpen', false)
    const styles = useStyles(undefined, [props, { isOpen }])

    const onClick = useCallback(() => {
        if (showOnTap) setIsOpen((val: boolean) => !val)
    }, [])

    const [tapState, setTapState] = useState(initialTapState)
    const targetTaply = useTaply({ onChangeTapState: setTapState })
    const tooltipTaply = useTaply({ onClick })

    const timer = useRef<number>()
    const [openValue, isRest] = useAnimatedValue(isOpen ? 1 : 0, {
        config: springConfig
    })
    const [side, setSide] = useState<PopupSide>('top')

    useEffect(() => {
        if (state.current === 'willOpen') state.current = 'open'
        else if (state.current === 'willClose') state.current = 'closed'
    }, [isRest])

    /*
    let isVert = placement.side === 'top' || placement.side === 'bottom'
    let isFlipped = isVert ? flip.vert : flip.horiz
    let arrowSide = isFlipped ? placement.side : oppositeSides[placement.side]
    */

    const openWithDelay = useCallback(() => {
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
            tooltipTaply.tapState.isHovered ? 0 : showDelay
        )
    }, [showDelay, tooltipTaply.tapState])

    const closeWithDelay = useCallback(() => {
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
        const openByFocus = showOnFocus && tapState.isFocused
        const openByHover =
            showOnHover &&
            (tapState.isHovered || tooltipTaply.tapState.isHovered)
        const nextIsOpen = openByFocus || openByHover
        if (nextIsOpen) openWithDelay()
        else closeWithDelay()
    }, [tapState, tooltipTaply.tapState])

    useEffect(() => () => clearTimeout(timer.current), [])

    // TODO get actual side (can be flipped?)
    const context = useMemo(
        () => ({ side, align: placement?.align || defaultPlacement.align }),
        [side, placement?.align]
    )

    const popup = useCallback(
        (ref: React.Ref<HTMLDivElement>) =>
            tooltipTaply.render((attrs, taplyRef) => (
                <div ref={mergeRefs(ref, taplyRef)} {...attrs}>
                    <OpenAnimation
                        fn={animation}
                        openValue={openValue}
                        style={styles.root}
                        props={{ side: oppositeSides[side] }}
                    >
                        <TooltipContext.Provider value={context}>
                            {tooltip}
                        </TooltipContext.Provider>
                    </OpenAnimation>
                </div>
            )),
        [tooltip, side, context, animation]
    )

    const target = (popupRef: React.Ref<HTMLElement>) =>
        typeof children === 'function'
            ? children({ onChangeTapState: setTapState, onClick, popupRef })
            : targetTaply.render((attrs, taplyRef) =>
                  cloneElement(children, {
                      // @ts-expect-error children ref
                      ref: mergeRefs(children.ref, popupRef, taplyRef),
                      ...attrs
                  })
              )

    return (
        <Popup
            isActive={isOpen || !isRest}
            placement={placement}
            popup={popup}
            onChangeSide={setSide}
        >
            {target}
        </Popup>
    )
}

export { TooltipArrow, Tooltip }
