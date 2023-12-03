/// <reference types="react" />
export interface TapState {
    isHovered: boolean;
    isPressed: boolean;
    isFocused: boolean;
}
export declare type TaplyRenderFn = (attrs: any, ref: any) => React.ReactElement | null;
export declare type TaplyProps = {
    onClick?: () => void;
    tapState?: TapState;
    onChangeTapState?: (tapState: TapState) => void;
    onFocus?: (event: FocusEvent) => void;
    onBlur?: (event: FocusEvent) => void;
    isDisabled?: boolean;
    preventFocusOnTap?: boolean;
    isFocusable?: boolean;
    isPinchable?: boolean;
    tabIndex?: number;
};
export declare const initialTapState: TapState;
declare const useTaply: (props: TaplyProps) => {
    tapState: TapState;
    render: (callback: TaplyRenderFn) => import("react").ReactElement<any, string | import("react").JSXElementConstructor<any>> | null;
};
export { useTaply };
