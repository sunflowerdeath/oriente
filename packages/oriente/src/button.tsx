import React, { useState, forwardRef } from 'react'
import { FloralProps, FloralStyles, useStyles } from 'floral'
import Taply from 'taply'

import { TapState, initialTapState } from './types'

const buttonStyles = (
    props: ButtonProps,
    tapState: TapState
): { [key: string]: React.CSSProperties } => ({
    root: {
        cursor: 'default',
        boxSizing: 'border-box',
        display: 'inline-block'
    }
})

interface ButtonProps
    extends FloralProps<ButtonProps>,
        Omit<React.HTMLAttributes<HTMLElement>, 'style'> {
    children: React.ReactNode
    isDisabled?: boolean
    onTap?: () => void
}

const Button = forwardRef((props: ButtonProps, ref) => {
    const { isDisabled, children, onTap } = props
    const [tapState, setTapState] = useState(initialTapState)
    const styles = useStyles(buttonStyles, [props, tapState])

    return (
        <Taply isDisabled={isDisabled} onTap={onTap} onChangeTapState={setTapState}>
            <div ref={ref} style={styles.root}>
                {props.children}
            </div>
        </Taply>
    )
})

export { Button }
