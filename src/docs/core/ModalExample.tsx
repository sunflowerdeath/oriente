import React, { useState } from 'react'
// @ts-ignore
import { extendComponentStyles } from 'floral'

import { Modal } from '../../core/Modal'

const exampleModalStyles = () => ({
    container: {
        paddingTop: 100
    },
    window: {
        padding: 32
    }
})

const ExampleModal = extendComponentStyles(Modal, exampleModalStyles)

const ModalExample = () => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <>
            <button onClick={() => setIsOpen(true)}>Open modal</button>
            <ExampleModal isOpen={isOpen}>
                Modal
                <br />
                <button onClick={() => setIsOpen(false)}>Close modal</button>
            </ExampleModal>
        </>
    )
}

export default ModalExample
