import React, { useRef, useState, useContext, createContext } from 'react'
// @ts-ignore
import Taply from 'taply'
// @ts-ignore
import { useStyles } from 'floral'
import { mapValues } from 'lodash'

import { FloralProps } from '../types'

import { Layer } from './layers'
import { AppearAnimation, CollapseAnimation } from './animations'

type ToastPlacement =
    | 'top'
    | 'top-right'
    | 'top-left'
    | 'bottom'
    | 'bottom-right'
    | 'bottom-left'

interface ToastContainerProps {
    children: React.ReactNode
}

interface ToastProps extends FloralProps {
    children: React.ReactNode
}

interface ToastOptions extends ToastProps {
    duration?: number
    placement?: ToastPlacement
}

// internal types

interface ToastContainerContextProps {
    show: (options: ToastOptions) => number
    close: (id: number) => void
}

const ToastContainerContext = createContext<
    ToastContainerContextProps | undefined
>(undefined)

interface ToastState {
    id: number
    placement: ToastPlacement
    props: ToastProps
}

type ToastsState = { [key in ToastPlacement]: ToastState[] }

const style: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    right: 0
}

const topPlacements = ['top', 'top-right', 'top-left']

const ToastContainer = ({ children }: ToastContainerProps) => {
    const idRef = useRef(0)
    const [toasts, setToasts] = useState<ToastsState>({
        top: [],
        'top-right': [],
        'top-left': [],
        bottom: [],
        'bottom-right': [],
        'bottom-left': []
    })
    const show = (options: ToastOptions) => {
        const { placement = 'top', duration = 3000, ...props } = options
        const id = idRef.current++
        const newToast = { id, props }
        setToasts((toasts) => {
            const list = topPlacements.includes(placement)
                ? [newToast, ...toasts[placement]]
                : [...toasts[placement], newToast]
            return { ...toasts, [placement]: list }
        })
        return id
    }
    const close = (id: number) =>
        setToasts((toasts) =>
            mapValues(toasts, (list) => list.filter((toast) => toast.id !== id))
        )
    const context = { show, close }

    return (
        <>
            <ToastContainerContext.Provider value={context}>
                {children}
            </ToastContainerContext.Provider>
            <Layer isActive={true} type="global">
                {Object.entries(toasts).map(([placement, toasts]) => (
                    <div style={style}>
                        {toasts.map(({ props, id }) => (
                            <Toast key={id} {...props} />
                        ))}
                    </div>
                ))}
            </Layer>
        </>
    )
}

const Toast = (props: ToastProps) => {
    const { children } = props
    const styles = useStyles(undefined, [props])
    return <div style={styles.root}>{children}</div>
}

const useToast = () => {
    const context = useContext(ToastContainerContext)
    if (!context) {
        throw new Error(
            'You can call `useToast()` only inside <ToastContainer>'
        )
    }
    return context
}

export { ToastContainer, useToast }
