import { useState, useLayoutEffect, useCallback } from 'react'

export type Descendant<T extends HTMLElement, P = {}> = P & {
    element: T
    index?: number
}

export interface DescendantContext<T extends HTMLElement, P = {}> {
    descendants: Descendant<T, P>[]
    register: (descendant: Descendant<T, P>) => void
    unregister: (element: T) => void
}

type UseDescendantProps<T extends HTMLElement, P> = {
    context: DescendantContext<T, P>
    element: T
} & P

const useDescendant = <T extends HTMLElement, P>(
    props: UseDescendantProps<T, P>
) => {
    const { context, element, ...rest } = props
    const { register, unregister, descendants } = context
    useLayoutEffect(() => {
        register({ element, ...rest } as any)
        return () => {
            if (element) unregister(element)
        }
    }, [element, ...Object.values(rest)])
    return descendants.findIndex((item) => item.element === element)
}

const isPreceding = (a: Node, b: Node) =>
    Boolean(b.compareDocumentPosition(a) & Node.DOCUMENT_POSITION_PRECEDING)

const useDescendants = <T extends HTMLElement, P>() => {
    const [descendants, setDescendants] = useState<Descendant<T, P>[]>([])

    const register = useCallback(({ element, ...rest }: Descendant<T, P>) => {
        if (!element) return
        // @ts-ignore
        setDescendants((prevDescendants) => {
            if (prevDescendants.find((item) => item.element === element)) {
                return prevDescendants
            }
            // TODO need force update to be able to use all descendants array after register?
            const index = prevDescendants.findIndex((item) =>
                isPreceding(element, item.element)
            )
            const newItem = { element, ...rest }
            if (index === -1) return [...prevDescendants, newItem]
            return [
                ...prevDescendants.slice(0, index),
                newItem,
                ...prevDescendants.slice(index)
            ]
        })
    }, [])

    const unregister = useCallback((element: T) => {
        if (!element) return
        setDescendants((descendants) =>
            descendants.filter((descendant) => element !== descendant.element)
        )
    }, [])

    return { descendants, register, unregister }
}

export { useDescendant, useDescendants }
