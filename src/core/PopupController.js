import observeRect from '@reach/observe-rect'

import observeViewport, { measureViewport } from '../utils/observeViewport'

const calcPosition = (measurements, config) => {
    const { popup, target, bounds } = measurements
    const { side, align, offset } = config
    let top, left

    if (side === 'top') {
        top = target.top - popup.height - offset
    } else if (side === 'bottom') {
        top = target.bottom + offset
    } else if (side === 'left') {
        left = target.left - popup.width - offset
    } else if (side === 'right') {
        left = target.right + offset
    }

    if (side === 'bottom' || side === 'top') {
        if (align === 'start') {
            left = target.left
        } else if (align === 'end') {
            left = target.right - popup.width
        } else if (align === 'center') {
            left = target.left + target.width / 2 - popup.width / 2
        }
    } else {
        if (align === 'start') {
            top = target.top
        } else if (align === 'end') {
            top = target.bottom - popup.height
        } else if (align === 'center') {
            top = target.top + target.height / 2 - popup.height / 2
        }
    }

    return {
        left: Math.round(left + bounds.left),
        top: Math.round(top + bounds.top)
    }
}

const oppositeSides = {
    left: 'right',
    right: 'left',
    top: 'bottom',
    bottom: 'top'
}

const getFlipConfigs = (flip, { side, align, offset }) => {
    const configs = [{ side, align, offset }]
    if (!flip) return configs

    configs.push({ side: oppositeSides[side], align, offset })
    if (align !== 'center') {
        let oppositeAlign = align === 'start' ? 'end' : 'start'
        configs.push(
            { side, align: oppositeAlign, offset },
            { side: oppositeSides[side], align: oppositeAlign, offset }
        )
    }
    return configs
}

const fitsViewport = (pos, measurements, padding) => {
    const { bounds, popup } = measurements
    return (
        pos.left >= bounds.left + padding &&
        pos.left + popup.width <= bounds.right - padding &&
        pos.top >= bounds.top + padding &&
        pos.top + popup.height <= bounds.bottom - padding
    )
}

// TODO
const constrainPosition = (position, measurements, padding) => {
    const { bounds, popup } = measurements
    const res = { ...position }
    if (res.left < bounds.left + padding) res.left = bounds.left + padding
    if (res.top < bounds.top + padding) res.top = bounds.top + padding
    if (res.left + popup.width > bounds.right - padding) {
        res.left = bounds.right - element.width - padding
    }
    if (res.top + element.height > bounds.bottom - padding) {
        res.top = bounds.bottom - element.height - padding
    }
    return res
}

const getPopupPosition = (measurements, placement) => {
    let { viewport, popupRect, targetRect } = measurements
    let { side, align, offset, flip, constrain, padding } = placement
    let configs = getFlipConfigs(flip, { side, align, offset })
    // TODO select position that fits most
    let position
    for (const i in configs) {
        position = calcPosition(measurements, configs[i])
        if (fitsViewport(position, measurements, padding)) break
    }
    // if (constrain) position = constrainPosition(position, measurements, padding)
    return position
}

const getViewportBounds = (viewport) => ({
    left: viewport.scrollLeft,
    right: viewport.scrollLeft + viewport.width,
    top: viewport.scrollTop,
    bottom: viewport.scrollTop + viewport.height
})

const defaultPlacement = {
    side: 'bottom',
    align: 'start',
    offset: 0,
    flip: true,
    constrain: false,
    padding: 0
}

class PopupController {
    constructor(options) {
        this.disableUpdate = true
        this.viewport = measureViewport()
        this.viewportObserver = observeViewport((viewport) => {
            this.viewport = viewport
            this.updatePosition()
        })
        this.viewportObserver.observe()
        this.placement = { ...defaultPlacement }
        this.setOptions(options)
    }

    unobserve() {
        this.viewportObserver.unobserve()
        this.targetObserver.unobserve()
        this.popupObserver.unobserve()
    }

    setOptions({ target, popup, placement }) {
        this.disableUpdate = true
        if (this.target !== target) {
            if (this.targetObserver) this.targetObserver.unobserve()
            this.targetRect = target.getBoundingClientRect()
            this.targetObserver = observeRect(target, (rect) => {
                this.targetRect = rect
                this.updatePosition()
            })
            this.targetObserver.observe()
            this.target = target
        }
        if (this.popup !== popup) {
            if (this.popupObserver) this.popupObserver.unobserve()
            this.popupRect = popup.getBoundingClientRect()
            this.popupObserver = observeRect(popup, (rect) => {
                this.popupRect = rect
                this.updatePosition()
            })
            this.popupObserver.observe()
            this.popup = popup
        }
        if (placement) Object.assign(this.placement, placement)
        this.disableUpdate = false
        this.updatePosition()
    }

    updatePosition() {
        if (this.disableUpdate) return
        const measurements = {
            popup: this.popupRect,
            target: this.targetRect,
            bounds: getViewportBounds(this.viewport)
        }
        const position = getPopupPosition(measurements, this.placement)
        if (position) this.setPosition(position)
    }

    setPosition({ left, top }) {
        this.popup.style.transform = `translate(${left}px, ${top}px)`
    }
}

export default PopupController
