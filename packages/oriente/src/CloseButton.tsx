import React, { useMemo, createContext, useContext } from "react"

import { useTaply } from "./taply"
import { useStyles, StyleProps, StyleMap } from "./styles"

const closeButtonStyles: StyleMap = {
    root: {
        position: "absolute",
        top: "1rem",
        right: "1rem",
        width: "1rem",
        height: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
    },
}

interface CloseButtonProps extends StyleProps<CloseButtonProps> {
    children: React.ReactNode
    onClick: () => void
}

const CloseButton = (props: CloseButtonProps) => {
    const { children, onClick } = props
    const { tapState, render } = useTaply({ onClick })
    const styles = useStyles(closeButtonStyles, [props, tapState])
    return render((attrs, ref) => (
        <div style={styles.root} ref={ref} {...attrs}>
            {children}
        </div>
    ))
}

CloseButton.defaultProps = {
    children: "✕",
}

export default CloseButton
