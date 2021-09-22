import React, { forwardRef } from 'react'
import { animated, useTransition } from 'react-spring'
import { useMeasure } from 'react-use'

export interface AppearAnimationProps extends React.HTMLProps<HTMLDivElement> {
    openValue: any
    children: React.ReactNode
    [key: string]: any
}

export type AppearAnimation = (props: AppearAnimationProps) => React.ReactElement

const FadeAnimation = forwardRef<HTMLDivElement, AppearAnimationProps>(
    ({ children, openValue, style, ...restProps }: AppearAnimationProps, ref) => (
        <animated.div ref={ref} style={{ ...style, opacity: openValue }} {...restProps}>
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
    const {
        children,
        openValue,
        side = 'bottom',
        distance = 10,
        style,
        ...restProps
    } = props
    const axis = side === 'left' || side === 'right' ? 'X' : 'Y'
    const dir = side === 'right' || side === 'bottom' ? 1 : -1
    const resStyle = {
        ...style,
        opacity: openValue,
        transform: openValue
            .to([0, 1], [distance * dir, 0])
            .to((v: number) => `translate${axis}(${v}px)`)
    }
    return (
        <animated.div {...restProps} ref={ref} style={resStyle}>
            {children}
        </animated.div>
    )
})

SlideAnimation.displayName = 'SlideAnimation'

const scaleOrigin = {
    center: '50% 50%',
    top: '50% 0',
    bottom: '50% 100%',
    left: '0 50%',
    right: '100% 50%',
    'top-left': '0 0',
    'top-right': '100% 0',
    'bottom-left': '0 100%',
    'bottom-right': '100% 100%'
}

interface ScaleAnimationProps extends AppearAnimationProps {
    side?: keyof typeof scaleOrigin
    initialScale?: number
}

const ScaleAnimation = forwardRef((props: ScaleAnimationProps, ref) => {
    const { children, openValue, side, initialScale, style, ...restProps } = props
    const resStyle = {
        ...style,
        opacity: openValue,
        transformOrigin: scaleOrigin[side!],
        transform: openValue
            .interpolate([0, 1], [initialScale, 1])
            .interpolate((v: number) => `scale(${v})`)
    }
    return (
        <animated.div {...restProps} ref={ref} style={resStyle}>
            {children}
        </animated.div>
    )
})

ScaleAnimation.defaultProps = {
    side: 'center',
    initialScale: 0.66
}

ScaleAnimation.displayName = 'ScaleAnimation'

const CollapseAnimation = ({
    openValue,
    children,
    ...restProps
}: AppearAnimationProps) => {
    const [ref, { height }] =
        'ResizeObserver' in window ? useMeasure() : [null, { height: -1 }]
    const style = { ...restProps.style }
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

export { FadeAnimation, SlideAnimation, ScaleAnimation, CollapseAnimation }
