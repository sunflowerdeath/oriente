import React, { useRef, useLayoutEffect, useState, useMemo } from 'react'
import PropTypes from 'prop-types'

import cloneElementWithRef from '../utils/cloneElementWithRef'
import { Layer } from './layers'
import PopupController from './PopupController'

const Popup = (props) => {
    const { children, popup, isActive, placement } = props

    const [targetElem, setTargetElem] = useState()
    const [popupElem, setPopupElem] = useState()
    const instanceRef = useRef()

    useLayoutEffect(() => {
        if (isActive && targetElem && popupElem) {
            let options = {
                target: targetElem,
                popup: popupElem,
                placement
            }
            if (!instanceRef.current) {
                instanceRef.current = new PopupController(options)
            } else {
                instanceRef.current.setOptions(options)
            }
        } else {
            if (instanceRef.current) {
                instanceRef.current.unobserve()
                instanceRef.current = undefined
            }
        }
        return () => {
            if (instanceRef.current) {
                instanceRef.current.unobserve()
                instanceRef.current = undefined
            }
        }
    }, [targetElem, popupElem, isActive, placement])

    const memoizedPopup = useMemo(
        () =>
            typeof popup === 'function'
                ? popup(setPopupElem)
                : cloneElementWithRef(popup, { ref: setPopupElem }),
        [popup]
    )
    return (
        <>
            {typeof children === 'function'
                ? children(setTargetElem)
                : cloneElementWithRef(children, { ref: setTargetElem })}
            {isActive && memoizedPopup}
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
