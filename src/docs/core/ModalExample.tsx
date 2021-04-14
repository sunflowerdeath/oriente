import React, { useState } from 'react'
// @ts-ignore
import { extendComponentStyles } from 'floral'

import { Modal, ModalCloseButton } from '../../core/Modal'

const exampleModalStyles = () => ({
    container: {
        paddingTop: 100,
        paddingBottom: 100
    },
    window: {
        background: '#2c3e50',
        color: 'white',
        padding: 32
    }
})

const ExampleModal = extendComponentStyles(Modal, exampleModalStyles)

const ModalExample = ({ children } : { children : React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <>
            <button onClick={() => setIsOpen(true)}>Open modal</button>
            <ExampleModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                closeOnOverlayClick={true}
            >
                {(close) => (
                    <>
                        <ModalCloseButton />
                        {children(close)}
                    </>
                )}
            </ExampleModal>
        </>
    )
}

export default ModalExample
