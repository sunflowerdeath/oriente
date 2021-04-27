import React, { useMemo, createContext, useContext, useRef } from 'react'
// @ts-ignore
import Taply from 'taply'
// @ts-ignore
import { useStyles } from 'floral'
import FocusLock from 'react-focus-lock'
import { useKey, useClickAway } from 'react-use'
import { RemoveScroll } from 'react-remove-scroll'
import { SpringConfig } from 'react-spring'

import { Layer } from './layers'
import CloseButton from './CloseButton'
import { AppearAnimation, FadeAnimation } from './animations'
import useAnimatedValue from './utils/useAnimatedValue'
import configs from './utils/springConfigs'
import { FloralProps } from './types'

export interface ModalProps extends FloralProps {
    /** Content of the modal */
    children: (close: () => void) => React.ReactNode | React.ReactNode

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

    /** Component for hide and show animation */
    Animation?: AppearAnimation

    /** Config for `react-spring` animation */
    springConfig?: SpringConfig
}

export interface ModalCloseButtonProps extends FloralProps {
    children?: React.ReactNode
}

interface ModalContextProps {
    close: () => void
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined)

const modalStyles = (props: ModalProps, { isOpen }: { isOpen: boolean }) => {
    const container = {
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
    const window = {
        position: 'relative',
        background: 'white',
        maxWidth: '100%',
        width: props.width,
        pointerEvents: 'all'
    }
    const overlay = {
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

const Modal = (props: ModalProps) => {
    const {
        isOpen,
        children,
        closeOnOverlayClick,
        closeOnEsc,
        onClose,
        Animation,
        springConfig
    } = props
    const styles = useStyles(modalStyles, [props, { isOpen }])
    const [openValue, isRest] = useAnimatedValue(isOpen ? 1 : 0, { config: springConfig })
    const context = useMemo(() => ({ close: onClose }), [])
    const isActive = isOpen || !isRest
    useKey('Escape', () => {
        if (closeOnEsc) onClose()
    })
    const windowRef = useRef(null)
    useClickAway(windowRef, (e) => {
        if (closeOnOverlayClick) onClose()
    })
    const modalChildren = useMemo(() => {
        if (isActive) {
            return typeof children === 'function' ? children(onClose) : children
        } else {
            return null
        }
    }, [children, isActive])

    return (
        <>
            <Layer type="modal" isActive={isActive}>
                <FadeAnimation openValue={openValue} style={styles.overlay} />
                <RemoveScroll>
                    <div style={styles.container}>
                        <Animation openValue={openValue} style={styles.window}>
                            <div ref={windowRef}>
                                <ModalContext.Provider value={context}>
                                    <FocusLock>{modalChildren}</FocusLock>
                                </ModalContext.Provider>
                            </div>
                        </Animation>
                    </div>
                </RemoveScroll>
            </Layer>
        </>
    )
}

Modal.defaultProps = {
    closeOnEsc: true,
    width: 800,
    Animation: FadeAnimation,
    springConfig: configs.normal
}

const ModalCloseButton = (props: ModalCloseButtonProps) => {
    const { children } = props
    const context = useContext(ModalContext)
    if (!context) {
        throw new Error('You can use <ModalCloseButton> only inside <Modal> component')
    }
    return <CloseButton onTap={context.close}>{children}</CloseButton>
}

export { Modal, ModalCloseButton }
