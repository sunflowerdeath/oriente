import React, { useRef, useState, useContext, createContext } from 'react'
// @ts-ignore
import Taply from 'taply'
// @ts-ignore
import { useStyles } from 'floral'
import { mapValues } from 'lodash'
import { animated, useTransition } from 'react-spring'

import { FloralProps } from '../types'

import { Layer } from './layers'
import { AppearAnimation, CollapseAnimation } from './animations'
import CloseButton from './CloseButton'

export type ToastPlacement =
    | 'top'
    | 'top-right'
    | 'top-left'
    | 'bottom'
    | 'bottom-right'
    | 'bottom-left'

export interface ToastContainerProps {
    children: React.ReactNode
}

export interface ToastProps extends FloralProps {
    children: React.ReactNode | ((close: () => void) => React.ReactNode)
    onClose?: () => void
}

export interface ToastCloseButtonProps extends FloralProps {
    children?: React.ReactNode
}

export interface ToastOptions extends ToastProps {
    duration?: number
    placement?: ToastPlacement
}

interface ToastConroller {
    show: (options: ToastOptions) => number
    close: (id: number) => void
}

const ToastContainerContext = createContext<ToastConroller | undefined>(undefined)

interface ToastState {
    id: number
    placement: ToastPlacement
    props: ToastProps
}

type ToastsState = { [key in ToastPlacement]: ToastState[] }

interface ToastContextProps {
    close: () => void
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined)

const toastStyle = {
    root: { position: 'relative', pointerEvents: 'all' }
}

const Toast = (props: ToastProps) => {
    const { children, onClose } = props
    const styles = useStyles(toastStyle, [props])
    return (
        <div style={styles.root}>
            <ToastContext.Provider value={{ close: () => onClose && onClose() }}>
                {children}
            </ToastContext.Provider>
        </div>
    )
}

interface ToastListProps {
    toasts: ToastState[]
    placement: ToastPlacement
    close: (id: number) => void
}

const ToastList = ({ toasts, placement, close }: ToastListProps) => {
    // @ts-ignore
    let transitions = useTransition(toasts, (toast) => toast.id, {
        initial: { slide: 0, height: 1, opacity: 0 },
        from: { slide: 0, height: 1, opacity: 0 },
        enter: { slide: 1, height: 1, opacity: 1 },
        leave: { slide: 1, height: 0, opacity: 0 },
        unique: true
    })
    const renderToast = ({
        item,
        props,
        key
    }: {
        item: ToastState
        props: { [key: string]: any }
        key: string
    }) => (
        <CollapseAnimation openValue={props.height} key={key}>
            <animated.div
                style={{
                    [topPlacements.includes(placement)
                        ? 'marginTop'
                        : 'marginBottom']: props.slide.interpolate(
                        [0, 1],
                        ['-100%', '0%']
                    ),
                    opacity: props.opacity
                }}
            >
                <Toast {...item.props} onClose={() => close(item.id)} />
            </animated.div>
        </CollapseAnimation>
    )
    return <>{transitions.map(renderToast)}</>
}

const topPlacements = ['top', 'top-right', 'top-left']

const getContainerStyle = (placement: ToastPlacement) => {
    const style: React.CSSProperties = {
        position: 'fixed',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        boxSizing: 'border-box'
    }
    style.justifyContent = topPlacements.includes(placement) ? 'flex-start' : 'flex-end'
    if (placement === 'top-left' || placement === 'bottom-left') {
        style.alignItems = 'flex-start'
    } else if (placement === 'top-right' || placement === 'bottom-right') {
        style.alignItems = 'flex-end'
    } else {
        style.alignItems = 'center'
    }
    return style
}

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
        const { placement = 'top-right', duration = 3000, ...props } = options
        const id = idRef.current++
        const newToast = { id, props }
        setToasts((toasts) => {
            const list = topPlacements.includes(placement)
                ? [newToast, ...toasts[placement]]
                : [...toasts[placement], newToast]
            return { ...toasts, [placement]: list }
        })
        setTimeout(() => close(id), duration)
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
                    <div style={getContainerStyle(placement as ToastPlacement)}>
                        <ToastList
                            toasts={toasts}
                            placement={placement as ToastPlacement}
                            close={close}
                        />
                    </div>
                ))}
            </Layer>
        </>
    )
}

const ToastCloseButton = (props: ToastCloseButtonProps) => {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('You can use <ToastCloseButton> only inside <Toast> component')
    }
    return <CloseButton {...props} onTap={context.close} />
}

const useToast = () => {
    const context = useContext(ToastContainerContext)
    if (!context) {
        throw new Error('You can call useToast() only inside <ToastContainer>')
    }
    return context
}

export { ToastContainer, ToastCloseButton, useToast }
