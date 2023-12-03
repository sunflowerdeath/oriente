/// <reference types="react" />
export interface StyleProps<D extends any[] = []> {
    styles?: StyleDefinition<D>;
    style?: React.CSSProperties;
}
export declare type StyleMap = Record<string, React.CSSProperties>;
export declare type StyleFunc<D extends any[]> = (...deps: D) => StyleMap;
export declare type StyleDefinition<D extends any[]> = undefined | StyleMap | StyleFunc<D> | StyleDefinition<D>[];
declare const composeStyles: <D extends any[]>(...stylesList: StyleDefinition<D>[]) => StyleFunc<D>;
declare const useStyles: <P extends StyleProps<[P, ...R]>, R extends any[] = []>(styles: StyleDefinition<[P, ...R]>, [props, ...restDeps]: [P, ...R]) => StyleMap;
declare const omitStyleProps: <P extends object>(props: P) => Omit<P, "style" | "styles">;
export { composeStyles, useStyles, omitStyleProps };
