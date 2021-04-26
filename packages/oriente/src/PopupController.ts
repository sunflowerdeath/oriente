import observeRect from '@reach/observe-rect'

import observeViewport, {
    measureViewport,
    ViewportMeasurements,
    ViewportObserver
} from './utils/observeViewport'

export type PopupSide = 'left' | 'top' | 'right' | 'bottom'

export type PopupAlign = 'start' | 'center' | 'end'

export interface PopupPlacement {
    side: PopupSide
    align: PopupAlign
    offset: number
    flip: boolean
    constrain: boolean
    padding: number
}

export interface PopupOptions {
    target: HTMLElement
    popup: HTMLElement
    placement: PopupPlacement
    onChangeSide?: (side: PopupSide) => void
}

interface Position {
    left: number
    top: number
}

interface ViewportBounds {
    left: number
    right: number
    top: number
    bottom: number
}

interface PopupMeasurements {
    popup: DOMRect
    target: DOMRect
    bounds: ViewportBounds
}

type PlacementConfig = Pick<PopupPlacement, 'side' | 'align' | 'offset'>

const getViewportBounds = (viewport: ViewportMeasurements) => ({
    left: viewport.scrollLeft,
    right: viewport.scrollLeft + viewport.width,
    top: viewport.scrollTop,
    bottom: viewport.scrollTop + viewport.height
})

export const defaultPlacement: PopupPlacement = {
    side: 'bottom',
    align: 'start',
    offset: 0,
    flip: true,
    constrain: false,
    padding: 0
}

export const oppositeSides: { [key in PopupSide]: PopupSide } = {
    left: 'right',
    right: 'left',
    top: 'bottom',
    bottom: 'top'
}

const calcPosition = (measurements: PopupMeasurements, config: PlacementConfig) => {
    const { popup, target, bounds } = measurements
    const { side, align, offset } = config
    let top = 0
    let left = 0

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

const getFlipConfigs = (
    flip: boolean,
    { side, align, offset }: Pick<PopupPlacement, 'side' | 'align' | 'offset'>
) => {
    const configs = [{ side, align, offset }]
    if (!flip) return configs

    configs.push({ side: oppositeSides[side], align, offset })
    if (align !== 'center') {
        let oppositeAlign: PopupAlign = align === 'start' ? 'end' : 'start'
        configs.push(
            { side, align: oppositeAlign, offset },
            { side: oppositeSides[side], align: oppositeAlign, offset }
        )
    }
    return configs
}

const fitsViewport = (
    pos: Position,
    measurements: PopupMeasurements,
    padding: number
) => {
    const { bounds, popup } = measurements
    return (
        pos.left >= bounds.left + padding &&
        pos.left + popup.width <= bounds.right - padding &&
        pos.top >= bounds.top + padding &&
        pos.top + popup.height <= bounds.bottom - padding
    )
}

const constrainPosition = (
    position: Position,
    measurements: PopupMeasurements,
    padding: number
) => {
    const { bounds, popup } = measurements
    const res = { ...position }
    if (res.left < bounds.left + padding) res.left = bounds.left + padding
    if (res.top < bounds.top + padding) res.top = bounds.top + padding
    if (res.left + popup.width > bounds.right - padding) {
        res.left = bounds.right - popup.width - padding
    }
    if (res.top + popup.height > bounds.bottom - padding) {
        res.top = bounds.bottom - popup.height - padding
    }
    return res
}

const getPopupPosition = (measurements: PopupMeasurements, placement: PopupPlacement) => {
    let { side, align, offset, flip, constrain, padding } = placement
    let configs = getFlipConfigs(flip, { side, align, offset })
    // TODO select position that fits most?
    let position: Position, config: any
    for (const i in configs) {
        config = configs[i]
        position = calcPosition(measurements, config)
        if (fitsViewport(position, measurements, padding)) break
    }
    if (constrain) position = constrainPosition(position!, measurements, padding)
    return { position: position!, config: config! }
}

const forceDefined = <T>() => (undefined as any) as T

type RectObserver = ReturnType<typeof observeRect>

class PopupController {
    constructor(options: PopupOptions) {
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

    disableUpdate: boolean
    popup: HTMLElement = forceDefined<HTMLElement>()
    target: HTMLElement = forceDefined<HTMLElement>()
    placement: PopupPlacement
    onChangeSide?: (side: PopupSide) => void

    viewportObserver: ViewportObserver
    viewport: ViewportMeasurements

    targetObserver: RectObserver = forceDefined<RectObserver>()
    targetRect: DOMRect = forceDefined<DOMRect>()

    popupObserver: RectObserver = forceDefined<RectObserver>()
    popupRect: DOMRect = forceDefined<DOMRect>()

    unobserve() {
        this.viewportObserver.unobserve()
        this.targetObserver.unobserve()
        this.popupObserver.unobserve()
    }

    setOptions({ target, popup, placement, onChangeSide }: PopupOptions) {
        this.disableUpdate = true
        this.onChangeSide = onChangeSide
        if (this.target !== target) {
            this.target = target
            if (this.targetObserver) this.targetObserver.unobserve()
            this.targetRect = target.getBoundingClientRect()
            this.targetObserver = observeRect(target, (rect) => {
                this.targetRect = rect
                this.updatePosition()
            })
            this.targetObserver.observe()
        }
        if (this.popup !== popup) {
            this.popup = popup
            if (this.popupObserver) this.popupObserver.unobserve()
            this.popupRect = popup.getBoundingClientRect()
            this.popupObserver = observeRect(popup, (rect) => {
                this.popupRect = rect
                this.updatePosition()
            })
            this.popupObserver.observe()
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
        const { config, position } = getPopupPosition(measurements, this.placement)
        this.setPosition(position)
        if (this.onChangeSide) this.onChangeSide(config.side)
    }

    setPosition({ left, top }: Position) {
        this.popup.style.transform = `translate(${left}px, ${top}px)`
    }
}

export default PopupController
