import { useState, forwardRef, useEffect, useLayoutEffect, useRef } from 'react'
import { useSpring, animated, SpringConfig, SpringValue } from 'react-spring'
import { useMeasure } from 'react-use'

export type AnimationFunction = (value: any, props?: object) => object

export interface FadeProps {
    initialOpacity?: number
}

export interface TranslateProps {
    vert?: number
    horiz?: number
}

export type Side = 'top' | 'left' | 'bottom' | 'right'

export interface SlideProps {
    side?: Side
    distance?: number
}

const origins = {
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

export type ScaleOrigin = keyof typeof origins

export interface ScaleProps {
    initialScale?: number
    origin?: keyof typeof origins
}

const fade: AnimationFunction = (
    value,
    { initialOpacity = 0 }: FadeProps = {}
) => {
    return { opacity: value.to([0, 1], [initialOpacity, 1]) }
}
const translate: AnimationFunction = (
    value,
    { vert = 0, horiz = 0 }: TranslateProps = {}
) => ({
    translateX: value.to([0, 1], [horiz, 0]),
    translateY: value.to([0, 1], [vert, 0])
})

const slide: AnimationFunction = (
    value,
    { side = 'top', distance = 10 }: SlideProps = {}
) => {
    const axis = side === 'left' || side === 'right' ? 'horiz' : 'vert'
    const dir = side === 'right' || side === 'bottom' ? 1 : -1
    return translate(value, { [axis]: distance * dir })
}

const scale: AnimationFunction = (
    value,
    { initialScale = 0, origin = 'center' }: ScaleProps = {}
) => ({
    transformOrigin: origins[origin],
    transform: value
        .interpolate([0, 1], [initialScale, 1])
        .interpolate((v: number) => `scale(${v})`)
})

const compose =
    (fns: AnimationFunction[], props?: object): AnimationFunction =>
    (value: any) => {
        const res = {}
        fns.forEach((fn) => Object.assign(res, fn(value, props)))
        return res
    }

const animationFunctions = { fade, translate, slide, scale, compose }

const animationPresets = {
    slideDown: compose([fade, translate], { vert: -10 }),
    slideUp: compose([fade, translate], { vert: 10 }),
    slideRight: compose([fade, translate], { horiz: -20 }),
    slideLeft: compose([fade, translate], { horiz: 20 }),
    scale: compose([fade, scale], { initialScale: 0.66 })
}

const springConfigs = {
    normal: { tension: 180, friction: 26 },
    stiffer: { tension: 240, friction: 26 },
    stiff: { tension: 300, friction: 26 },
    stiffest: { tension: 450, friction: 26 }
}

interface AnimatedValueProps {
    config?: SpringConfig
}

const useAnimatedValue = (
    to: any,
    { config = springConfigs.stiff }: AnimatedValueProps = {}
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
            api.start({ value: to })
        }
    }, [to])
    return [props.value, isRest]
}

interface AppearProps extends React.ComponentProps<typeof animated.div> {
    animation?: AnimationFunction
    config?: SpringConfig
    children?: React.ReactNode
    delay?: number
}

const appearDefaultProps = {
    animation: fade,
    delay: 0,
    config: springConfigs.normal
}

const Appear = forwardRef<HTMLDivElement, AppearProps>(
    (_props: AppearProps, ref) => {
        const props = _props as AppearProps & typeof appearDefaultProps
        const { children, animation, config, delay, style, ...restProps } =
            props
        const [spring, api] = useSpring(() => ({ value: 0, config }))
        const timeoutRef = useRef<ReturnType<typeof setTimeout>>()
        useEffect(() => {
            timeoutRef.current = setTimeout(
                () => api.start({ value: 1 }),
                delay
            )
            return () => {
                if (timeoutRef.current) clearTimeout(timeoutRef.current)
            }
        }, [])
        const animatedStyle = animation(spring.value)
        return (
            <animated.div
                ref={ref}
                style={{ ...style, ...animatedStyle }}
                {...restProps}
            >
                {children}
            </animated.div>
        )
    }
)

Appear.defaultProps = appearDefaultProps
Appear.displayName = 'Appear'

export interface CollapseAnimationProps
    extends React.HTMLAttributes<HTMLDivElement> {
    openValue: SpringValue
    children?: React.ReactNode
}

const CollapseAnimation = forwardRef<HTMLDivElement, CollapseAnimationProps>(
    (props: CollapseAnimationProps, ref) => {
        const { openValue, children, ...restProps } = props
        const [measureRef, { height }] =
            'ResizeObserver' in window ? useMeasure() : [null, { height: -1 }]
        const style: any = { overflowY: 'hidden', ...restProps.style }
        if ('ResizeObserver' in window) {
            style.height = openValue.to({ output: [0, height] })
        }
        return (
            <animated.div ref={ref} {...restProps} style={style}>
                {/* use display flex, so it measures margins of the children */}
                <div ref={measureRef as any} style={{ display: 'flex' }}>
                    {children}
                </div>
            </animated.div>
        )
    }
)

CollapseAnimation.displayName = 'Collapse'

export interface OpenAnimationProps
    extends React.HTMLAttributes<HTMLDivElement> {
    openValue: SpringValue
    fn: AnimationFunction
    props?: object
    children?: React.ReactNode
}

const OpenAnimation = forwardRef<HTMLDivElement, OpenAnimationProps>(
    (props, ref) => {
        const { children, openValue, fn, style, ...restProps } = props
        return (
            <animated.div
                ref={ref}
                style={{ ...style, ...fn(openValue, props.props) }}
                {...restProps}
            >
                {children}
            </animated.div>
        )
    }
)

export {
    useAnimatedValue,
    animationFunctions,
    animationPresets,
    Appear,
    OpenAnimation,
    CollapseAnimation
}
