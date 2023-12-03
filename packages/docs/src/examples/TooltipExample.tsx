import { useState } from 'react'
import { Tooltip, TooltipArrow, animationFunctions } from 'oriente'

import buttonStyle from '../buttonStyle'

const TooltipExample = ({
    children = 'target',
    tooltip = 'Tooltip!',
    ...restProps
}) => {
    let [active, setActive] = useState(false)
    let style = {
        padding: '8px 12px',
        background: '#8e44ad',
        willChange: 'transform',
        color: 'white'
    }
    return (
        <Tooltip tooltip={tooltip} style={style} {...restProps}>
            <div
                tabIndex={0}
                style={buttonStyle}
                onClick={() => setActive((val) => !val)}
            >
                {children}
            </div>
        </Tooltip>
    )
}

const ControlledTooltipExample = () => {
    let [isOpen, setIsOpen] = useState(false)
    return (
        <div>
            <TooltipExample isOpen={isOpen} />
            <label>
                <input
                    type="checkbox"
                    value={isOpen}
                    onChange={() => setIsOpen((v) => !v)}
                />{' '}
                isOpen
            </label>
        </div>
    )
}

const animations = {
    slide: animationFunctions.compose([
        animationFunctions.slide,
        animationFunctions.fade
    ]),
    scale: animationFunctions.scale
}

const TooltipAnimationExample = () => {
    const [animation, setAnimation] = useState('slide')

    return (
        <>
            <TooltipExample animation={animations[animation]} />{' '}
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
        </>
    )
}

export { TooltipExample, ControlledTooltipExample, TooltipAnimationExample }
