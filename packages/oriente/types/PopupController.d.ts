import observeRect from '@reach/observe-rect';
import type { ViewportMeasurements, ViewportObserver } from './utils/viewport';
export declare type PopupSide = 'left' | 'top' | 'right' | 'bottom';
export declare type PopupAlign = 'start' | 'center' | 'end';
export interface PopupPlacement {
    side: PopupSide;
    align: PopupAlign;
    offset: number;
    flip: boolean;
    constrain: boolean;
    padding: number;
}
export interface PopupOptions {
    target: HTMLElement;
    popup: HTMLElement;
    placement?: Partial<PopupPlacement>;
    onChangeSide?: (side: PopupSide) => void;
}
interface Position {
    left: number;
    top: number;
}
export declare const defaultPlacement: PopupPlacement;
export declare const oppositeSides: {
    [key in PopupSide]: PopupSide;
};
declare type RectObserver = ReturnType<typeof observeRect>;
declare class PopupController {
    constructor(options: PopupOptions);
    disableUpdate: boolean;
    popup: HTMLElement;
    target: HTMLElement;
    placement: PopupPlacement;
    onChangeSide?: (side: PopupSide) => void;
    viewportObserver: ViewportObserver;
    viewport: ViewportMeasurements;
    targetObserver: RectObserver;
    targetRect: DOMRect;
    popupObserver: RectObserver;
    popupRect: DOMRect;
    unobserve(): void;
    setOptions({ target, popup, placement, onChangeSide }: PopupOptions): void;
    updatePosition(): void;
    setPosition({ left, top }: Position): void;
}
export default PopupController;
