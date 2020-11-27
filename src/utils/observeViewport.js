const html = document.querySelector('html')

const measureViewport = () => ({
    scrollTop: window.scrollY,
    scrollLeft: window.scrollX,
    // this is without scrollbars
    height: html.offsetHeight,
    width: html.offsetWidth
})

const viewportObservers = []

const callViewportObservers = () => {
    const viewport = measureViewport()
    viewportObservers.map((cb) => cb(viewport))
}

window.addEventListener('scroll', callViewportObservers)
window.addEventListener('resize', callViewportObservers)

const observeViewport = (cb) => ({
    observe() {
        viewportObservers.push(cb)
    },
    unobserve() {
        const index = viewportObservers.indexOf(cb)
        if (index !== -1) viewportObservers.splice(index, 1)
    }
})

export default observeViewport
export { measureViewport }
