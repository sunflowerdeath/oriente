/// <reference types="react" />
import { PopupPlacement, PopupSide } from './PopupController';
export interface PopupProps {
    /** Controls visibility of the popup. */
    isActive: boolean;
    /** Target element, or a function that takes `ref` and returns an element. */
    children: React.ReactElement | ((ref: any) => React.ReactNode);
    /** Popup element, or a function that takes `ref` and returns an element. */
    popup: React.ReactElement | ((ref: any) => React.ReactNode);
    /**
     * An object that configures placement of the popup with the following properties:
     * - **side** `'bottom'|'top'|'left'|'right'` – At which side of the target to place
     *   the popup. Default is `'bottom'`.
     * - **align** `'start'|'center'|'end'` – Alignment of the popup relative to the target.
     *   Default is `'start'`.
     * - **offset** `number` – Offset of the popup from the target. Default is `0`.
     * - **flip** `boolean` – Whether to allow flipping side and placement when original
     *   placement doesn't fit in the viewport. Default is `true`.
     * - **constrain** `boolean` – Whether to constrain the popup inside the viewport when
     *   it can not fit in. Default is `false`.
     * - **padding** `boolean` – Maximum allowed distance from the popup element
     *   to the side of the viewport. Default is `0`.
     */
    placement?: Partial<PopupPlacement>;
    onChangeSide?: (side: PopupSide) => void;
}
declare const Popup: import("react").ForwardRefExoticComponent<PopupProps & import("react").RefAttributes<unknown>>;
export { Popup };
