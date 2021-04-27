import React, { useMemo, createContext, useContext } from 'react'
// @ts-ignore
import Taply from 'taply'
import { useStyles, FloralProps, FloralStyles } from 'floral'

const closeButtonStyles: FloralStyles = {
    root: {
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        width: '1rem',
        height: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
    }
}

interface CloseButtonProps extends FloralProps<CloseButtonProps> {
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
