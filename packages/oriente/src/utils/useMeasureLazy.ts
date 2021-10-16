import { useRef, useState, useLayoutEffect } from 'react'

interface Rect {
    width: number
    height: number
}

const initialRect = { width: 0, height: 0 }

// This is version of `useMeasure` that creates ResizeObserver only
// when it is enabled and the element is provided
const useMeasureLazy = ({
    isEnabled
}: {
    isEnabled: boolean
}): [(elem: Element | null) => void, Rect] => {
    const [elem, setElem] = useState<Element | null>(null)
    const [rect, setRect] = useState<Rect>(initialRect)
    useLayoutEffect(() => {
        if (!isEnabled || elem === null) return
        const observer = new ResizeObserver((entries) => {
            if (elem) {
                const { width, height } = elem.getBoundingClientRect()
                setRect({ width, height })
            }
        })
        observer.observe(elem)
        return () => observer.disconnect()
    }, [isEnabled])
    return [setElem, rect]
}

export default useMeasureLazy
