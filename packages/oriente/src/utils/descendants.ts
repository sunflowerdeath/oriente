import { useLayoutEffect, useMemo, useRef } from 'react'
import mergeRefs from './mergeRefs'
import useForceUpdate from './useForceUpdate'

const isPreceding = (a: Node, b: Node) =>
    Boolean(b.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_PRECEDING)

export interface Descendant<T> {
    element: HTMLElement
    props: T
}

class DescendantsManager<T> {
    items: Descendant<T>[] = []

    register({ element, ...props }: Descendant<T>) {
        if (!element) return

        // already registered
        if (this.items.find((item) => item.element === element)) return

        const index = this.items.findIndex((item) => isPreceding(element, item.element))
        const newItem = { element, ...props }
        if (index === -1) {
            this.items.push(newItem)
        } else {
            this.items.splice(index, 0, newItem)
        }
    }

    unregister(element: HTMLElement) {
        const index = this.items.findIndex((item) => item.element === element)
        if (index !== -1) this.items.splice(index, 1)
    }
}

const useDescendants = <T>() => {
    const descendants = useMemo(() => new DescendantsManager<T>(), [])
    return descendants
}

const useDescendant = <T>(descendants: DescendantsManager<T>, props: T) => {
    const forceUpdate = useForceUpdate()
    const ref = useRef<HTMLElement>()
    const element = ref.current

    useLayoutEffect(() => {
        return () => {
            if (ref.current) descendants.unregister(ref.current)
        }
    }, [])

    const callback = (element: any) => descendants.register({ element, props })
    const index = element
        ? descendants.items.findIndex((item) => element === item.element)
        : -1
    return { ref: mergeRefs(ref, callback), index }
}

export { useDescendants, useDescendant, DescendantsManager }
