import { useState, useMemo, useEffect } from 'react'

import { observeViewport, measureViewport } from './viewport'
import type { ViewportMeasurements } from './viewport'

const useViewport = () => {
    const [viewport, setViewport] = useState<ViewportMeasurements>(measureViewport)
    const observer = useMemo<ReturnType<typeof observeViewport>>(() => {
        const observer = observeViewport(setViewport)
        observer.observe()
        return observer
    }, [])
    useEffect(() => {
        return () => observer.unobserve()
    }, [])
    return viewport
}

export default useViewport
