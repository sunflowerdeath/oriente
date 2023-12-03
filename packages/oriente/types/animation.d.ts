/// <reference types="react" />
import { animated, SpringConfig, SpringValue } from 'react-spring';
export declare type AnimationFunction = (value: any, props?: object) => object;
export interface FadeProps {
    initialOpacity?: number;
}
export interface TranslateProps {
    vert?: number;
    horiz?: number;
}
export declare type Side = 'top' | 'left' | 'bottom' | 'right';
export interface SlideProps {
    side?: Side;
    distance?: number;
}
declare const origins: {
    center: string;
    top: string;
    bottom: string;
    left: string;
    right: string;
    'top-left': string;
    'top-right': string;
    'bottom-left': string;
    'bottom-right': string;
};
export declare type ScaleOrigin = keyof typeof origins;
export interface ScaleProps {
    initialScale?: number;
    origin?: keyof typeof origins;
}
declare const animationFunctions: {
    fade: AnimationFunction;
    translate: AnimationFunction;
    slide: AnimationFunction;
    scale: AnimationFunction;
    compose: (fns: AnimationFunction[], props?: object) => AnimationFunction;
};
declare const animationPresets: {
    slideDown: AnimationFunction;
    slideUp: AnimationFunction;
    slideRight: AnimationFunction;
    slideLeft: AnimationFunction;
    scale: AnimationFunction;
};
interface AnimatedValueProps {
    config?: SpringConfig;
}
declare const useAnimatedValue: (to: any, { config }?: AnimatedValueProps) => any[];
interface AppearProps extends React.ComponentProps<typeof animated.div> {
    animation?: AnimationFunction;
    config?: SpringConfig;
    children?: React.ReactNode;
    delay?: number;
}
declare const Appear: import("react").ForwardRefExoticComponent<Omit<AppearProps, "ref"> & import("react").RefAttributes<HTMLDivElement>>;
export interface CollapseAnimationProps extends React.HTMLAttributes<HTMLDivElement> {
    openValue: SpringValue;
    children?: React.ReactNode;
}
declare const CollapseAnimation: import("react").ForwardRefExoticComponent<CollapseAnimationProps & import("react").RefAttributes<HTMLDivElement>>;
export interface OpenAnimationProps extends React.HTMLAttributes<HTMLDivElement> {
    openValue: SpringValue;
    fn: AnimationFunction;
    props?: object;
    children?: React.ReactNode;
}
declare const OpenAnimation: import("react").ForwardRefExoticComponent<OpenAnimationProps & import("react").RefAttributes<HTMLDivElement>>;
export { useAnimatedValue, animationFunctions, animationPresets, Appear, OpenAnimation, CollapseAnimation };
