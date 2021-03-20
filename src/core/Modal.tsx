import React from 'react'
// @ts-ignore
import { useStyles } from 'floral'

import { Layer } from './layers'
import { AppearAnimation, FadeAnimation, SlideAnimation } from './animations'
import useAnimatedValue from '../utils/useAnimatedValue'
import { FloralProps } from '../types'

/*
Example usage:

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
    <ModalCloseButton />
</Modal>
*/

interface ModalProps extends FloralProps {
    children: React.ReactNode
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
    let container = {
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: props.isCentered ? 'center' : 'flex-start',
        overflowY: 'auto'
    }
    let window = {
        background: 'white',
        width: props.width
    }
    let overlay = {
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
    let { isOpen, children, Animation } = props
    let styles = useStyles(modalStyles, [props])
    let [openValue, isRest] = useAnimatedValue(isOpen ? 1 : 0)
    let isActive = isOpen || !isRest
    return (
        <>
            <Layer type="modal" isActive={isActive}>
                <FadeAnimation openValue={openValue} style={styles.overlay} />
            </Layer>
            <Layer type="modal" isActive={isActive}>
                <Animation openValue={openValue} style={styles.container}>
                    <div style={styles.window}>{children}</div>
                </Animation>
            </Layer>
        </>
    )
}

Modal.defaultProps = {
    Animation: SlideAnimation,
    width: 800
}

interface ModalCloseButtonProps extends FloralProps {
    children: React.ReactNode
}

const ModalCloseButton = () => <div />

export { Modal, ModalCloseButton }
