import React, { useMemo, createContext, useContext } from 'react'
// @ts-ignore
import Taply from 'taply'
// @ts-ignore
import { useStyles } from 'floral'
import FocusLock from 'react-focus-lock'
import { useKey } from 'react-use'

import { Layer } from './layers'
import CloseButton from './CloseButton'
import { AppearAnimation, FadeAnimation } from './animations'
import useAnimatedValue from '../utils/useAnimatedValue'
import { FloralProps } from '../types'

interface ModalContextType {
    close: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

/*
Example usage:

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
    <ModalCloseButton />
</Modal>
*/

interface ModalProps extends FloralProps {
    children: (close: () => void) => React.ReactNode | React.ReactNode
    isOpen?: boolean
    onClose: () => void
    initialFocusRef?: any
    closeOnOverlayClick?: boolean
    closeOnEsc?: boolean
    Animation?: AppearAnimation
    isCentered?: boolean
    width?: string | number
}

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
        overflowY: 'auto',
        boxSizing: 'border-box',
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
        Animation,
        closeOnOverlayClick,
        closeOnEsc,
        onClose
    } = props
    const styles = useStyles(modalStyles, [props, { isOpen }])
    const [openValue, isRest] = useAnimatedValue(isOpen ? 1 : 0)
    const context = useMemo(() => ({ close: onClose }), [])
    const isActive = isOpen || !isRest
    const modalChildren = useMemo(() => {
        if (isActive) {
            return typeof children === 'function' ? children(onClose) : children
        } else {
            return null
        }
    }, [children, isActive])
    useKey('Escape', () => {
        if (closeOnEsc) onClose()
    })
    return (
        <>
            <Layer type="modal" isActive={isActive}>
                <FadeAnimation
                    openValue={openValue}
                    style={styles.overlay}
                    onClick={closeOnOverlayClick && onClose}
                />
                <div style={styles.container}>
                    <Animation openValue={openValue} style={styles.window}>
                        <ModalContext.Provider value={context}>
                            <FocusLock>{modalChildren}</FocusLock>
                        </ModalContext.Provider>
                    </Animation>
                </div>
            </Layer>
        </>
    )
}

Modal.defaultProps = {
    Animation: FadeAnimation,
    closeOnEsc: true,
    width: 800
}

interface ModalCloseButtonProps extends FloralProps {
    children: React.ReactNode
}

const ModalCloseButton = (props: ModalCloseButtonProps) => {
    const { children } = props
    const context = useContext(ModalContext)
    if (!context) {
        throw new Error(
            'You can use <ModalCloseButton> only inside <Modal> component'
        )
    }
    return <CloseButton onTap={context.close}>{children}</CloseButton>
}

export { Modal, ModalCloseButton }
