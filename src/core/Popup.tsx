import React, { useRef, useLayoutEffect, useState, useMemo, forwardRef } from 'react'
import PropTypes from 'prop-types'

import cloneElementWithRef from '../utils/cloneElementWithRef'
import mergeRefs from '../utils/mergeRefs'

import { Layer } from './layers'
import PopupController, { PopupPlacement, PopupSide } from './PopupController'

interface PopupProps {
    /** Controls visibility of the popup. */
    isActive: boolean

    /** Target element, or a function that takes `ref` and returns an element. */
    children: React.ReactNode | ((ref: any) => React.ReactNode)

    /** Popup element, or a function that takes `ref` and returns an element. */
    popup: React.ReactNode | ((ref: any) => React.ReactNode)

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
    placement?: Partial<PopupPlacement>

    onChangeSide?: (side: PopupSide) => void
}

const Popup = forwardRef((props: PopupProps, ref) => {
    let { children, popup, isActive, placement, onChangeSide } = props

    let [targetElem, setTargetElem] = useState()
    let [popupElem, setPopupElem] = useState()
    let controllerRef = useRef()

    useLayoutEffect(() => {
        if (isActive && targetElem && popupElem) {
            let options = {
                target: targetElem,
                popup: popupElem,
                placement,
                onChangeSide
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
    }, [targetElem, popupElem, isActive, placement, onChangeSide])

    let memoizedPopup = useMemo(
        () =>
            typeof popup === 'function'
                ? popup(setPopupElem)
                : cloneElementWithRef(popup, { ref: setPopupElem }),
        [popup]
    )

    let mergedRef = mergeRefs(ref, setTargetElem)
    return (
        <>
            <Layer type="popup" isActive={isActive}>{memoizedPopup}</Layer>
            {typeof children === 'function'
                ? children(mergedRef)
                : cloneElementWithRef(children, { ref: mergedRef })}
        </>
    )
})

Popup.defaultProps = {
    isActive: true
}

export default Popup
