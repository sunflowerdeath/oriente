import React, { useState } from 'react'

import { Tooltip, TooltipArrow } from '../../core/Tooltip'
import { SlideAnimation, ScaleAnimation } from '../../core/animations'

import buttonStyle from './buttonStyle'

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

const TooltipAnimationExample = () => {
    const [animation, setAnimation] = useState('slide')
    const items = {
        slide: SlideAnimation,
        scale: ScaleAnimation
    }

    return (
        <>
            <TooltipExample Animation={items[animation]} />{' '}
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
        </>
    )
}

export { TooltipExample, ControlledTooltipExample, TooltipAnimationExample }
