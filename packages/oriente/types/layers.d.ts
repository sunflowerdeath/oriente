/// <reference types="react" />
export declare type LayerType = 'initial' | 'popup' | 'fixed' | 'modal' | 'global';
export interface LayerProps {
    /** Controls the visibility of the layer. */
    isActive: boolean;
    /**
     * Layer type. It is used to sort layers in the stack.
     *
     * Possible layer types in order from bottom to top:
     * `'initial'`, `'popup'`, `'fixed'`, `'modal'`, `'global'`.
     */
    type: LayerType;
    /**
     * Content of the layer
     */
    children: React.ReactNode;
}
export interface StackProps {
    children: React.ReactNode;
}
interface LayerViewProps {
    id: number;
    children: React.ReactNode;
    type: LayerType;
}
declare const LayerView: import("react").MemoExoticComponent<({ id, children, type }: LayerViewProps) => import("react/jsx-runtime").JSX.Element>;
declare const Layer: import("react").MemoExoticComponent<(props: LayerProps) => import("react/jsx-runtime").JSX.Element>;
declare const Stack: ({ children }: StackProps) => import("react/jsx-runtime").JSX.Element;
export { Stack, Layer, LayerView };
