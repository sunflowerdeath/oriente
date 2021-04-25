import { useRef, useLayoutEffect, useCallback, useState } from 'react'

import useForceUpdate from './useForceUpdate'

const isPreceding = (a: Node, b: Node) =>
    Boolean(b.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_PRECEDING)

export interface Descendant<T> {
    element: HTMLElement
    props: T
}

export interface Descendants<T> {
    items: Descendant<T>[]
    register: (desc: Descendant<T>) => void
    unregister: (element: HTMLElement) => void
}

const useDescendants = <T>() => {
    const [items, setItems] = useState<Descendant<T>[]>([])
    const register = useCallback(({ element, ...props }) => {
        if (!element) return
        setItems((prevItems) => {
            if (prevItems.find((item) => item.element === element)) {
                return prevItems
            }
            const index = prevItems.findIndex((item) =>
                isPreceding(element, item.element)
            )
            const newItem = { element, ...props }
            if (index === -1) return [...prevItems, newItem]
            return [...prevItems.slice(0, index), newItem, ...prevItems.slice(index)]
        })
    }, [])
    const unregister = useCallback((element) => {
        setItems((items) => items.filter((item) => element !== item.element))
    }, [])
    return { items, register, unregister }
}

const useDescendant = <T>(descendants: Descendants<T>, props: T) => {
    const forceUpdate = useForceUpdate()
    const ref = useRef<HTMLElement>()
    const { register, unregister } = descendants
    const element = ref.current
    useLayoutEffect(() => {
        if (element === undefined) {
            // On first render there is no element
            forceUpdate()
        } else {
            register({ element, props })
        }
        return () => {
            if (element) unregister(element)
        }
    }, [element, ...Object.values(props)])
    const index = element
        ? descendants.items.findIndex((item) => element === item.element)
        : -1
    return { ref, index }
}

export { useDescendants, useDescendant }
