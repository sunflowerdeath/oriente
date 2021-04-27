import React from 'react'
import { useStyles, FloralProps, FloralStyles } from 'floral'

// import { FloralProps } from './types'
import sheet from './utils/sheet'

export type FlexAlign = 'normal' | 'start' | 'end' | 'center' | 'stretch' | 'baseline'

export type FlexJustify =
    | 'normal'
    | 'start'
    | 'end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'

interface OwnFlexProps {
    children: React.ReactNode

    /** Flex direction */
    dir?: 'row' | 'col'

    /** Flex wrap */
    wrap?: boolean

    /** Flex align */
    align?: FlexAlign

    /** Flex justify */
    justify?: FlexJustify

    /** Gap between elements */
    gap?: string | number

    className?: string
}

export interface FlexProps
    extends OwnFlexProps,
        FloralProps<OwnFlexProps>,
        Omit<React.HTMLProps<HTMLDivElement>, 'wrap' | 'dir' | 'children' | 'style'> {}

const css = sheet({
    classNames: ['row', 'col', 'wrapper'],
    css: (map) => `
        .${map.row} > .${map.wrapper} > * + * { margin-left: var(--flex-gap) }
        .${map.col} > .${map.wrapper} > * + * { margin-top: var(--flex-gap) }`
})

const justifyMap: { [key in FlexJustify]?: string } = {
    end: 'flex-end',
    start: 'flex-start'
}

const flexStyles = ({ dir, wrap, align, justify, gap }: FlexProps): FloralStyles => ({
    root: {
        display: 'flex',
        flexDirection: dir === 'col' ? 'column' : 'row',
        flexWrap: wrap ? 'wrap' : 'nowrap',
        alignItems: align,
        justifyContent: justifyMap[justify!] || justify
    },
    /*
    Flex uses wrapper, so when flex is nested in flex it does not override gap:

    Incorrect:
    .flex { --gap: <value> }
      <child> { margin-top: var(--gap); }
      .flex { --gap: <new-value>; margin-top: var(--gap); } <- has invalid margin
      
    Correct:
    .flex
      .wrapper { --gap: <value> }
      <child> { margin-top: var(--gap); }
      .flex { margin-top: var(--gap); }
        .wrapper { --gap: <new-value>; }
    */
    wrapper: {
        display: 'contents',
        '--flex-gap': gap
    } as React.CSSProperties
})

const cx = (...classes: (string | undefined)[]) => classes.filter((c) => !!c).join(' ')

const Flex = (props: FlexProps) => {
    const {
        dir,
        wrap,
        align,
        justify,
        gap,
        style,
        styles: _,
        className,
        children,
        ...restProps
    } = props
    const styles = useStyles(flexStyles, [props])
    return (
        <div
            style={styles.root}
            className={cx(dir === 'row' ? css.row : css.col, className)}
            {...restProps}
        >
            <div className={css.wrapper} style={styles.wrapper}>
                {children}
            </div>
        </div>
    )
}

Flex.defaultProps = {
    dir: 'row',
    wrap: false,
    align: 'normal',
    justify: 'normal',
    gap: 0
}

export { Flex }
