import { forwardRef } from 'react'
import { omit } from 'lodash-es'

import { useStyles, StyleProps, StyleMap } from './styles'

const aliases: Record<string, string> = {
    end: 'flex-end',
    start: 'flex-start'
}

type DivProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'style'>

export interface FlexProps extends DivProps, StyleProps<[FlexProps]> {
    /** Flex direction */
    dir: 'col' | 'row'

    /** Gap between elements */
    gap?: string | number

    /** Flex wrap */
    wrap?: boolean

    /** Flex align */
    align?: string

    /** Flex justify */
    justify?: string

    children: React.ReactNode
}

const flexStyles = (props: FlexProps & typeof flexDefaultProps): StyleMap => {
    const { dir, gap, align, justify, wrap } = props
    return {
        root: {
            display: 'flex',
            alignItems: align && (aliases[align] ?? align),
            justifyContent: justify && (aliases[justify] ?? justify),
            flexDirection: dir === 'col' ? 'column' : 'row',
            gap,
            flexWrap: wrap ? 'wrap' : 'nowrap'
        }
    }
}

const flexDefaultProps = {
    dir: 'col',
    wrap: false,
    align: 'start'
}

const Flex = forwardRef<HTMLDivElement, FlexProps>((inProps: FlexProps, ref) => {
    const props = { ...flexDefaultProps, ...inProps }
    const rest = omit(props, 'dir', 'gap', 'align', 'justify', 'wrap')
    const styles = useStyles(flexStyles, [props])
    return <div ref={ref} {...rest} style={styles.root} />
})

const Row = forwardRef<HTMLDivElement, Omit<FlexProps, 'dir'>>((props, ref) => (
    <Flex ref={ref} {...props} dir="row" />
))

const Col = forwardRef<HTMLDivElement, Omit<FlexProps, 'dir'>>((props, ref) => (
    <Flex ref={ref} {...props} dir="col" />
))

export { Flex, Row, Col }
