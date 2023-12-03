import { useState } from 'react'

import { Modal, animationFunctions } from 'oriente'

import buttonStyle from '../buttonStyle'

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

const ExampleModal = (props: React.ComponentProps<typeof Modal>) => {
    return <Modal styles={exampleModalStyles} {...props} />
}

const ModalExample = ({
    children,
    ...rest
}: React.ComponentProps<typeof Modal>) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <>
            <div style={buttonStyle} onClick={() => setIsOpen(true)}>
                Open modal
            </div>
            <ExampleModal
                {...rest}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                closeOnOverlayClick={true}
            >
                {(close) => <>{children(close)}</>}
            </ExampleModal>
        </>
    )
}

const animations = {
    fade: animationFunctions.fade(),
    slide: animationFunctions.compose(
        animationFunctions.fade(),
        animationFunctions.slide({ side: 'top', distance: 50 })
    )
}

const ModalAnimationExample = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [animation, setAnimation] = useState('fade')

    return (
        <>
            <div style={buttonStyle} onClick={() => setIsOpen(true)}>
                Open modal
            </div>{' '}
            {Object.keys(animations).map((value) => (
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
                animation={animations[animation]}
            >
                {(close) => (
                    <>
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
