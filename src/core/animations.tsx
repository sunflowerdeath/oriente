import React, { forwardRef } from 'react'
import { animated } from 'react-spring'

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

export { FadeAnimation, SlideAnimation }