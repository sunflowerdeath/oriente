import React, { useState } from 'react'
// @ts-ignore
import { extendComponentStyles } from 'floral'

import { Modal, ModalCloseButton } from '../../core/Modal'
import { FadeAnimation, SlideAnimation } from '../../core/animations'

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

const ModalExample = ({
    children,
    ...rest
}: React.ComponentProps<typeof Modal>) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <>
            <button onClick={() => setIsOpen(true)}>Open modal</button>
            <ExampleModal
                {...rest}
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

const ModalAnimationExample = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [animation, setAnimation] = useState('fade')
    const items = {
        fade: FadeAnimation,
        slide: (props) => <SlideAnimation side="top" distance={50} {...props} />
    }

    return (
        <>
            <button onClick={() => setIsOpen(true)}>Open modal</button>
            {' '}
            {Object.keys(items).map((value) => (
                <label>
                    <input
                        type="checkbox"
                        onChange={() => setAnimation(value)}
                        checked={animation === value}
                    />
                    {value}
                </label>
            ))}
            <ExampleModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                closeOnOverlayClick={true}
                Animation={items[animation]}
            >
                {(close) => (
                    <>
                        <ModalCloseButton />
                        Modal
                        <br />
                        <br />
                        <button onClick={close}>Close modal</button>
                    </>
                )}
            </ExampleModal>
        </>
    )
}

export { ModalExample, ModalAnimationExample }
