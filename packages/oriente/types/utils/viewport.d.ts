export interface ViewportMeasurements {
    scrollTop: number;
    scrollLeft: number;
    height: number;
    width: number;
}
export declare type ViewportObserverCallback = (m: ViewportMeasurements) => void;
export interface ViewportObserver {
    observe: () => void;
    unobserve: () => void;
}
declare const measureViewport: () => {
    scrollTop: number;
    scrollLeft: number;
    height: number;
    width: number;
};
declare const observeViewport: (cb: ViewportObserverCallback) => {
    observe(): void;
    unobserve(): void;
};
export { observeViewport, measureViewport };
