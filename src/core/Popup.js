import React, { useRef, useLayoutEffect, useState, useMemo } from 'react'
import PropTypes from 'prop-types'

import { Layer } from './layers'
import cloneElementWithRef from '../utils/cloneElementWithRef'
import PopupController from './PopupController'

const Popup = (props) => {
    let { children, popup, isActive, placement } = props

    let [targetElem, setTargetElem] = useState()
    let [popupElem, setPopupElem] = useState()
    let controllerRef = useRef()

    useLayoutEffect(() => {
        if (isActive && targetElem && popupElem) {
            let options = {
                target: targetElem,
                popup: popupElem,
                placement
            }
            if (!controllerRef.current) {
                controllerRef.current = new PopupController(options)
            } else {
                controllerRef.current.setOptions(options)
            }
        } else {
            if (controllerRef.current) {
                controllerRef.current.unobserve()
                controllerRef.current = undefined
            }
        }
        return () => {
            if (controllerRef.current) {
                controllerRef.current.unobserve()
                controllerRef.current = undefined
            }
        }
    }, [targetElem, popupElem, isActive, placement])

    let memoizedPopup = useMemo(
        () =>
            typeof popup === 'function'
                ? popup(setPopupElem)
                : cloneElementWithRef(popup, { ref: setPopupElem }),
        [popup]
    )

    return (
        <>
            <Layer isActive={isActive}>{memoizedPopup}</Layer>
            {typeof children === 'function'
                ? children(setTargetElem)
                : cloneElementWithRef(children, { ref: setTargetElem })}
        </>
    )
}

Popup.propTypes = {
    /** Controls visibility of the popup. */
    isActive: PropTypes.bool,

    /** Target element, or a function that takes `ref` and returns an element. */
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,

    /** Popup element, or a function that takes `ref` and returns an element. */
    popup: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,

    /**
     * An object that configures placement of the popup with the following properties:
     * - **side** `'bottom'|'top'|'left'|'right'` – At which side of the target to place
     *   the popup. Default is `'bottom'`.
     * - **align** `'start'|'center'|'end'` – Alignment of the popup relative to the target.
     *   Default is `'start'`.
     * - **offset** `number` – Offset of the popup from the target. Default is `0`.
     * - **flip** `boolean` – Whether to allow flipping side and placement when original
     *   placement doesn't fit in the viewport. Default is `true`.
     * - **constrain** `boolean` – Whether to constrain the popup inside the viewport when
     *   it can not fit in. Default is `false`.
     * - **padding** `boolean` – Maximum allowed distance from the popup element
     *   to the side of the viewport. Default is `0`.
     */
    placement: PropTypes.object
}

Popup.defaultProps = {
    isActive: true
}

export default Popup
