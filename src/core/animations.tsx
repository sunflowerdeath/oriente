import React, { forwardRef } from 'react'
import { animated, useTransition } from 'react-spring'
import { useMeasure } from 'react-use'

interface AppearAnimationProps extends React.HTMLProps<HTMLDivElement> {
    openValue: any
    children: React.ReactNode
}

export type AppearAnimation = (props: AppearAnimationProps) => React.ReactNode

const FadeAnimation = forwardRef<HTMLDivElement>(
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

FadeAnimation.displayName = 'FadeAnimation'

interface SlideAnimationProps extends AppearAnimationProps {
    side?: 'top' | 'right' | 'left' | 'bottom'
    distance?: number
}

const SlideAnimation = forwardRef((props: SlideAnimationProps, ref) => {
    let {
        children,
        openValue,
        side = 'bottom',
        distance = 10,
        style,
        ...restProps
    } = props
    let axis = side === 'left' || side === 'right' ? 'X' : 'Y'
    let dir = side === 'left' || side === 'bottom' ? 1 : -1
    let resStyle = {
        ...style,
        opacity: openValue,
        transform: openValue
            .interpolate([0, 1], [distance * dir, 0])
            .interpolate((v: number) => `translate${axis}(${v}px)`)
    }
    return (
        <animated.div {...restProps} ref={ref} style={resStyle}>
            {children}
        </animated.div>
    )
})

SlideAnimation.displayName = 'SlideAnimation'

const CollapseAnimation = ({
    openValue,
    children,
    ...restProps
}: AppearAnimationProps) => {
    let [ref, { height }] =
        'ResizeObserver' in window ? useMeasure() : [null, { height: -1 }]
    let style = { opacity: openValue, overflow: 'hidden', ...restProps.style }
    if (ref) style.height = openValue.interpolate({ output: [0, height] })
    return (
        <animated.div {...restProps} style={style}>
            {typeof children === 'function' ? (
                children(ref)
            ) : (
                // use display flex, so it measures margins of the children
                <div ref={ref} style={{ display: 'flex' }}>
                    {children}
                </div>
            )}
        </animated.div>
    )
}

CollapseAnimation.displayName = 'CollapseAnimation'

export interface AnimatedListProps<T> {
    items: Array<T>
    getId: (item: T) => any
    renderItem: (item: T, props: { open: any }, key: string) => React.ReactNode
    isDisabled?: boolean
}

const AnimatedList = <T extends unknown>(props: AnimatedListProps<T>) => {
    let { items, getId, renderItem, isDisabled } = props
    let transitions = useTransition(items, getId, {
        initial: { open: 1 },
        from: { open: 0 },
        enter: { open: 1 },
        leave: { open: 0 },
        unique: true,
        immediate: isDisabled
    })
    return <>{transitions.map(renderItem)}</>
}

export { FadeAnimation, SlideAnimation, CollapseAnimation, AnimatedList }
