import { useMemo, createContext, useRef, useState, useCallback } from 'react'
import FocusLock from 'react-focus-lock'
import { useKey, useClickAway } from 'react-use'
import { RemoveScroll } from 'react-remove-scroll'
import { SpringConfig } from 'react-spring'

import { useStyles, StyleProps, StyleMap } from './styles'
import { Layer } from './layers'
// import CloseButton from "./CloseButton"
import {
    OpenAnimation,
    AnimationFunction,
    animationFunctions,
    useAnimatedValue
} from './animation'
import configs from './utils/springConfigs'

export interface ModalProps extends StyleProps<[ModalProps]> {
    /** Content of the modal */
    children: (close: () => void) => React.ReactNode

    /** Whether the modal is open */
    isOpen?: boolean

    /** Function that is called when the modal requests to close */
    onClose: () => void

    /** Ref to the element that will get focus on opening the modal */
    initialFocusRef?: any

    /** Whether the modal should close on click on overlay */
    closeOnOverlayClick?: boolean

    /** Whether the modal should close on pressing the Esc key */
    closeOnEsc?: boolean

    /** Vertically centers the modal */
    isCentered?: boolean

    /** CSS value for the width of the modal window */
    width?: string | number

    /** Function for hide and show animation */
    animation?: AnimationFunction

    /** Config for `react-spring` animation */
    springConfig?: SpringConfig
}

interface ModalContextProps {
    close: () => void
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined)

const modalStyles = (
    props: ModalProps,
    { isOpen }: { isOpen: boolean }
): StyleMap => {
    const container: React.CSSProperties = {
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: props.isCentered ? 'center' : 'flex-start',
        boxSizing: 'border-box',
        overflowY: 'auto',
        pointerEvents: isOpen ? 'all' : 'none'
    }
    const window: React.CSSProperties = {
        position: 'relative',
        background: 'white',
        maxWidth: '100%',
        width: props.width,
        pointerEvents: 'all'
    }
    const overlay: React.CSSProperties = {
        background: 'rgba(0,0,0,.5)',
        userSelect: 'none',
        pointerEvents: isOpen ? 'all' : 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
    }
    return { container, window, overlay }
}

const modalDefaultProps = {
    closeOnEsc: true,
    width: 800,
    animation: animationFunctions.fade,
    springConfig: configs.stiffest,
    isOpen: false
}

const Modal = (inProps: ModalProps) => {
    const props = { ...modalDefaultProps, ...inProps }
    const {
        isOpen,
        children,
        closeOnOverlayClick,
        closeOnEsc,
        onClose,
        animation,
        springConfig
    } = props
    const styles = useStyles(modalStyles, [props, { isOpen }])
    const [openValue, isRest] = useAnimatedValue(isOpen ? 1 : 0, {
        config: springConfig
    })
    const context = useMemo(() => ({ close: onClose }), [])
    const isActive = isOpen || !isRest
    useKey('Escape', () => {
        if (closeOnEsc) onClose()
    })
    const windowRef = useRef(null)
    useClickAway(windowRef, (e: MouseEvent) => {
        if (e.button === 0 && closeOnOverlayClick) onClose()
    })
    const modalChildren = useMemo(() => {
        if (isActive) {
            return typeof children === 'function' ? children(onClose) : children
        } else {
            return null
        }
    }, [children, onClose, isActive])

    return (
        <>
            <Layer type="modal" isActive={isActive}>
                <OpenAnimation
                    fn={animationFunctions.fade}
                    openValue={openValue}
                    style={styles.overlay}
                />
                <RemoveScroll>
                    <div style={styles.container}>
                        <OpenAnimation
                            fn={animation}
                            openValue={openValue}
                            style={styles.window}
                        >
                            <div ref={windowRef}>
                                <ModalContext.Provider value={context}>
                                    <FocusLock>{modalChildren}</FocusLock>
                                </ModalContext.Provider>
                            </div>
                        </OpenAnimation>
                    </div>
                </RemoveScroll>
            </Layer>
        </>
    )
}

export interface UseModalProps
    extends Omit<React.ComponentProps<typeof Modal>, 'isOpen' | 'onClose'> {
    Component: React.ComponentType<ModalProps>
    onClose?: () => void
}

export interface UseModal {
    close: () => void
    open: () => void
    render: () => React.ReactNode
}

const useModal = (props: UseModalProps): UseModal => {
    const { Component, ...modalProps } = props
    const [isOpen, setIsOpen] = useState(false)

    const open = useCallback(() => setIsOpen(true), [])
    const close = useCallback(() => setIsOpen(false), [])
    const render = useCallback(
        () => (
            <Component
                {...modalProps}
                isOpen={isOpen}
                onClose={() => {
                    modalProps.onClose?.()
                    close()
                }}
            />
        ),
        [isOpen, ...Object.values(modalProps)]
    )
    return { open, close, render }
}

// export interface ModalCloseButtonProps
// extends StyleProps<[ModalCloseButtonProps]> {
// children?: React.ReactNode
// }

// const ModalCloseButton = (props: ModalCloseButtonProps) => {
// const { children } = props
// const context = useContext(ModalContext)
// if (!context) {
// throw new Error(
// "You can use <ModalCloseButton> only inside <Modal> component"
// )
// }
// return <CloseButton onTap={context.close}>{children}</CloseButton>
// }

export { Modal, useModal } // , ModalCloseButton
