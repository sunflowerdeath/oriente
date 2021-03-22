import React, { useMemo } from 'react'
// @ts-ignore
import Taply from 'taply'
// @ts-ignore
import { useStyles } from 'floral'
import FocusLock from 'react-focus-lock'

import { Layer } from './layers'
import { AppearAnimation, FadeAnimation } from './animations'
import useAnimatedValue from '../utils/useAnimatedValue'
import { FloralProps } from '../types'

/*
Example usage:

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
    <ModalCloseButton />
</Modal>
*/

interface ModalProps extends FloralProps {
    children: () => React.ReactNode | React.ReactNode
    isOpen?: boolean
    onClose?: () => void
    initialFocusRef?: any
    closeOnOverlayClick?: boolean
    closeOnEsc?: boolean
    Animation?: AppearAnimation
    isCentered?: boolean
    width?: string | number
}

const modalStyles = (props: ModalProps) => {
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
        pointerEvents: 'none'
    }
    const window = {
        background: 'white',
        width: props.width,
        pointerEvents: 'all'
    }
    const overlay = {
        background: 'rgba(0,0,0,.5)',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
    }
    return { container, window, overlay }
}

const Modal = (props: ModalProps) => {
    const { isOpen, children, Animation, closeOnOverlayClick, onClose } = props
    const styles = useStyles(modalStyles, [props])
    const [openValue, isRest] = useAnimatedValue(isOpen ? 1 : 0)
    const isActive = isOpen || !isRest
    const modalChildren = useMemo(() => {
        if (isActive) {
            return typeof children === 'function' ? children() : children
        } else {
            return null
        }
    }, [children, isActive])
    return (
        <>
            <Layer type="modal" isActive={isActive}>
                <FadeAnimation
                    openValue={openValue}
                    style={styles.overlay}
                    onClick={closeOnOverlayClick && onClose}
                />
            </Layer>
            <Layer type="modal" isActive={isActive}>
                <div style={styles.container}>
                    <Animation openValue={openValue}>
                        <FocusLock>
                            <div style={styles.window}>{modalChildren}</div>
                        </FocusLock>
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

const ModalCloseButtonStyles = {
    root: {
        cursor: 'pointer'
    }
}

const ModalCloseButton = (props: ModalCloseButtonStyles) => {
    const styles = useStyles(modalStyles, [props])
    return (
        <Taply onTap={() => {}}>
            <div style={styles.root}>{children}</div>
        </Taply>
    )
}

export { Modal, ModalCloseButton }
