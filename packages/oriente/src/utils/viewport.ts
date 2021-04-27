const html = document.querySelector('html')!

export interface ViewportMeasurements {
    scrollTop: number
    scrollLeft: number
    height: number
    width: number
}

export type ViewportObserverCallback = (m: ViewportMeasurements) => void

export interface ViewportObserver {
    observe: () => void
    unobserve: () => void
}

const measureViewport = () => ({
    scrollTop: window.scrollY,
    scrollLeft: window.scrollX,
    // this is without scrollbars
    height: html.offsetHeight,
    width: html.offsetWidth
})

const viewportObservers: ViewportObserverCallback[] = []

const callViewportObservers = () => {
    const viewport = measureViewport()
    viewportObservers.map((cb) => cb(viewport))
}

window.addEventListener('scroll', callViewportObservers)
window.addEventListener('resize', callViewportObservers)

const observeViewport = (cb: ViewportObserverCallback) => ({
    observe() {
        viewportObservers.push(cb)
    },
    unobserve() {
        const index = viewportObservers.indexOf(cb)
        if (index !== -1) viewportObservers.splice(index, 1)
    }
})

export { observeViewport, measureViewport }
