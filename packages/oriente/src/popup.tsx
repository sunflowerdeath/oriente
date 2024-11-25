import { forwardRef, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Layer } from './layers'
import PopupController, { PopupPlacement, PopupSide } from './PopupController'
import cloneElementWithRef from './utils/cloneElementWithRef'
import mergeRefs from './utils/mergeRefs'

export interface PopupProps {
    /** Controls visibility of the popup. */
    isActive: boolean

    /** Target element, or a function that takes `ref` and returns an element. */
    children: React.ReactElement | ((ref: any) => React.ReactNode)

    /** Popup element, or a function that takes `ref` and returns an element. */
    popup: React.ReactElement | ((ref: any) => React.ReactNode)

    /**
     * An object that configures placement of the popup with the following
     * properties:
     * - **side** `'bottom'|'top'|'left'|'right'` – At which side of the target
     *   to place the popup. Default is `'bottom'`.
     * - **align** `'start'|'center'|'end'` – Alignment of the popup relative to
     *   the target. Default is `'start'`.
     * - **offset** `number` – Offset of the popup from the target. Default is `0`.
     * - **flip** `boolean` – Whether to allow flipping side and placement when
     *   original placement doesn't fit in the viewport. Default is `true`.
     * - **constrain** `boolean` – Whether to constrain the popup inside the
     *   viewport when it can not fit in. Default is `false`.
     * - **padding** `boolean` – Maximum allowed distance from the popup element
     *   to the side of the viewport. Default is `0`.
     */
    placement?: Partial<PopupPlacement>

    onChangeSide?: (side: PopupSide) => void
}

const popupDefaultProps = {
    isActive: true
}

const Popup = forwardRef((props: PopupProps, ref) => {
    const { children, popup, isActive, placement, onChangeSide } = {
        ...popupDefaultProps,
        ...props
    }

    const [targetElem, setTargetElem] = useState<HTMLElement>()
    const [popupElem, setPopupElem] = useState<HTMLElement>()
    const controllerRef = useRef<PopupController>()

    useLayoutEffect(() => {
        if (isActive && targetElem && popupElem) {
            const options = {
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

    const memoizedPopup = useMemo(
        () =>
            typeof popup === 'function'
                ? popup(setPopupElem)
                : cloneElementWithRef(popup, { ref: setPopupElem }),
        [popup]
    )

    const mergedRef = mergeRefs(ref, setTargetElem)
    return (
        <>
            {typeof children === 'function'
                ? children(mergedRef)
                : cloneElementWithRef(children, { ref: mergedRef })}
            {isActive && (
                <Layer type="popup" isActive={true} key="layer">
                    {memoizedPopup}
                </Layer>
            )}
        </>
    )
})

export { Popup }
