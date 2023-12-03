import React from 'react';
import { SpringConfig } from 'react-spring';
import { StyleProps } from './styles';
import { AnimationFunction } from './animation';
import { PopupPlacement } from './PopupController';
export interface TooltipProps extends StyleProps<[TooltipProps]> {
    /** Content of the tooltip */
    tooltip: React.ReactNode;
    /** Target element for the tooltip */
    children: React.ReactElement<any> | (() => React.ReactNode);
    /** Placement of the tooltip relative to the target */
    placement?: Partial<PopupPlacement>;
    /** Tooltip will show and hide on tap on the target element */
    showOnTap?: boolean;
    /** Tooltip will show when the target element is hovered */
    showOnHover?: boolean;
    /** Tooltip will show when the target element is focused */
    showOnFocus?: boolean;
    /** Delay in ms before showing the tooltip after the show event */
    showDelay?: number;
    /**
     * Delay in ms before hiding the tooltip after the hide event.
     * Hide will be cancelled if you will hover the tooltip when `showOnHover`
     * is `true`. This is useful, when you want to allow copying text
     * from the tooltip or clicking a link in it.
     */
    hideDelay?: number;
    /** Component for hide and show animation */
    animation?: AnimationFunction;
    /** Config for `react-spring` animation */
    springConfig?: SpringConfig;
}
export interface TooltipArrowProps extends StyleProps<[TooltipArrowProps]>, React.HTMLProps<HTMLDivElement> {
    /** Width of the arrow, for the orientation like this: "^" */
    width: number | string;
    /** Height of the arrow */
    height: number | string;
    /** Margin between arrow and tooltip's corner */
    margin: number | string;
    /** Color of the arrow */
    color: string;
}
declare const TooltipArrow: {
    (props: TooltipArrowProps): import("react/jsx-runtime").JSX.Element;
    defaultProps: {
        width: number;
        height: number;
        margin: number;
        color: string;
    };
};
declare const Tooltip: {
    (_props: TooltipProps): import("react/jsx-runtime").JSX.Element;
    defaultProps: {
        showDelay: number;
        hideDelay: number;
        showOnHover: boolean;
        showOnFocus: boolean;
        showOnTap: boolean;
        placement: {
            side: string;
            align: string;
            offset: number;
        };
        animation: AnimationFunction;
        springConfig: {
            tension: number;
            friction: number;
        };
    };
};
export { TooltipArrow, Tooltip };
