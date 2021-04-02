import React, { useMemo, createContext, useContext } from 'react'
// @ts-ignore
import Taply from 'taply'
// @ts-ignore
import { useStyles } from 'floral'

import { FloralProps } from '../types'

const closeButtonStyles = {
    root: {
        cursor: 'pointer',
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        width: '1rem',
        height: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}

interface CloseButtonProps extends FloralProps {
    children: React.ReactNode
    onTap: () => void
}

const CloseButton = (props: CloseButtonProps) => {
    const { children, onTap } = props
    const styles = useStyles(closeButtonStyles, [props])
    return (
        <Taply onTap={onTap}>
            <div style={styles.root}>{children}</div>
        </Taply>
    )
}

CloseButton.defaultProps = {
    children: '✕'
}

export default CloseButton
