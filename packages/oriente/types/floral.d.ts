declare module 'floral' {
    export interface FloralStyles {
        [key: string]: React.CSSProperties
    }

    export type FloralStylesDeclaration<P> =
        | ((props: P, ...deps: any[]) => FloralStyles)
        | FloralStyles

    export interface FloralProps<P> {
        style?: React.CSSProperties
        styles?: FloralStylesDeclaration<P>
    }

    export function useStyles<P>(
        styles: FloralStylesDeclaration<P>,
        deps: [P, ...any[]]
    ): FloralStyles
}
