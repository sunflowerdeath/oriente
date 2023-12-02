import React, { forwardRef } from 'react'
import { useStyles, useTaply, TapState, mergeRefs } from 'oriente'

const buttonStyles = (props: ExampleButtonProps, tapState: TapState) => ({
    root: {
        background: '#444',
        outline: 'none',
        boxShadow: tapState.isFocused ? '0 0 0 2px #f06292' : 'none',
        height: 40,
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0 8px'
    }
})

interface ExampleButtonProps {
    onTap: () => void
    children: React.ReactNode
}

const ExampleButton = forwardRef((props: ExampleButtonProps, ref) => {
    const { children, onTap } = props
    const { tapState, render } = useTaply({ onClick: onTap })
    const styles = useStyles(buttonStyles, [props, tapState])
    return render((attrs, taplyRef) => (
        <div {...attrs} ref={mergeRefs(ref, taplyRef)} style={styles.root}>
            {children}
        </div>
    ))
})

export default ExampleButton
