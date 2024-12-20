import { useRef, useState, useContext, createContext } from 'react'
import { animated, useTransition, SpringConfig } from 'react-spring'
import { mapValues } from "es-toolkit"

import configs from './utils/springConfigs'
import { Layer } from './layers'
import { CollapseAnimation } from './animation'

/*
// this saves ~30kb compared to lodash
const mapValues = <T, M = T, K extends string = string>(
    obj: { [key in K]: T },
    cb: (val: T) => M
): { [key in K]: M } => {
    const res: { [key: string]: M } = {}
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            res[key] = cb(obj[key])
        }
    }
    return res as { [key in K]: M }
}
*/

export type ToastPlacement =
    | 'top'
    | 'top-right'
    | 'top-left'
    | 'bottom'
    | 'bottom-right'
    | 'bottom-left'

export interface ToastContainerProps {
    children: React.ReactNode
    springConfig?: SpringConfig
}

export interface ToastProps {
    children: React.ReactNode | ((close: () => void) => React.ReactNode)
    onClose?: () => void
}

export interface ShowToastOptions extends ToastProps {
    duration?: number
    placement?: ToastPlacement
}

export interface ToastController {
    show: (options: ShowToastOptions) => number
    close: (id: number) => void
}

const ToastContainerContext = createContext<ToastController | undefined>(
    undefined
)

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

interface ToastListProps {
    toasts: ToastState[]
    placement: ToastPlacement
    close: (id: number) => void
    springConfig?: SpringConfig
}

const ToastList = ({
    toasts,
    placement,
    close,
    springConfig
}: ToastListProps) => {
    const transitions = useTransition(toasts, {
        keys: (toast) => toast.id,
        initial: { slide: 0, height: 1, opacity: 0 },
        from: { slide: 0, height: 1, opacity: 0 },
        enter: { slide: 1, height: 1, opacity: 1 },
        leave: { slide: 1, height: 0, opacity: 0 },
        unique: true,
        config: springConfig
    })
    const renderToast = (props: { [key: string]: any }, item: ToastState) => (
        <CollapseAnimation openValue={props.height} key={item.id}>
            <animated.div
                style={{
                    [topPlacements.includes(placement)
                        ? 'marginTop'
                        : 'marginBottom']: props.slide.interpolate(
                        [0, 1],
                        ['-100%', '0%']
                    ),
                    opacity: props.opacity,
                    position: 'relative',
                    pointerEvents: 'all'
                }}
            >
                <ToastContext.Provider value={{ close: () => close(item.id) }}>
                    {typeof item.props.children === 'function'
                        ? item.props.children(() => close(item.id))
                        : item.props.children}
                </ToastContext.Provider>
            </animated.div>
        </CollapseAnimation>
    )
    return <>{transitions(renderToast)}</>
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
    style.justifyContent = topPlacements.includes(placement)
        ? 'flex-start'
        : 'flex-end'
    if (placement === 'top-left' || placement === 'bottom-left') {
        style.alignItems = 'flex-start'
    } else if (placement === 'top-right' || placement === 'bottom-right') {
        style.alignItems = 'flex-end'
    } else {
        style.alignItems = 'center'
    }
    return style
}

const toastContainerDefaultProps = {
    springConfig: configs.stiffer
}

const ToastContainer = (props: ToastContainerProps) => {
    const { children, springConfig } = {
        ...toastContainerDefaultProps,
        ...props
    }
    const idRef = useRef(0)
    const [toasts, setToasts] = useState<ToastsState>({
        top: [],
        'top-right': [],
        'top-left': [],
        bottom: [],
        'bottom-right': [],
        'bottom-left': []
    })
    const show = (options: ShowToastOptions) => {
        const { placement = 'top-right', duration = 3000, ...props } = options
        const id = idRef.current++
        const newToast = { id, props }
        setToasts((toasts) => {
            const list = topPlacements.includes(placement)
                ? [newToast, ...toasts[placement]]
                : [...toasts[placement], newToast]
            return { ...toasts, [placement]: list }
        })
        if (duration > 0) setTimeout(() => close(id), duration)
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
                            springConfig={springConfig}
                        />
                    </div>
                ))}
            </Layer>
        </>
    )
}

const useToast = () => {
    const context = useContext(ToastContainerContext)
    if (!context) {
        throw new Error('You can call useToast() only inside <ToastContainer>')
    }
    return context
}

export { ToastContainer, useToast }
