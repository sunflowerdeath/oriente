import React, { useState, cloneElement } from 'react'
import { useStyles } from 'floral'
import Taply from 'taply/lib/new'
import { capitalize } from 'lodash'

import { Layer } from './layers'
import Popup from './Popup'
import mergeRefs from '../utils/mergeRefs'

const Overlay = () => {
    return null
}

const useControlledState = (props, name, defaultState) => {
    let initialState = props[`initial${capitalize(name)}`]
    let [localState, setLocalState] = useState(
        initialState === undefined ? defaultState : initialState
    )
    let state = name in props ? props[name] : localState
    let setState = (value) => {
        if (name in props) {
            cb = props[`onChange${capitalize(name)}`]
            if (cb) cb(value)
        } else {
            setLocalState(value)
        }
    }
    return [state, setState]
}

const Tooltip = (props) => {
    let [isOpen, setIsOpen] = useControlledState(props, 'isOpen', false)
    let {
        placement,
        openOnTap,
        openOnHover,
        openOnFocus,
        openTimeout,
        closeTimeout,
        tooltip,
        children
    } = props
    let styles = useStyles(styles, [props, { isOpen }])

    let onChangeTapState = ({ isHovered, isPressed, isFocused }) => {
        let nextIsOpen = false
        if (openOnHover && isHovered) nextIsOpen = true
        if (isOpen !== nextIsOpen) setIsOpen(nextIsOpen)
    }

    let onTap = () => {
        if (openOnTap) setIsOpen((val) => !val)
    }

    let popup = (ref) => (
        <Layer isActive={true}>
            <div ref={ref} style={styles.root}>
                {tooltip}
            </div>
        </Layer>
    )
    let target = (popupRef) =>
        typeof children === 'function' ? (
            children({ onChangeTapState, onTap, popupRef })
        ) : (
            <Taply onChangeTapState={onChangeTapState} onTap={onTap}>
                {(taplyState, taplyRef) =>
                    cloneElement(children, {
                        ref: mergeRefs(children.ref, popupRef, taplyRef)
                    })
                }
            </Taply>
        )
    return (
        <>
            <Overlay />
            <Popup isActive={isOpen} placement={placement} popup={popup}>
                {target}
            </Popup>
        </>
    )
}

Tooltip.defaultProps = {
    openOnHover: true,
    openOnTap: false,
    placement: {
        side: 'top',
        align: 'center',
        offset: 5
    }
}

export default Tooltip
