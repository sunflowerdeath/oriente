export interface Descendant<T> {
    element: HTMLElement;
    props: T;
}
declare class DescendantsManager<T> {
    items: Descendant<T>[];
    register({ element, ...props }: Descendant<T>): void;
    unregister(element: HTMLElement): void;
}
declare const useDescendants: <T>() => DescendantsManager<T>;
declare const useDescendant: <T>(descendants: DescendantsManager<T>, props: T) => {
    ref: (value: any) => void;
    index: number;
};
export { useDescendants, useDescendant, DescendantsManager };
