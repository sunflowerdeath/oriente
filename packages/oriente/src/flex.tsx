import React from 'react'
//@ts-ignore
import { useStyles } from 'floral'

import { FloralProps } from './types'
import sheet from './utils/sheet'

const css = sheet({
    classNames: ['row', 'col', 'wrapper'],
    css: (map) => `
        .${map.row} > .${map.wrapper} > * + * { margin-left: var(--flex-gap) }
        .${map.col} > .${map.wrapper} > * + * { margin-top: var(--flex-gap) }`
})

type FlexAlign = 'normal' | 'start' | 'end' | 'center' | 'stretch' | 'baseline'

type FlexJustify =
    | 'normal'
    | 'start'
    | 'end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'

interface FlexProps extends FloralProps, Omit<React.HTMLProps<HTMLDivElement>, 'wrap'> {
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

const justifyMap: { [key in FlexJustify]?: string } = {
    end: 'flex-end',
    start: 'flex-start'
}

let flexStyles = ({ dir, wrap, align, justify, gap }: FlexProps) => ({
    root: {
        display: 'flex',
        flexDirection: dir === 'col' ? 'column' : 'row',
        flexWrap: wrap ? 'wrap' : 'no-wrap',
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
    }
})

const cx = (...classes: (string | undefined)[]) => classes.filter((c) => !!c).join(' ')

const Flex = (props: FlexProps) => {
    let { dir, wrap, align, justify, gap, style, ...restProps } = props
    let { className, children, ...elemProps } = restProps // omit floral
    let styles = useStyles(flexStyles, [props])
    return (
        <div
            style={styles.root}
            className={cx(dir === 'row' ? css.row : css.col, className)}
            {...elemProps}
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
