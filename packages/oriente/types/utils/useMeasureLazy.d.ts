interface Rect {
    width: number;
    height: number;
}
declare const useMeasureLazy: ({ isEnabled }: {
    isEnabled: boolean;
}) => [(elem: Element | null) => void, Rect];
export default useMeasureLazy;
